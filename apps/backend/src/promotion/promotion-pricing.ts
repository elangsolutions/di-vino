export type PromotionTypeValue = 'BULK' | 'PRODUCT' | 'PROMO_CODE';
export type PromotionRewardTypeValue = 'PERCENTAGE' | 'FIXED_PRICE';
export type PromotionScopeValue = 'PRODUCT' | 'CATEGORY' | 'ORDER';

export type PricedCartItem = {
  productId: string;
  category: string;
  quantity: number;
  price: number;
  unitsPerBulk?: number;
};

export type PromotionRule = {
  id: string;
  name: string;
  type: PromotionTypeValue;
  rewardType: PromotionRewardTypeValue;
  percentage?: number;
  fixedPrice?: number;
  scope?: PromotionScopeValue;
  productId?: string;
  categoryName?: string;
  code?: string;
};

export type PromotionApplication = {
  promotionId: string;
  name: string;
  matchingQuantity: number;
  boxes?: number;
  remainderQuantity?: number;
  unitsPerBulk?: number;
  originalSubtotal: number;
  promotionalSubtotal: number;
  discountAmount: number;
};

export type PromotionEvaluation = {
  originalTotal: number;
  discountAmount: number;
  finalTotal: number;
  applications: PromotionApplication[];
};

export const roundMoney = (value: number): number => Math.round(value * 100) / 100;

const flattenUnitPrices = (items: PricedCartItem[]): number[] => {
  const units: number[] = [];
  for (const item of items) {
    for (let i = 0; i < item.quantity; i += 1) {
      units.push(item.price);
    }
  }
  return units;
};

const matchingSubtotal = (items: PricedCartItem[]): number =>
  roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0));

const matchingQuantity = (items: PricedCartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, 0);

/**
 * Price N units as full boxes + leftover bottles at unit price.
 * Remainder units are the cheapest leftover bottles so the box deal
 * covers the more expensive ones (customer-friendly mixed boxes).
 *
 * FIXED_PRICE: 7 bottles, box of 6 → 1 × boxPrice + 1 × unitPrice.
 * PERCENTAGE: discount applies only to the units that fill complete boxes.
 */
export const computeBulkApplication = (
  items: PricedCartItem[],
  boxQuantity: number,
  reward: Pick<PromotionRule, 'rewardType' | 'percentage' | 'fixedPrice'>,
): Omit<PromotionApplication, 'promotionId' | 'name'> | null => {
  const qty = matchingQuantity(items);
  if (boxQuantity < 2 || qty < boxQuantity) {
    return null;
  }

  const boxes = Math.floor(qty / boxQuantity);
  const remainderQuantity = qty % boxQuantity;
  const originalSubtotal = matchingSubtotal(items);
  const units = flattenUnitPrices(items).sort((a, b) => b - a);
  const remainderCost = roundMoney(
    units.slice(boxes * boxQuantity).reduce((sum, price) => sum + price, 0),
  );

  let promotionalSubtotal = originalSubtotal;
  if (reward.rewardType === 'FIXED_PRICE') {
    const boxPrice = reward.fixedPrice ?? 0;
    promotionalSubtotal = roundMoney(boxes * boxPrice + remainderCost);
  } else {
    const boxedCost = roundMoney(
      units.slice(0, boxes * boxQuantity).reduce((sum, price) => sum + price, 0),
    );
    const discount = roundMoney(boxedCost * ((reward.percentage ?? 0) / 100));
    promotionalSubtotal = roundMoney(originalSubtotal - discount);
  }

  const discountAmount = roundMoney(Math.max(0, originalSubtotal - promotionalSubtotal));
  if (discountAmount <= 0) {
    return null;
  }

  return {
    matchingQuantity: qty,
    boxes,
    remainderQuantity,
    unitsPerBulk: boxQuantity,
    originalSubtotal,
    promotionalSubtotal,
    discountAmount,
  };
};

export const computeProductApplication = (
  items: PricedCartItem[],
  reward: Pick<PromotionRule, 'rewardType' | 'percentage' | 'fixedPrice'>,
): Omit<PromotionApplication, 'promotionId' | 'name'> | null => {
  const qty = matchingQuantity(items);
  if (qty <= 0) {
    return null;
  }

  const originalSubtotal = matchingSubtotal(items);
  let promotionalSubtotal = originalSubtotal;

  if (reward.rewardType === 'PERCENTAGE') {
    promotionalSubtotal = roundMoney(
      originalSubtotal * (1 - (reward.percentage ?? 0) / 100),
    );
  } else {
    promotionalSubtotal = roundMoney(qty * (reward.fixedPrice ?? 0));
  }

  const discountAmount = roundMoney(Math.max(0, originalSubtotal - promotionalSubtotal));
  if (discountAmount <= 0) {
    return null;
  }

  return {
    matchingQuantity: qty,
    originalSubtotal,
    promotionalSubtotal,
    discountAmount,
  };
};

const consumeBoxedUnits = (items: PricedCartItem[], boxedCount: number) => {
  const sorted = [...items].sort((a, b) => b.price - a.price);
  let left = boxedCount;
  for (const item of sorted) {
    if (left <= 0) {
      break;
    }
    const take = Math.min(item.quantity, left);
    item.quantity -= take;
    left -= take;
  }
};

const withApplication = (
  promo: PromotionRule,
  result: Omit<PromotionApplication, 'promotionId' | 'name'> | null,
): PromotionApplication | null => {
  if (!result) {
    return null;
  }
  return {
    ...result,
    promotionId: promo.id,
    name: promo.name,
  };
};

/**
 * Auto promotions only (BULK + PRODUCT). Promo codes are applied separately.
 * Product-scoped bulk deals run first; leftover units can still fill a category
 * box, then time-based product promos apply to whatever remains.
 */
export const applyAutoPromotions = (
  items: PricedCartItem[],
  promotions: PromotionRule[],
): PromotionEvaluation => {
  const remaining = items.map((item) => ({ ...item }));
  const applications: PromotionApplication[] = [];

  const bulkProduct = promotions.filter(
    (promo) => promo.type === 'BULK' && promo.scope === 'PRODUCT' && promo.productId,
  );
  const bulkCategory = promotions.filter(
    (promo) => promo.type === 'BULK' && promo.scope === 'CATEGORY' && promo.categoryName,
  );
  const productPromos = promotions.filter(
    (promo) => promo.type === 'PRODUCT' && promo.productId,
  );

  const applyBulk = (promo: PromotionRule, targets: PricedCartItem[]) => {
    const groups = new Map<string, PricedCartItem[]>();
    for (const item of targets) {
      const group = groups.get(item.productId) ?? [];
      group.push(item);
      groups.set(item.productId, group);
    }

    for (const group of groups.values()) {
      const boxQuantity = group[0]?.unitsPerBulk ?? 0;
      const result = withApplication(
        promo,
        computeBulkApplication(group, boxQuantity, promo),
      );
      if (!result || !result.boxes) {
        continue;
      }
      applications.push(result);
      consumeBoxedUnits(group, result.boxes * boxQuantity);
    }
  };

  for (const promo of bulkProduct) {
    applyBulk(
      promo,
      remaining.filter((item) => item.productId === promo.productId && item.quantity > 0),
    );
  }

  for (const promo of bulkCategory) {
    applyBulk(
      promo,
      remaining.filter((item) => item.category === promo.categoryName && item.quantity > 0),
    );
  }

  for (const promo of productPromos) {
    const targets = remaining.filter(
      (item) => item.productId === promo.productId && item.quantity > 0,
    );
    const result = withApplication(promo, computeProductApplication(targets, promo));
    if (!result) {
      continue;
    }
    applications.push(result);
    for (const item of targets) {
      item.quantity = 0;
    }
  }

  const originalTotal = matchingSubtotal(items);
  const discountAmount = roundMoney(
    applications.reduce((sum, application) => sum + application.discountAmount, 0),
  );

  return {
    originalTotal,
    discountAmount,
    finalTotal: roundMoney(Math.max(0, originalTotal - discountAmount)),
    applications,
  };
};

export const computePromoCodeDiscount = (
  items: PricedCartItem[],
  promotion: PromotionRule,
): { discountAmount: number; matchingQuantity: number } | { error: string } => {
  const originalTotal = matchingSubtotal(items);
  if (originalTotal <= 0) {
    return { error: 'El carrito está vacío.' };
  }

  let targets = items;
  if (promotion.scope === 'PRODUCT') {
    targets = items.filter((item) => item.productId === promotion.productId);
    if (matchingQuantity(targets) === 0) {
      return { error: 'Este código no aplica a los productos de tu carrito.' };
    }
  } else if (promotion.scope === 'CATEGORY') {
    targets = items.filter((item) => item.category === promotion.categoryName);
    if (matchingQuantity(targets) === 0) {
      return { error: 'Este código no aplica a los productos de tu carrito.' };
    }
  }

  if (promotion.rewardType === 'PERCENTAGE') {
    const subtotal = promotion.scope === 'ORDER' ? originalTotal : matchingSubtotal(targets);
    return {
      discountAmount: roundMoney(subtotal * ((promotion.percentage ?? 0) / 100)),
      matchingQuantity: matchingQuantity(targets),
    };
  }

  if (promotion.scope === 'ORDER') {
    // Fixed reward on the whole order is a flat amount off.
    return {
      discountAmount: roundMoney(Math.min(promotion.fixedPrice ?? 0, originalTotal)),
      matchingQuantity: matchingQuantity(items),
    };
  }

  const result = computeProductApplication(targets, promotion);
  if (!result) {
    return { error: 'Este código no genera descuento en tu carrito.' };
  }
  return {
    discountAmount: result.discountAmount,
    matchingQuantity: result.matchingQuantity,
  };
};
