import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class Product extends Document {
  @Field(() => ID)
  declare _id: string;

  @Field()
  @Prop()
  name: string;

  @Field({nullable:true})
  @Prop()
  details: string;

  @Field({
    deprecationReason:
      'Use ItemPrice instead (supports scheduled/promotional pricing windows by date range).',
  })
  @Prop({ default: 0 })
  price: number;

  @Field()
  @Prop()
  category: string;

  @Field(() => Int, { nullable: true })
  @Prop({ min: 1 })
  unitsPerBulk?: number;

  @Field()
  @Prop()
  stock: number;

  @Field({ nullable: true })
  @Prop()
  image?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
