import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class PromotionCartItemInput {
  @Field()
  productId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}

@InputType()
export class ValidatePromotionCodeInput {
  @Field()
  code: string;

  @Field(() => [PromotionCartItemInput])
  items: PromotionCartItemInput[];
}
