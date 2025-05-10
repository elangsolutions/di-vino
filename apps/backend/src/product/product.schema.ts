import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class Product extends Document {
  @Field(() => ID)
  declare _id: string;

  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop()
  price: number;

  @Field()
  @Prop()
  category: string;

  @Field()
  @Prop()
  stock: number;

  @Field({ nullable: true })
  @Prop()
  image?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
