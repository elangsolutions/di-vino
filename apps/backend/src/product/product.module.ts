import {Module} from '@nestjs/common';
import {ConfigModule} from '../config/config.module';
import {ProductResolver} from "./product.resolver";
import {ProductService} from "./product.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Product, ProductSchema} from "./product.schema";
import {OrderModule} from "../order/order.module";
import {ItemPriceModule} from "../item-price/item-price.module";

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
        OrderModule,
        ItemPriceModule,
    ],
    providers: [ProductResolver, ProductService],
    exports: [ProductService],
})
export class ProductModule {}
