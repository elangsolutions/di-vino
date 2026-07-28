import { InputType, Field, Float } from '@nestjs/graphql';
import { PromotionScope } from '../promotion-code.schema';

@InputType()
export class AddPromotionCodeInput {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  code: string;

  @Field()
  fromDate: Date;

  @Field()
  toDate: Date;

  @Field(() => Float)
  percentage: number;

  @Field(() => PromotionScope)
  scope: PromotionScope;

  @Field({ nullable: true })
  productId?: string;
}
