import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Promotion } from './promotion.schema';
import { PromotionService } from './promotion.service';
import { AddPromotionInput } from './dto/add-promotion.input';
import { RemovePromotionInput } from './dto/remove-promotion.input';
import {
  EvaluatePromotionsInput,
  ValidatePromotionCodeInput,
} from './dto/evaluate-promotions.input';
import {
  PromotionDiscountResult,
  PromotionEvaluation,
} from './dto/promotion-evaluation.result';

@Resolver(() => Promotion)
export class PromotionResolver {
  constructor(private promotionService: PromotionService) {}

  @Query(() => [Promotion])
  promotions() {
    return this.promotionService.findAll();
  }

  @Query(() => [Promotion])
  activePromotions() {
    return this.promotionService.findActiveAuto();
  }

  @Query(() => Promotion, { nullable: true })
  promotion(@Args('id') id: string) {
    return this.promotionService.findOne(id);
  }

  @Query(() => PromotionEvaluation)
  evaluatePromotions(@Args('input') input: EvaluatePromotionsInput) {
    return this.promotionService.evaluate(input.items);
  }

  @Mutation(() => Promotion)
  addPromotion(@Args('input') input: AddPromotionInput) {
    return this.promotionService.create(input);
  }

  @Mutation(() => Promotion, { nullable: true })
  deletePromotion(@Args('input') input: RemovePromotionInput) {
    return this.promotionService.delete(input);
  }

  @Mutation(() => PromotionDiscountResult)
  validatePromotionCode(@Args('input') input: ValidatePromotionCodeInput) {
    return this.promotionService.validateCode(input);
  }

  @ResolveField(() => String, { nullable: true })
  categoryName(@Parent() promotion: Promotion) {
    return this.promotionService.categoryName(promotion.categoryId);
  }
}
