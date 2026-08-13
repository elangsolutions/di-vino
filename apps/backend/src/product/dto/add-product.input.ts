import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class AddProductInput {

    @Field({ nullable: true })
    _id: string;

    @Field()
    name: string;

    @Field()
    details: string;

    @Field()
    category: string;

    @Field(() => Int, { nullable: true })
    unitsPerBulk?: number;

    @Field(() => Float, { nullable: true })
    price?: number;

    @Field({ nullable: true })
    image?: string;
}
