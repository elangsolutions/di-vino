import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class Category extends Document {
  @Field(() => ID)
  declare _id: string;

  @Field()
  @Prop({ required: true, unique: true })
  name: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
