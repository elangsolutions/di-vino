import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { Promotion } from '../promotion.schema';

@ObjectType()
export class PromotionApplicationResult {
  @Field(() => Promotion)
  promotion: Promotion;

  @Field(() => Int)
  matchingQuantity: number;

  @Field(() => Int, { nullable: true })
  boxes?: number;

  @Field(() => Int, { nullable: true })
  remainderQuantity?: number;

  @Field(() => Int, { nullable: true })
  unitsPerBulk?: number;

  @Field(() => Float)
  originalSubtotal: number;

  @Field(() => Float)
  promotionalSubtotal: number;

  @Field(() => Float)
  discountAmount: number;
}

@ObjectType()
export class PromotionEvaluation {
  @Field(() => Float)
  originalTotal: number;

  @Field(() => Float)
  discountAmount: number;

  @Field(() => Float)
  finalTotal: number;

  @Field(() => [PromotionApplicationResult])
  applications: PromotionApplicationResult[];
}

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

  @Field(() => Promotion, { nullable: true })
  promotion?: Promotion;
}
