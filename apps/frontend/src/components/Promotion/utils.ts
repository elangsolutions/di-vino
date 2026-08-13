import { priceFormat } from '../../utils';

export type PromotionType = 'BULK' | 'PRODUCT' | 'PROMO_CODE';
export type PromotionRewardType = 'PERCENTAGE' | 'FIXED_PRICE';
export type PromotionScope = 'PRODUCT' | 'CATEGORY' | 'ORDER';

export interface Promotion {
  _id: string;
  name: string;
  type: PromotionType;
  fromDate: string;
  toDate: string;
  rewardType: PromotionRewardType;
  percentage?: number | null;
  fixedPrice?: number | null;
  scope?: PromotionScope | null;
  productId?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  code?: string | null;
}

export interface PromotionApplication {
  matchingQuantity: number;
  boxes?: number | null;
  remainderQuantity?: number | null;
  unitsPerBulk?: number | null;
  originalSubtotal: number;
  promotionalSubtotal: number;
  discountAmount: number;
  promotion: Promotion;
}

export interface PromotionEvaluation {
  originalTotal: number;
  discountAmount: number;
  finalTotal: number;
  applications: PromotionApplication[];
}

export const promotionTypeLabel: Record<PromotionType, string> = {
  BULK: 'Por volumen',
  PRODUCT: 'Por producto',
  PROMO_CODE: 'Código promocional',
};

export const matchingBulkPromotion = (
  promotions: Promotion[],
  product: { _id: string; category?: string | null },
): Promotion | undefined => {
  const bulk = promotions.filter((promo) => promo.type === 'BULK');
  const productPromo = bulk.find(
    (promo) => promo.scope === 'PRODUCT' && promo.productId === product._id,
  );
  if (productPromo) {
    return productPromo;
  }
  return bulk.find(
    (promo) => promo.scope === 'CATEGORY' && promo.categoryName === product.category,
  );
};

export const matchingProductPromotion = (
  promotions: Promotion[],
  product: { _id: string },
): Promotion | undefined =>
  promotions.find((promo) => promo.type === 'PRODUCT' && promo.productId === product._id);

export const describeReward = (promotion: Promotion): string => {
  if (promotion.rewardType === 'PERCENTAGE') {
    return `${promotion.percentage ?? 0}% menos`;
  }
  const amount = `$${priceFormat(promotion.fixedPrice ?? 0)}`;
  if (promotion.type === 'BULK') {
    return `${amount} la caja`;
  }
  if (promotion.type === 'PROMO_CODE' && promotion.scope === 'ORDER') {
    return `${amount} de descuento`;
  }
  return amount;
};

export const describeCatalogOffer = (promotion: Promotion): string => {
  if (promotion.type === 'BULK') {
    if (promotion.rewardType === 'PERCENTAGE') {
      return `Caja: ${promotion.percentage ?? 0}% menos`;
    }
    return `Caja: $${priceFormat(promotion.fixedPrice ?? 0)}`;
  }
  if (promotion.rewardType === 'PERCENTAGE') {
    return `Promo: ${promotion.percentage ?? 0}% menos`;
  }
  return `Promo: $${priceFormat(promotion.fixedPrice ?? 0)}`;
};

export const describeApplication = (application: PromotionApplication): string => {
  const { promotion } = application;
  if (promotion.type === 'BULK' && application.boxes) {
    const boxLabel = `${application.boxes} caja${application.boxes === 1 ? '' : 's'} de ${application.unitsPerBulk}`;
    if (!application.remainderQuantity) {
      return `${boxLabel} (${describeReward(promotion)})`;
    }
    return `${boxLabel} + ${application.remainderQuantity} unidad${application.remainderQuantity === 1 ? '' : 'es'}`;
  }
  return describeReward(promotion);
};
