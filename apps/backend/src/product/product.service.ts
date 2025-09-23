import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import {Model, Types} from 'mongoose';
import {AddProductInput} from "./dto/add-product.input";
import {RemoveProductInput} from "./dto/remove-product.input";
import OrderService from "../order/order.service";

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private model: Model<Product>,
              private readonly orderService: OrderService) {}

  async create(input: AddProductInput) {

    return this.model.findOneAndUpdate(
        { _id: new Types.ObjectId(input._id) },
        { $set: input },
        { upsert: true, new: true },
    );

  }

  async findAll() {
    return this.model.find();
  }

  async findOne(_id: string) {
    return this.model.findOne({_id});
  }

  async delete(input: RemoveProductInput) {

    if(await this.ensureDelete(input)) {
      return this.model.findOneAndUpdate(
          {_id: new Types.ObjectId(input._id)},
          {$set: input},
          {upsert: true, new: true},
      );
    }
  }
  async ensureDelete(productInput: RemoveProductInput) {
    if(await this.orderService.countOrdersWithProduct(productInput._id)){
      throw new Error('Product cannot be delete, Orders were found.');
    }
    return true;
  }
}
