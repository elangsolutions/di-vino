import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ItemPrice } from './item-price.schema';
import { AddItemPriceInput } from './dto/add-item-price.input';
import { RemoveItemPriceInput } from './dto/remove-item-price.input';

@Injectable()
export class ItemPriceService {
  constructor(@InjectModel(ItemPrice.name) private model: Model<ItemPrice>) {}

  async create(input: AddItemPriceInput) {
    if (new Date(input.fromDate).getTime() >= new Date(input.toDate).getTime()) {
      throw new BadRequestException('"fromDate" must be earlier than "toDate".');
    }

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

  async findByProduct(productId: string) {
    return this.model.find({ productId }).sort({ fromDate: 1 });
  }

  // Returns the price window covering the given date (defaults to now), preferring the
  // most recently started window if more than one overlaps.
  async findActive(productId: string, at: Date = new Date()) {
    return this.model
      .findOne({ productId: String(productId), fromDate: { $lte: at }, toDate: { $gte: at } })
      .sort({ fromDate: -1 });
  }

  // Distinct productIds that have at least one in-range price window with stock > 0.
  async findAvailableProductIds(at: Date = new Date()): Promise<string[]> {
    const rows = await this.model.aggregate<{ _id: string }>([
      {
        $match: {
          fromDate: { $lte: at },
          toDate: { $gte: at },
          stock: { $gt: 0 },
        },
      },
      { $group: { _id: '$productId' } },
    ]);
    return rows.map((row) => row._id);
  }

  async delete(input: RemoveItemPriceInput) {
    return this.model.findOneAndDelete({ _id: new Types.ObjectId(input._id) });
  }
}
