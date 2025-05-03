import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.schema';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => [Product])
  products() {
    return this.productService.findAll();
  }

  @Mutation(() => Product)
  createProduct(
    @Args('name') name: string,
    @Args('price') price: number,
  ) {
    return this.productService.create(name, price);
  }
}
