import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionCode, PromotionCodeSchema } from './promotion-code.schema';
import { PromotionCodeService } from './promotion-code.service';
import { PromotionCodeResolver } from './promotion-code.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromotionCode.name, schema: PromotionCodeSchema },
    ]),
  ],
  providers: [PromotionCodeService, PromotionCodeResolver],
  exports: [PromotionCodeService],
})
export class PromotionCodeModule {}
