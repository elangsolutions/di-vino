import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {AuthModule} from './auth/auth.module';
import {GraphQLModule} from '@nestjs/graphql';
import {ApolloDriver} from '@nestjs/apollo';
import {ConfigService} from './config/config.service';
import {ConfigModule as NestConfigModule} from '@nestjs/config';
import {join} from 'path';
import {ConfigModule} from './config/config.module';
import {OrderModule} from "./order/order.module";
import {ProductModule} from "./product/product.module";
import {CategoryModule} from "./category/category.module";
import {ItemPriceModule} from "./item-price/item-price.module";
import {PaymentModule} from "./integrations/payment/payment.module";
import {PromotionCodeModule} from "./promotion-code/promotion-code.module";
import * as process from "node:process";

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule,
    NestConfigModule.forRoot({
      isGlobal: true, // makes config available everywhere
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      debug: true,
      // In production (e.g. the Docker/Railway image) only `dist/` exists, so there is no
      // `src/` directory to write the generated schema into. Build the schema in-memory
      // instead; locally, keep writing to `src/schema.gql` so it can be committed via
      // the `schema:commit` script.
      autoSchemaFile:
        process.env.NODE_ENV === 'production'
          ? true
          : join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      csrfPrevention: false,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.mongoUri,
      }),
    }),
    AuthModule,
    OrderModule,
    ProductModule,
    CategoryModule,
    ItemPriceModule,
    PaymentModule,
    PromotionCodeModule,
  ],
  providers: [AppService],
})
export class AppModule {}
