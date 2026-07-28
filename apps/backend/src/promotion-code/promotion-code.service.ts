import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PromotionCode, PromotionScope } from './promotion-code.schema';
import { AddPromotionCodeInput } from './dto/add-promotion-code.input';
import { RemovePromotionCodeInput } from './dto/remove-promotion-code.input';
import { ValidatePromotionCodeInput } from './dto/validate-promotion-code.input';
import { PromotionDiscountResult } from './dto/promotion-discount.result';

@Injectable()
export class PromotionCodeService {
  constructor(
    @InjectModel(PromotionCode.name) private model: Model<PromotionCode>,
  ) {}

  async create(input: AddPromotionCodeInput) {
    const normalizedCode = input.code.trim().toUpperCase();

    if (input.percentage <= 0 || input.percentage > 100) {
      throw new BadRequestException('El porcentaje debe estar entre 1 y 100.');
    }

    if (input.fromDate >= input.toDate) {
      throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin.');
    }

    if (input.scope === PromotionScope.PRODUCT && !input.productId) {
      throw new BadRequestException('Debes seleccionar un producto para promociones por producto.');
    }

    if (input.scope === PromotionScope.ORDER) {
      input.productId = undefined;
    }

    const payload = {
      ...input,
      code: normalizedCode,
      scope: this.normalizeScope(input.scope),
    };

    if (input._id && Types.ObjectId.isValid(input._id)) {
      return this.model.findOneAndUpdate(
        { _id: new Types.ObjectId(input._id) },
        { $set: payload },
        { new: true },
      );
    }

    const existing = await this.model.findOne({ code: normalizedCode });
    if (existing) {
      throw new BadRequestException(`El código "${normalizedCode}" ya existe.`);
    }

    return this.model.create(payload);
  }

  async findAll() {
    const promotions = await this.model.find().sort({ fromDate: -1 });
    return promotions.map((promotion) => {
      promotion.scope = this.normalizeScope(promotion.scope);
      return promotion;
    });
  }

  async findOne(_id: string) {
    const promotion = await this.model.findOne({ _id });
    if (promotion) {
      promotion.scope = this.normalizeScope(promotion.scope);
    }
    return promotion;
  }

  async delete(input: RemovePromotionCodeInput) {
    if (!input._id || !Types.ObjectId.isValid(input._id)) {
      throw new BadRequestException('ID de código promocional inválido.');
    }

    const promotion = await this.model.findById(input._id);
    if (!promotion) {
      throw new NotFoundException('Código promocional no encontrado.');
    }

    return this.model.findByIdAndDelete(input._id);
  }

  private normalizeScope(scope: string | PromotionScope): PromotionScope {
    const value = String(scope).toUpperCase();
    return value === PromotionScope.PRODUCT
      ? PromotionScope.PRODUCT
      : PromotionScope.ORDER;
  }

  async validate(input: ValidatePromotionCodeInput): Promise<PromotionDiscountResult> {
    const normalizedCode = input.code.trim().toUpperCase();
    const originalTotal = input.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (!normalizedCode) {
      return {
        valid: false,
        message: 'Ingresá un código promocional.',
        originalTotal,
        discountAmount: 0,
        finalTotal: originalTotal,
      };
    }

    if (input.items.length === 0 || originalTotal <= 0) {
      return {
        valid: false,
        message: 'El carrito está vacío.',
        originalTotal,
        discountAmount: 0,
        finalTotal: originalTotal,
      };
    }

    const promotion = await this.model.findOne({ code: normalizedCode });
    if (!promotion) {
      return {
        valid: false,
        message: 'Código promocional inválido.',
        originalTotal,
        discountAmount: 0,
        finalTotal: originalTotal,
      };
    }

    const now = new Date();
    if (now < promotion.fromDate || now > promotion.toDate) {
      return {
        valid: false,
        message: 'Este código promocional no está vigente.',
        originalTotal,
        discountAmount: 0,
        finalTotal: originalTotal,
      };
    }

    const scope = this.normalizeScope(promotion.scope);
    let discountAmount = 0;

    if (scope === PromotionScope.ORDER) {
      discountAmount = originalTotal * (promotion.percentage / 100);
    } else {
      const matchingItems = input.items.filter(
        (item) => item.productId === promotion.productId,
      );

      if (matchingItems.length === 0) {
        return {
          valid: false,
          message: 'Este código no aplica a los productos de tu carrito.',
          originalTotal,
          discountAmount: 0,
          finalTotal: originalTotal,
        };
      }

      const matchingSubtotal = matchingItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      discountAmount = matchingSubtotal * (promotion.percentage / 100);
    }

    discountAmount = Math.round(discountAmount * 100) / 100;
    const finalTotal = Math.max(0, Math.round((originalTotal - discountAmount) * 100) / 100);

    // Ensure GraphQL enum serialization works for legacy lowercase DB values.
    promotion.scope = scope;

    return {
      valid: true,
      message: 'Código aplicado correctamente.',
      originalTotal,
      discountAmount,
      finalTotal,
      promotionCode: promotion,
    };
  }
}
