import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';

export enum PromotionType {
  BULK = 'BULK',
  PRODUCT = 'PRODUCT',
  PROMO_CODE = 'PROMO_CODE',
}

export enum PromotionRewardType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_PRICE = 'FIXED_PRICE',
}

export enum PromotionScope {
  ORDER = 'ORDER',
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
}

registerEnumType(PromotionType, { name: 'PromotionType' });
registerEnumType(PromotionRewardType, { name: 'PromotionRewardType' });
registerEnumType(PromotionScope, { name: 'PromotionScope' });

@ObjectType()
@Schema()
export class Promotion extends Document {
  @Field(() => ID)
  declare _id: string;

  @Field()
  @Prop({ required: true, trim: true })
  name: string;

  @Field(() => PromotionType)
  @Prop({ enum: PromotionType, required: true, index: true })
  type: PromotionType;

  @Field()
  @Prop({ type: Date, required: true })
  fromDate: Date;

  @Field()
  @Prop({ type: Date, required: true })
  toDate: Date;

  @Field(() => PromotionRewardType)
  @Prop({ enum: PromotionRewardType, required: true })
  rewardType: PromotionRewardType;

  @Field(() => Float, { nullable: true })
  @Prop()
  percentage?: number;

  @Field(() => Float, { nullable: true })
  @Prop()
  fixedPrice?: number;

  @Field(() => PromotionScope, { nullable: true })
  @Prop({ enum: PromotionScope })
  scope?: PromotionScope;

  @Field({ nullable: true })
  @Prop()
  productId?: string;

  @Field({ nullable: true })
  @Prop()
  categoryId?: string;

  @Field({ nullable: true })
  @Prop({ uppercase: true, trim: true })
  code?: string;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);

PromotionSchema.index({ fromDate: 1, toDate: 1, type: 1 });
PromotionSchema.index({ code: 1 }, { unique: true, sparse: true });
