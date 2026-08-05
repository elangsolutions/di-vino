import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { Document } from 'mongoose';
import {Delivery, DeliveryType} from "./delivery/delivery.schema";
import {AddAddressInput} from "../user/address/dto/add-address.input";


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

export enum OrderIssueReason {
    OTHER_RECIPIENT = 'other_recipient',
    DATE_CHANGE = 'date_change',
    CANCEL = 'cancel',
    OTHER = 'other',
}

registerEnumType(OrderIssueReason, { name: 'OrderIssueReason' });

@ObjectType()
export class OrderIssue {
    @Field(() => OrderIssueReason)
    @Prop({ enum: OrderIssueReason, required: true })
    reason: OrderIssueReason;

    @Field({ nullable: true })
    @Prop()
    message?: string;

    @Field()
    @Prop({ default: Date.now })
    reportedAt: Date;
}

export enum OrderStatus {
    PENDING_PAYMENT = 'pending_payment',
    PAID = 'paid',
    PREPARING = 'preparing',
    READY = 'ready',
    DELIVERED = 'delivered',
    CLOSED = 'closed',
    CANCELLED = 'cancelled',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

/**
 * Forward-only lifecycle: an order can advance one step at a time, or be
 * cancelled at any point before it is delivered.
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PAID, OrderStatus.CANCELLED],
    [OrderStatus.PAID]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
    [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
    [OrderStatus.READY]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
    [OrderStatus.DELIVERED]: [OrderStatus.CLOSED],
    [OrderStatus.CLOSED]: [],
    [OrderStatus.CANCELLED]: [],
};

@InputType('DeliveryInput')
export class DeliveryInput {
    @Field(() => DeliveryType)
    type: DeliveryType;

    @Field({ nullable: true })
    locationId?: string;

    @Field(() => AddAddressInput, { nullable: true })
    address?: AddAddressInput;

    @Field(() => Date, { nullable: true })
    scheduledDate?: Date;

    @Field({ nullable: true })
    timeSlot?: string;
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

    @Field({ nullable: true })
    @Prop()
    customerName?: string;

    @Field({ nullable: true })
    @Prop()
    customerEmail?: string;

    @Field({ nullable: true })
    @Prop()
    customerPhone?: string;

    @Field(() => OrderStatus)
    @Prop({ enum: OrderStatus, default: OrderStatus.PENDING_PAYMENT })
    status: OrderStatus;

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

    @Field(() => [OrderIssue])
    @Prop({ type: [OrderIssue], default: [] })
    issues: OrderIssue[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
