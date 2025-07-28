import {Field, ObjectType} from "@nestjs/graphql";
import {Prop} from "@nestjs/mongoose";
import {Address} from "../../user/address/address.schema";


export enum DeliveryType {
    PICKUP = 'pickup',
    ADDRESS = 'address',
}

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