import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private model: Model<Product>) {}

  async create(name: string, price: number) {
    return this.model.create({ name, price });
  }

  async findAll() {
    return this.model.find();
  }
}
