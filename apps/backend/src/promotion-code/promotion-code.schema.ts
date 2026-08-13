import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Legacy collection kept only to migrate existing promo codes into `promotions`.
@Schema()
export class PromotionCode extends Document {
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  @Prop({ type: Date, required: true })
  fromDate: Date;

  @Prop({ type: Date, required: true })
  toDate: Date;

  @Prop({ required: true, min: 0, max: 100 })
  percentage: number;

  @Prop({ required: true })
  scope: string;

  @Prop()
  productId?: string;
}

export const PromotionCodeSchema = SchemaFactory.createForClass(PromotionCode);
