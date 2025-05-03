import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Product, ProductSchema } from './product/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ProductService } from './product/product.service';
import { ApolloDriver } from '@nestjs/apollo';
import { ProductResolver } from './product/product.resolver';
import { ConfigService } from './config/config.service';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ConfigModule } from './config/config.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule,
    NestConfigModule.forRoot({
      isGlobal: true, // makes config available everywhere
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.mongoUri,
      }),
    }),
    AuthModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [AppService, ProductResolver, ProductService],
})
export class AppModule {}
