import {Field, InputType} from "@nestjs/graphql";
import {AddAddressInput} from "../../../user/address/dto/add-address.input";
import {DeliveryType} from "../delivery.schema";

@InputType('AddDeliveryInput')
export class AddDeliveryInput {
    @Field(() => DeliveryType)
    type: DeliveryType;

    @Field({ nullable: true })
    locationId?: string;

    @Field(() => AddAddressInput, { nullable: true })
    address?: AddAddressInput;
}