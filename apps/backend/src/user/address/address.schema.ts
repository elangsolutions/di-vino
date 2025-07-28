import {Field, ObjectType} from "@nestjs/graphql";
import {Prop} from "@nestjs/mongoose";


@ObjectType()
export class Address {
    @Field()
    @Prop()
    street: string;

    @Field()
    @Prop()
    city: string;

    @Field()
    @Prop()
    postalCode: string;

    @Field()
    @Prop()
    province: string;
}
