import {Module} from '@nestjs/common';
import {ConfigModule} from '../config/config.module';
import {OrderResolver} from "./order.resolver";
import {OrderService} from "./order.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Order, OrderSchema} from "./order.schema";

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([{name:Order.name,schema: OrderSchema}]),
    ],
    providers: [OrderResolver, OrderService],
    exports: [OrderService],
})
export class OrderModule {}
