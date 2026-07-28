import { ObjectType, Field, Float } from '@nestjs/graphql';
import { PromotionCode } from '../promotion-code.schema';

@ObjectType()
export class PromotionDiscountResult {
  @Field()
  valid: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field(() => Float)
  originalTotal: number;

  @Field(() => Float)
  discountAmount: number;

  @Field(() => Float)
  finalTotal: number;

  @Field(() => PromotionCode, { nullable: true })
  promotionCode?: PromotionCode;
}
