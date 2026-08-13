import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Promotion,
  PromotionRewardType,
  PromotionScope,
  PromotionType,
} from './promotion.schema';
import { AddPromotionInput } from './dto/add-promotion.input';
import { RemovePromotionInput } from './dto/remove-promotion.input';
import {
  PromotionCartItemInput,
  ValidatePromotionCodeInput,
} from './dto/evaluate-promotions.input';
import {
  PromotionDiscountResult,
  PromotionEvaluation as PromotionEvaluationResult,
} from './dto/promotion-evaluation.result';
import { Product } from '../product/product.schema';
import { Category } from '../category/category.schema';
import { PromotionCode } from '../promotion-code/promotion-code.schema';
import { BoxPromotion } from '../box-promotion/box-promotion.schema';
import {
  applyAutoPromotions,
  computePromoCodeDiscount,
  PricedCartItem,
  PromotionRule,
  roundMoney,
} from './promotion-pricing';

@Injectable()
export class PromotionService implements OnModuleInit {
  constructor(
    @InjectModel(Promotion.name) private model: Model<Promotion>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(PromotionCode.name) private promotionCodeModel: Model<PromotionCode>,
    @InjectModel(BoxPromotion.name) private boxPromotionModel: Model<BoxPromotion>,
  ) {}

  async onModuleInit() {
    await this.migrateLegacyPromotions();
    await this.backfillProductPackSizes();
  }

  async create(input: AddPromotionInput) {
    const payload = await this.normalizeInput(input);

    if (input._id && Types.ObjectId.isValid(input._id)) {
      const updated = await this.model.findOneAndUpdate(
        { _id: new Types.ObjectId(input._id) },
        { $set: payload },
        { new: true },
      );
      if (!updated) {
        throw new NotFoundException('Promoción no encontrada.');
      }
      return updated;
    }

    return this.model.create(payload);
  }

  async findAll() {
    return this.model.find().sort({ fromDate: -1 });
  }

  async findOne(_id: string) {
    return this.model.findOne({ _id });
  }

  async findActive(at: Date = new Date()) {
    return this.model
      .find({ fromDate: { $lte: at }, toDate: { $gte: at } })
      .sort({ fromDate: -1 });
  }

  async findActiveAuto(at: Date = new Date()) {
    return this.model
      .find({
        type: { $in: [PromotionType.BULK, PromotionType.PRODUCT] },
        fromDate: { $lte: at },
        toDate: { $gte: at },
      })
      .sort({ fromDate: -1 });
  }

  async delete(input: RemovePromotionInput) {
    if (!input._id || !Types.ObjectId.isValid(input._id)) {
      throw new BadRequestException('ID de promoción inválido.');
    }

    const promotion = await this.model.findById(input._id);
    if (!promotion) {
      throw new NotFoundException('Promoción no encontrada.');
    }

    return this.model.findByIdAndDelete(input._id);
  }

  async categoryName(categoryId?: string): Promise<string | undefined> {
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return undefined;
    }
    const category = await this.categoryModel.findById(categoryId);
    return category?.name;
  }

  async evaluate(items: PromotionCartItemInput[]): Promise<PromotionEvaluationResult> {
    const originalTotal = roundMoney(
      items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    );

    if (items.length === 0) {
      return {
        originalTotal,
        discountAmount: 0,
        finalTotal: originalTotal,
        applications: [],
      };
    }

    const [pricedItems, promotions, promotionById, categoryNameById] = await this.loadEvaluationContext(items);
    const autoRules = promotions.filter(
      (promo) => promo.type === PromotionType.BULK || promo.type === PromotionType.PRODUCT,
    );
    const evaluation = applyAutoPromotions(pricedItems, this.toRules(autoRules, categoryNameById));

    return {
      originalTotal: evaluation.originalTotal,
      discountAmount: evaluation.discountAmount,
      finalTotal: evaluation.finalTotal,
      applications: evaluation.applications.flatMap((application) => {
        const promotion = promotionById.get(application.promotionId);
        if (!promotion) {
          return [];
        }
        return [{
          promotion,
          matchingQuantity: application.matchingQuantity,
          boxes: application.boxes,
          remainderQuantity: application.remainderQuantity,
          unitsPerBulk: application.unitsPerBulk,
          originalSubtotal: application.originalSubtotal,
          promotionalSubtotal: application.promotionalSubtotal,
          discountAmount: application.discountAmount,
        }];
      }),
    };
  }

  async validateCode(input: ValidatePromotionCodeInput): Promise<PromotionDiscountResult> {
    const normalizedCode = input.code.trim().toUpperCase();
    const originalTotal = roundMoney(
      input.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    );

    if (!normalizedCode) {
      return this.invalidCode('Ingresá un código promocional.', originalTotal);
    }
    if (input.items.length === 0 || originalTotal <= 0) {
      return this.invalidCode('El carrito está vacío.', originalTotal);
    }

    const promotion = await this.model.findOne({
      type: PromotionType.PROMO_CODE,
      code: normalizedCode,
    });
    if (!promotion) {
      return this.invalidCode('Código promocional inválido.', originalTotal);
    }

    const now = new Date();
    if (now < promotion.fromDate || now > promotion.toDate) {
      return this.invalidCode('Este código promocional no está vigente.', originalTotal);
    }

    const [pricedItems, , , categoryNameById] = await this.loadEvaluationContext(input.items);
    const autoPromotions = (await this.findActiveAuto()).filter(
      (item) => String(item._id) !== String(promotion._id),
    );
    const autoEval = applyAutoPromotions(
      pricedItems.map((item) => ({ ...item })),
      this.toRules(autoPromotions, categoryNameById),
    );

    const codeResult = computePromoCodeDiscount(
      pricedItems,
      this.toRules([promotion], categoryNameById)[0],
    );
    if ('error' in codeResult) {
      return this.invalidCode(codeResult.error, originalTotal);
    }

    const discountAmount = codeResult.discountAmount;
    const finalTotal = roundMoney(Math.max(0, autoEval.finalTotal - discountAmount));

    return {
      valid: true,
      message: 'Código aplicado correctamente.',
      originalTotal,
      discountAmount,
      finalTotal,
      promotion,
    };
  }

  private invalidCode(message: string, originalTotal: number): PromotionDiscountResult {
    return {
      valid: false,
      message,
      originalTotal,
      discountAmount: 0,
      finalTotal: originalTotal,
    };
  }

  private async normalizeInput(input: AddPromotionInput) {
    const name = input.name?.trim();
    if (!name) {
      throw new BadRequestException('El nombre de la promoción es obligatorio.');
    }
    if (input.fromDate >= input.toDate) {
      throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin.');
    }

    const type = this.normalizeType(input.type);
    const rewardType = this.normalizeReward(input.rewardType);
    const scope = this.normalizeScope(input.scope, type);

    if (rewardType === PromotionRewardType.PERCENTAGE) {
      if (!input.percentage || input.percentage <= 0 || input.percentage > 100) {
        throw new BadRequestException('El porcentaje debe estar entre 1 y 100.');
      }
    } else if (!input.fixedPrice || input.fixedPrice <= 0) {
      throw new BadRequestException('El precio o monto fijo debe ser mayor a 0.');
    }

    if (type === PromotionType.BULK) {
      if (scope === PromotionScope.PRODUCT && !input.productId) {
        throw new BadRequestException('Debes seleccionar un producto.');
      }
      if (scope === PromotionScope.CATEGORY && !input.categoryId) {
        throw new BadRequestException('Debes seleccionar una categoría.');
      }
    }

    if (type === PromotionType.PRODUCT && !input.productId) {
      throw new BadRequestException('Debes seleccionar un producto.');
    }

    let code: string | undefined;
    if (type === PromotionType.PROMO_CODE) {
      code = input.code?.trim().toUpperCase();
      if (!code) {
        throw new BadRequestException('El código promocional es obligatorio.');
      }
      const existing = await this.model.findOne({
        type: PromotionType.PROMO_CODE,
        code,
        ...(input._id && Types.ObjectId.isValid(input._id)
          ? { _id: { $ne: new Types.ObjectId(input._id) } }
          : {}),
      });
      if (existing) {
        throw new BadRequestException(`El código "${code}" ya existe.`);
      }
      if (scope === PromotionScope.PRODUCT && !input.productId) {
        throw new BadRequestException('Debes seleccionar un producto.');
      }
      if (scope === PromotionScope.CATEGORY && !input.categoryId) {
        throw new BadRequestException('Debes seleccionar una categoría.');
      }
    }

    return {
      name,
      type,
      fromDate: input.fromDate,
      toDate: input.toDate,
      rewardType,
      percentage: rewardType === PromotionRewardType.PERCENTAGE ? input.percentage : undefined,
      fixedPrice: rewardType === PromotionRewardType.FIXED_PRICE ? input.fixedPrice : undefined,
      scope,
      code,
      productId:
        scope === PromotionScope.PRODUCT || type === PromotionType.PRODUCT
          ? input.productId
          : undefined,
      categoryId: scope === PromotionScope.CATEGORY ? input.categoryId : undefined,
    };
  }

  private normalizeType(type: string | PromotionType): PromotionType {
    const value = String(type).toUpperCase();
    if (value === PromotionType.PRODUCT) return PromotionType.PRODUCT;
    if (value === PromotionType.PROMO_CODE) return PromotionType.PROMO_CODE;
    return PromotionType.BULK;
  }

  private normalizeReward(reward: string | PromotionRewardType): PromotionRewardType {
    return String(reward).toUpperCase() === PromotionRewardType.FIXED_PRICE
      ? PromotionRewardType.FIXED_PRICE
      : PromotionRewardType.PERCENTAGE;
  }

  private normalizeScope(
    scope: string | PromotionScope | undefined,
    type: PromotionType,
  ): PromotionScope {
    const value = String(scope ?? '').toUpperCase();
    if (type === PromotionType.PRODUCT) {
      return PromotionScope.PRODUCT;
    }
    if (type === PromotionType.PROMO_CODE) {
      if (value === PromotionScope.PRODUCT) return PromotionScope.PRODUCT;
      if (value === PromotionScope.CATEGORY) return PromotionScope.CATEGORY;
      return PromotionScope.ORDER;
    }
    return value === PromotionScope.CATEGORY ? PromotionScope.CATEGORY : PromotionScope.PRODUCT;
  }

  private async loadEvaluationContext(items: PromotionCartItemInput[]) {
    const [products, categories, promotions] = await Promise.all([
      this.loadProducts(items.map((item) => item.productId)),
      this.categoryModel.find(),
      this.findActive(),
    ]);

    const productById = new Map(products.map((product) => [String(product._id), product]));
    const categoryNameById = new Map(
      categories.map((category) => [String(category._id), category.name]),
    );
    const promotionById = new Map(
      promotions.map((promotion) => [String(promotion._id), promotion]),
    );

    const pricedItems: PricedCartItem[] = items
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        category: productById.get(item.productId)?.category ?? '',
        unitsPerBulk: productById.get(item.productId)?.unitsPerBulk,
      }));

    return [pricedItems, promotions, promotionById, categoryNameById] as const;
  }

  private toRules(
    promotions: Promotion[],
    categoryNameById: Map<string, string>,
  ): PromotionRule[] {
    return promotions.map((promotion) => ({
      id: String(promotion._id),
      name: promotion.name,
      type: promotion.type,
      rewardType: promotion.rewardType,
      percentage: promotion.percentage,
      fixedPrice: promotion.fixedPrice,
      scope: promotion.scope,
      productId: promotion.productId,
      categoryName: promotion.categoryId
        ? categoryNameById.get(promotion.categoryId)
        : undefined,
      code: promotion.code,
    }));
  }

  private async loadProducts(productIds: string[]) {
    const uniqueIds = [...new Set(productIds)].filter((id) => Types.ObjectId.isValid(id));
    if (!uniqueIds.length) {
      return [];
    }
    return this.productModel.find({
      _id: { $in: uniqueIds.map((id) => new Types.ObjectId(id)) },
    });
  }

  private async migrateLegacyPromotions() {
    const existing = await this.model.estimatedDocumentCount();
    if (existing > 0) {
      return;
    }

    const [codes, boxes] = await Promise.all([
      this.promotionCodeModel.find(),
      this.boxPromotionModel.find(),
    ]);

    const docs = [
      ...codes.map((code) => ({
        name: code.code,
        type: PromotionType.PROMO_CODE,
        fromDate: code.fromDate,
        toDate: code.toDate,
        rewardType: PromotionRewardType.PERCENTAGE,
        percentage: code.percentage,
        scope: String(code.scope).toUpperCase() === 'PRODUCT'
          ? PromotionScope.PRODUCT
          : PromotionScope.ORDER,
        productId: code.productId,
        code: code.code,
      })),
      ...boxes.map((box) => ({
        name: box.name,
        type: PromotionType.BULK,
        fromDate: box.fromDate,
        toDate: box.toDate,
        rewardType: PromotionRewardType.FIXED_PRICE,
        fixedPrice: box.boxPrice,
        scope: String(box.scope).toUpperCase() === 'CATEGORY'
          ? PromotionScope.CATEGORY
          : PromotionScope.PRODUCT,
        productId: box.productId,
        categoryId: box.categoryId,
      })),
    ];

    if (docs.length) {
      await this.model.insertMany(docs);
    }

    for (const box of boxes) {
      await this.copyPackSizeToProducts(box.boxQuantity, box.productId, box.categoryId);
    }
  }

  private async backfillProductPackSizes() {
    const bulkPromos = await this.model.find({ type: PromotionType.BULK }).lean();
    for (const promo of bulkPromos) {
      const boxQuantity = (promo as { boxQuantity?: number }).boxQuantity;
      await this.copyPackSizeToProducts(boxQuantity, promo.productId, promo.categoryId);
    }
  }

  private async copyPackSizeToProducts(
    boxQuantity?: number,
    productId?: string,
    categoryId?: string,
  ) {
    if (!boxQuantity || boxQuantity < 2) {
      return;
    }

    const missingPackSize = {
      $or: [{ unitsPerBulk: { $exists: false } }, { unitsPerBulk: null }],
    };

    if (productId && Types.ObjectId.isValid(productId)) {
      await this.productModel.updateOne(
        { _id: new Types.ObjectId(productId), ...missingPackSize },
        { $set: { unitsPerBulk: boxQuantity } },
      );
    }

    if (categoryId && Types.ObjectId.isValid(categoryId)) {
      const category = await this.categoryModel.findById(categoryId);
      if (category?.name) {
        await this.productModel.updateMany(
          { category: category.name, ...missingPackSize },
          { $set: { unitsPerBulk: boxQuantity } },
        );
      }
    }
  }
}
