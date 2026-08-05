import {InputType, Field} from '@nestjs/graphql';
import {OrderStatus} from "../order.schema";


@InputType()
export class UpdateOrderStatusInput {
    @Field()
    orderId: string;

    @Field(() => OrderStatus)
    status: OrderStatus;
}
