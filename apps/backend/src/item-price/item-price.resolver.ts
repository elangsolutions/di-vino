import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ItemPriceService } from './item-price.service';
import { ItemPrice } from './item-price.schema';
import { AddItemPriceInput } from './dto/add-item-price.input';
import { RemoveItemPriceInput } from './dto/remove-item-price.input';

@Resolver(() => ItemPrice)
export class ItemPriceResolver {
  constructor(private itemPriceService: ItemPriceService) {}

  @Query(() => [ItemPrice])
  itemPrices() {
    return this.itemPriceService.findAll();
  }

  @Query(() => ItemPrice, { nullable: true })
  itemPrice(@Args('id') id: string) {
    return this.itemPriceService.findOne(id);
  }

  @Query(() => [ItemPrice])
  itemPricesByProduct(@Args('productId') productId: string) {
    return this.itemPriceService.findByProduct(productId);
  }

  @Query(() => ItemPrice, { nullable: true })
  activeItemPrice(
    @Args('productId') productId: string,
    @Args('at', { nullable: true }) at?: Date,
  ) {
    return this.itemPriceService.findActive(productId, at);
  }

  @Mutation(() => ItemPrice)
  addItemPrice(@Args('input') input: AddItemPriceInput) {
    return this.itemPriceService.create(input);
  }

  @Mutation(() => ItemPrice, { nullable: true })
  deleteItemPrice(@Args('input') input: RemoveItemPriceInput) {
    return this.itemPriceService.delete(input);
  }
}
