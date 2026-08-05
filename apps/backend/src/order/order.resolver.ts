import {Resolver, Mutation, Args, Query} from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
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

    @Query(() => Order)
    async order(@Args('id') id: string): Promise<Order> {
        const order = await this.orderService.findById(id);
        if (!order) {
            throw new NotFoundException('Pedido no encontrado');
        }
        return order;
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
