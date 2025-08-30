import {Field, ObjectType, registerEnumType} from "@nestjs/graphql";
import {Prop} from "@nestjs/mongoose";
import {Address} from "../../user/address/address.schema";


export enum DeliveryType {
    PICKUP = 'pickup',
    ADDRESS = 'address',
}

registerEnumType(DeliveryType, { name: 'DeliveryType' });

@ObjectType()
export class Delivery {
    @Field(() => DeliveryType)
    @Prop({ enum: DeliveryType })
    type: DeliveryType;

    @Field({ nullable: true })
    @Prop()
    locationId?: string;

    @Field(() => Address, { nullable: true })
    @Prop()
    address?: Address;
}