import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { Model, Types } from 'mongoose';
import { AddCategoryInput } from './dto/add-category.input';
import { RemoveCategoryInput } from './dto/remove-category.input';
import { ProductService } from '../product/product.service';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private model: Model<Category>,
              private readonly productService: ProductService) {}

  async create(input: AddCategoryInput) {
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
    return this.model.findOne({ _id });
  }

  async delete(input: RemoveCategoryInput) {
    const category = await this.model.findOne({ _id: input._id });
    if (!category) {
      return null;
    }

    await this.ensureDelete(category.name);

    return this.model.findOneAndDelete({ _id: new Types.ObjectId(input._id) });
  }

  async ensureDelete(categoryName: string) {
    if (await this.productService.countProductsWithCategory(categoryName)) {
      throw new Error('Category cannot be deleted, Products were found using this category.');
    }
    return true;
  }
}
