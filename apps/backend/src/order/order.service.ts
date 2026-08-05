import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderIssueReason } from './order.schema';
import { Model } from 'mongoose';
import {CreateOrderDraftInput} from "./dto/create-order.input";
import {ReportOrderIssueInput} from "./dto/report-order-issue.input";
import {createOrderNumber} from "./utils";
import {ConfigService} from "../config/config.service";

@Injectable()
export default class OrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<Order>,
        private readonly configService: ConfigService,
    ) {}

    async findAll() {
        return this.orderModel.find();
    }

    async findById(id: string): Promise<Order | null> {
        return this.orderModel.findById(id);
    }

    async create(input: CreateOrderDraftInput): Promise<Order> {
        const external_reference = createOrderNumber();
        const status = this.configService.isPaymentTesting ? 'paid' : 'pending_payment';
        const created = new this.orderModel({...input, status, external_reference });
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
