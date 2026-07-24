import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddCategoryInput {

    @Field({ nullable: true })
    _id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;
}
