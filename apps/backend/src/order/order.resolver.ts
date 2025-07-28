import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Order } from './order.schema';
import { OrderService } from './order.service';
import {CreateOrderDraftInput} from "./dto/create-order.input";

@Resolver(() => Order)
export class OrderResolver {
    constructor(private readonly orderService: OrderService) {}

    @Mutation(() => Order)
    async createOrderDraft(@Args('input') input: CreateOrderDraftInput): Promise<Order> {
        return this.orderService.createDraft(input);
    }
}
