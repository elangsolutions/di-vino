import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class ItemPrice extends Document {
  @Field(() => ID)
  declare _id: string;

  @Field()
  @Prop({ required: true, index: true })
  productId: string;

  @Field(() => Float)
  @Prop({ required: true })
  price: number;

  @Field()
  @Prop({ type: Date, required: true })
  fromDate: Date;

  @Field()
  @Prop({ type: Date, required: true })
  toDate: Date;

  @Field(() => Int)
  @Prop({ required: true, default: 0 })
  stock: number;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [String], default: [] })
  promotionCodes?: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const ItemPriceSchema = SchemaFactory.createForClass(ItemPrice);

// Speeds up the "active price for a product on a given date" lookup.
ItemPriceSchema.index({ productId: 1, fromDate: 1, toDate: 1 });
