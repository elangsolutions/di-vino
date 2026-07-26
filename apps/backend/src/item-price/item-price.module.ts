import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemPrice, ItemPriceSchema } from './item-price.schema';
import { ItemPriceResolver } from './item-price.resolver';
import { ItemPriceService } from './item-price.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ItemPrice.name, schema: ItemPriceSchema }])],
  providers: [ItemPriceResolver, ItemPriceService],
  exports: [ItemPriceService],
})
export class ItemPriceModule {}
