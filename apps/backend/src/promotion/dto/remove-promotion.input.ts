import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RemovePromotionInput {
  @Field()
  _id: string;
}
