import {Field, InputType} from "@nestjs/graphql";


@InputType('AddAddressInput')
export class AddAddressInput {
    @Field()
    street: string;

    @Field()
    city: string;

    @Field()
    postalCode: string;

    @Field()
    province: string;
}