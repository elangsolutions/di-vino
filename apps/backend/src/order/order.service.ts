import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderIssueReason, OrderStatus, ORDER_STATUS_TRANSITIONS } from './order.schema';
import { Model } from 'mongoose';
import {CreateOrderDraftInput} from "./dto/create-order.input";
import {ReportOrderIssueInput} from "./dto/report-order-issue.input";
import {UpdateOrderStatusInput} from "./dto/update-order-status.input";
import {createOrderNumber} from "./utils";
import {ConfigService} from "../config/config.service";
import {PromotionService} from "../promotion/promotion.service";

@Injectable()
export default class OrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<Order>,
        private readonly configService: ConfigService,
        private readonly promotionService: PromotionService,
    ) {}

    async findAll() {
        return this.orderModel.find().sort({ createdAt: -1 });
    }

    async findById(id: string): Promise<Order | null> {
        return this.orderModel.findById(id);
    }

    async create(input: CreateOrderDraftInput): Promise<Order> {
        const external_reference = createOrderNumber();
        const status = this.configService.isPaymentTesting
            ? OrderStatus.PAID
            : OrderStatus.PENDING_PAYMENT;
        const promotionEvaluation = await this.promotionService.evaluate(
            input.items.map((item) => ({
                productId: item.productId,
                quantity: Math.max(0, Math.floor(item.quantity)),
                price: item.price,
            })),
        );
        const created = new this.orderModel({
            ...input,
            status,
            external_reference,
            discountAmount: promotionEvaluation.discountAmount,
        });
        return created.save();
    }

    async updateStatus(input: UpdateOrderStatusInput): Promise<Order> {
        const order = await this.orderModel.findById(input.orderId);
        if (!order) {
            throw new NotFoundException('Pedido no encontrado');
        }

        if (order.status === input.status) {
            return order;
        }

        const allowed = ORDER_STATUS_TRANSITIONS[order.status] ?? [];
        if (!allowed.includes(input.status)) {
            throw new BadRequestException(
                `No se puede pasar el pedido de "${order.status}" a "${input.status}"`,
            );
        }

        order.status = input.status;
        return order.save();
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
