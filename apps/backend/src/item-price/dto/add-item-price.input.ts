import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class AddItemPriceInput {
  @Field({ nullable: true })
  _id: string;

  @Field()
  productId: string;

  @Field(() => Float)
  price: number;

  @Field()
  fromDate: Date;

  @Field()
  toDate: Date;

  @Field(() => Int)
  stock: number;

  @Field(() => [String], { nullable: true })
  promotionCodes?: string[];
}
