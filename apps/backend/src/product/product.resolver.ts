import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.schema';
import {AddProductInput} from "./dto/add-product.input";
import {RemoveProductInput} from "./dto/remove-product.input";


@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => [Product])
  products() {
    return this.productService.findAll();
  }

  @Query(() => Product)
   product(@Args('id') id: string) {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product)
  addProduct(@Args('input') input: AddProductInput) {
    return this.productService.create(input);
  }
  @Mutation(() => Product)
  deleteProduct(@Args('input') input: RemoveProductInput) {
    return this.productService.delete(input);
  }
}
