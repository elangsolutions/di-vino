import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { Document } from 'mongoose';
import {Delivery} from "./delivery/delivery.schema";
import {AddAddressInput} from "../user/address/dto/add-address.input";

export enum DeliveryType {
    PICKUP = 'pickup',
    ADDRESS = 'address',
}

registerEnumType(DeliveryType, { name: 'DeliveryType' });

@ObjectType()
export class OrderItem {
    @Field()
    @Prop()
    productId: string;

    @Field()
    @Prop()
    title: string;

    @Field()
    @Prop()
    price: number;

    @Field()
    @Prop()
    quantity: number;
}

@InputType('DeliveryInput')
export class DeliveryInput {
    @Field(() => DeliveryType)
    type: DeliveryType;

    @Field({ nullable: true })
    locationId?: string;

    @Field(() => AddAddressInput, { nullable: true })
    address?: AddAddressInput;
}

@ObjectType()
@Schema({ timestamps: true })
export class Order extends Document {
    @Field(() => ID)
    declare _id: string;

    @Field(() => [OrderItem])
    @Prop({ type: [OrderItem], required: true })
    items: OrderItem[];

    @Field(() => Delivery)
    @Prop({ type: Delivery, required: true })
    delivery: Delivery;

    @Field()
    @Prop({ required: true })
    userId: string;

    @Field()
    @Prop({ default: 'pending_payment' })
    status: 'pending_payment' | 'paid' | 'cancelled';

    @Field({ nullable: true })
    @Prop()
    mpPreferenceId?: string;

    @Field()
    @Prop()
    external_reference: string;

    @Field({ nullable: true })
    @Prop()
    mpInitPoint?: string;

    @Field({ nullable: true })
    @Prop()
    mpQrData?: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
