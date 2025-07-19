import { InputType, Field, Float } from '@nestjs/graphql';

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

    @Field(() => Float)
    price: number;

    @Field({ nullable: true })
    image?: string;
}
