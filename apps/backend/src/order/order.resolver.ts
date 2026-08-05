import {Resolver, Mutation, Args, Query} from '@nestjs/graphql';
import { Order } from './order.schema';
import OrderService from './order.service';
import {CreateOrderDraftInput} from "./dto/create-order.input";
import {ReportOrderIssueInput} from "./dto/report-order-issue.input";


@Resolver(() => Order)
export class OrderResolver {
    constructor(private readonly orderService: OrderService) {}
    @Query(() => [Order])
    orders() {
        return this.orderService.findAll();
    }
    @Mutation(() => Order)
    async createOrder(@Args('input') input: CreateOrderDraftInput): Promise<Order> {
        return this.orderService.create(input);
    }

    @Mutation(() => Order)
    async reportOrderIssue(@Args('input') input: ReportOrderIssueInput): Promise<Order> {
        return this.orderService.reportIssue(input);
    }
}
