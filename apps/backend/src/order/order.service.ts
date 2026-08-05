import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderIssueReason } from './order.schema';
import { Model } from 'mongoose';
import {CreateOrderDraftInput} from "./dto/create-order.input";
import {ReportOrderIssueInput} from "./dto/report-order-issue.input";
import {createOrderNumber} from "./utils";

@Injectable()
export default class OrderService {
    constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

    async findAll() {
        return this.orderModel.find();
    }

    async create(input: CreateOrderDraftInput): Promise<Order> {
        const external_reference = createOrderNumber();
        const created = new this.orderModel({...input, status: 'pending_payment' , external_reference });
        return created.save();
    }

    async reportIssue(input: ReportOrderIssueInput): Promise<Order> {
        const message = input.message?.trim();
        if (input.reason === OrderIssueReason.OTHER && !message) {
            throw new BadRequestException('Contanos brevemente qué pasó');
        }

        const order = await this.orderModel.findByIdAndUpdate(
            input.orderId,
            { $push: { issues: { reason: input.reason, message, reportedAt: new Date() } } },
            { new: true },
        );

        if (!order) {
            throw new NotFoundException('Pedido no encontrado');
        }
        return order;
    }

    async countOrdersWithProduct(_id: string):Promise<number> {
        return this.orderModel.countDocuments({
            "items.productId": _id
        });
    }
}
