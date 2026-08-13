import { InputType, Field, Float } from '@nestjs/graphql';
import { PromotionRewardType, PromotionScope, PromotionType } from '../promotion.schema';

@InputType()
export class AddPromotionInput {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  name: string;

  @Field(() => PromotionType)
  type: PromotionType;

  @Field()
  fromDate: Date;

  @Field()
  toDate: Date;

  @Field(() => PromotionRewardType)
  rewardType: PromotionRewardType;

  @Field(() => Float, { nullable: true })
  percentage?: number;

  @Field(() => Float, { nullable: true })
  fixedPrice?: number;

  @Field(() => PromotionScope, { nullable: true })
  scope?: PromotionScope;

  @Field({ nullable: true })
  productId?: string;

  @Field({ nullable: true })
  categoryId?: string;

  @Field({ nullable: true })
  code?: string;
}
