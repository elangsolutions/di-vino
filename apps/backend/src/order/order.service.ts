import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { Model } from 'mongoose';
import {CreateOrderDraftInput} from "./dto/create-order.input";
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

    async countOrdersWithProduct(_id: string):Promise<number> {
        return this.orderModel.countDocuments({
            "items.productId": _id
        });
    }
}
