import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';

export enum PromotionScope {
  ORDER = 'ORDER',
  PRODUCT = 'PRODUCT',
}

registerEnumType(PromotionScope, { name: 'PromotionScope' });

@ObjectType()
@Schema()
export class PromotionCode extends Document {
  @Field(() => ID)
  declare _id: string;

  @Field()
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  @Field()
  @Prop({ type: Date, required: true })
  fromDate: Date;

  @Field()
  @Prop({ type: Date, required: true })
  toDate: Date;

  @Field(() => Float)
  @Prop({ required: true, min: 0, max: 100 })
  percentage: number;

  @Field(() => PromotionScope)
  @Prop({ enum: PromotionScope, required: true })
  scope: PromotionScope;

  @Field({ nullable: true })
  @Prop()
  productId?: string;
}

export const PromotionCodeSchema = SchemaFactory.createForClass(PromotionCode);
