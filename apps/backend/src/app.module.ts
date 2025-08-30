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
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.mongoUri,
      }),
    }),
    AuthModule,
    OrderModule,
    ProductModule
  ],
  providers: [AppService],
})
export class AppModule {}
