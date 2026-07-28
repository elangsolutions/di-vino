import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PromotionCodeService } from './promotion-code.service';
import { PromotionCode } from './promotion-code.schema';
import { AddPromotionCodeInput } from './dto/add-promotion-code.input';
import { RemovePromotionCodeInput } from './dto/remove-promotion-code.input';
import { ValidatePromotionCodeInput } from './dto/validate-promotion-code.input';
import { PromotionDiscountResult } from './dto/promotion-discount.result';

@Resolver(() => PromotionCode)
export class PromotionCodeResolver {
  constructor(private promotionCodeService: PromotionCodeService) {}

  @Query(() => [PromotionCode])
  promotionCodes() {
    return this.promotionCodeService.findAll();
  }

  @Query(() => PromotionCode, { nullable: true })
  promotionCode(@Args('id') id: string) {
    return this.promotionCodeService.findOne(id);
  }

  @Mutation(() => PromotionDiscountResult)
  validatePromotionCode(@Args('input') input: ValidatePromotionCodeInput) {
    return this.promotionCodeService.validate(input);
  }

  @Mutation(() => PromotionCode)
  addPromotionCode(@Args('input') input: AddPromotionCodeInput) {
    return this.promotionCodeService.create(input);
  }

  @Mutation(() => PromotionCode, { nullable: true })
  deletePromotionCode(@Args('input') input: RemovePromotionCodeInput) {
    return this.promotionCodeService.delete(input);
  }
}
