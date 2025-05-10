import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import {AddProductInput} from "./dto/add-product.input";

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private model: Model<Product>) {}

  async create(input: AddProductInput) {
    return this.model.create(input);
  }

  async findAll() {
    return this.model.find();
  }
}
