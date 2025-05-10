import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class AddProductInput {
    @Field()
    name: string;

    @Field()
    category: string;

    @Field(() => Float)
    price: number;

    @Field({ nullable: true })
    image?: string;
}
