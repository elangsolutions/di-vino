import { InputType, Field } from '@nestjs/graphql';
import {DeliveryInput} from "../order.schema";


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

@InputType()
export class CreateOrderDraftInput {
    @Field(() => [OrderItemInput])
    items: OrderItemInput[];

    @Field(() => DeliveryInput)
    delivery: DeliveryInput;

    @Field()
    userId: string;
}
