import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Promotion, PromotionSchema } from './promotion.schema';
import { PromotionService } from './promotion.service';
import { PromotionResolver } from './promotion.resolver';
import { Product, ProductSchema } from '../product/product.schema';
import { Category, CategorySchema } from '../category/category.schema';
import { PromotionCode, PromotionCodeSchema } from '../promotion-code/promotion-code.schema';
import { BoxPromotion, BoxPromotionSchema } from '../box-promotion/box-promotion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Promotion.name, schema: PromotionSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: PromotionCode.name, schema: PromotionCodeSchema },
      { name: BoxPromotion.name, schema: BoxPromotionSchema },
    ]),
  ],
  providers: [PromotionService, PromotionResolver],
  exports: [PromotionService],
})
export class PromotionModule {}
