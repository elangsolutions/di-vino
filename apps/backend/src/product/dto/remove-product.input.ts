import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RemoveProductInput {

    @Field({ nullable: true })
    _id: string;

}
