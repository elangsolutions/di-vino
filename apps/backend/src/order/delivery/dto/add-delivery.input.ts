import {DeliveryType} from "../../order.schema";
import {Field, InputType} from "@nestjs/graphql";
import {AddAddressInput} from "../../../user/address/dto/add-address.input";

@InputType('AddDeliveryInput')
export class AddDeliveryInput {
    @Field(() => DeliveryType)
    type: DeliveryType;

    @Field({ nullable: true })
    locationId?: string;

    @Field(() => AddAddressInput, { nullable: true })
    address?: AddAddressInput;
}