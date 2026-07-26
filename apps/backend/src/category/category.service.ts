import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    if (!input._id || !Types.ObjectId.isValid(input._id)) {
      throw new BadRequestException('ID de categoría inválido.');
    }

    const categoryId = new Types.ObjectId(input._id);
    const category = await this.model.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Categoría no encontrada.');
    }

    const productCount = await this.productService.countProductsWithCategory(category.name);
    if (productCount > 0) {
      throw new BadRequestException(
        `No se puede eliminar la categoría "${category.name}" porque tiene ${productCount} producto(s) asociado(s).`,
      );
    }

    return this.model.findByIdAndDelete(categoryId);
  }
}
