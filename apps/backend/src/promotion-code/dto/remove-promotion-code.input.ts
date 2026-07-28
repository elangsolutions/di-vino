import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RemovePromotionCodeInput {
  @Field()
  _id: string;
}
