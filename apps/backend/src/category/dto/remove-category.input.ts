import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RemoveCategoryInput {

    @Field({ nullable: true })
    _id: string;

}
