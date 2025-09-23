import {InputType, Field, registerEnumType} from '@nestjs/graphql';
import {DeliveryInput} from "../order.schema";
import {GraphQLEnumType} from "graphql/type";
import {DeliveryType} from "../delivery/delivery.schema";


@InputType('OrderItemInput')
export class OrderItemInput {
    @Field()
    productId: string;

    @Field()
    title: string;

    @Field()
    price: number;

    @Field()
    quantity: number;
}


export enum OrderState {
    DRAFT='DRAFT',
    OPEN='OPEN',
    PAID='PAID',
    DELIVERED='DELIVERED',
    CLOSED='CLOSED',
}
registerEnumType(OrderState, { name: 'OrderState' });

@InputType()
export class CreateOrderDraftInput {
    @Field(() => OrderState)
    state: OrderState

    @Field(() => [OrderItemInput])
    items: OrderItemInput[];

    @Field(() => DeliveryInput)
    delivery: DeliveryInput;

    @Field()
    userId: string;
}
