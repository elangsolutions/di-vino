import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Legacy collection kept only to migrate existing box promos into `promotions`.
@Schema()
export class BoxPromotion extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Date, required: true })
  fromDate: Date;

  @Prop({ type: Date, required: true })
  toDate: Date;

  @Prop({ required: true })
  scope: string;

  @Prop()
  productId?: string;

  @Prop()
  categoryId?: string;

  @Prop({ required: true, min: 1 })
  boxQuantity: number;

  @Prop({ required: true, min: 0 })
  boxPrice: number;
}

export const BoxPromotionSchema = SchemaFactory.createForClass(BoxPromotion);
