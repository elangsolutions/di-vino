import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './category.schema';
import { ProductModule } from '../product/product.module';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
        ProductModule,
    ],
    providers: [CategoryResolver, CategoryService],
})
export class CategoryModule {}
