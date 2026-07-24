import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './category.schema';
import { AddCategoryInput } from './dto/add-category.input';
import { RemoveCategoryInput } from './dto/remove-category.input';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}

  @Query(() => [Category])
  categories() {
    return this.categoryService.findAll();
  }

  @Query(() => Category)
  category(@Args('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => Category)
  addCategory(@Args('input') input: AddCategoryInput) {
    return this.categoryService.create(input);
  }

  @Mutation(() => Category, { nullable: true })
  deleteCategory(@Args('input') input: RemoveCategoryInput) {
    return this.categoryService.delete(input);
  }
}
