import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.schema';
import {AddProductInput} from "./dto/add-product.input";

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => [Product])
  products() {
    return this.productService.findAll();
  }

  @Mutation(() => Product)
  addProduct(@Args('input') input: AddProductInput) {
    return this.productService.create(input);
  }
}
