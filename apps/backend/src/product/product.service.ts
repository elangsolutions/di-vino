import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import {Model, Schema, Types} from 'mongoose';
import {AddProductInput} from "./dto/add-product.input";


@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private model: Model<Product>) {}

  async create(input: AddProductInput) {
    console.log(`Hello ${input._id}`);


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
}
