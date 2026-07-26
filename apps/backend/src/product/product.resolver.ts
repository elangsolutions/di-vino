import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.schema';
import {AddProductInput} from "./dto/add-product.input";
import {RemoveProductInput} from "./dto/remove-product.input";
import { ItemPriceService } from '../item-price/item-price.service';
import { ItemPrice } from '../item-price/item-price.schema';


@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private productService: ProductService,
    private itemPriceService: ItemPriceService,
  ) {}

  @Query(() => [Product])
  products() {
    return this.productService.findAll();
  }

  // Storefront listing: only products with an in-range ItemPrice and stock > 0.
  @Query(() => [Product])
  async availableProducts(@Args('at', { nullable: true }) at?: Date) {
    const productIds = await this.itemPriceService.findAvailableProductIds(at);
    return this.productService.findByIds(productIds);
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

  // The currently active (date-window) price/stock for this product, or null if there is
  // none. Storefront listings use this to hide products that aren't currently sellable.
  @ResolveField(() => ItemPrice, { nullable: true })
  activeItemPrice(@Parent() product: Product) {
    return this.itemPriceService.findActive(String(product._id));
  }
}
