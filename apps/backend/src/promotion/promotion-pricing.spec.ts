import {
  applyAutoPromotions,
  computeBulkApplication,
  computeProductApplication,
  computePromoCodeDiscount,
} from './promotion-pricing';

const malbec = {
  productId: 'malbec',
  category: 'Tintos',
  quantity: 7,
  price: 20,
  unitsPerBulk: 6,
};

describe('computeBulkApplication', () => {
  it('charges one box price for an exact box of the same product', () => {
    expect(
      computeBulkApplication(
        [{ ...malbec, quantity: 6 }],
        6,
        { rewardType: 'FIXED_PRICE', fixedPrice: 100 },
      ),
    ).toEqual({
      matchingQuantity: 6,
      boxes: 1,
      remainderQuantity: 0,
      unitsPerBulk: 6,
      originalSubtotal: 120,
      promotionalSubtotal: 100,
      discountAmount: 20,
    });
  });

  it('charges box price + leftover unit price when quantity is 7 and the box is 6', () => {
    expect(
      computeBulkApplication([malbec], 6, { rewardType: 'FIXED_PRICE', fixedPrice: 100 }),
    ).toEqual({
      matchingQuantity: 7,
      boxes: 1,
      remainderQuantity: 1,
      unitsPerBulk: 6,
      originalSubtotal: 140,
      promotionalSubtotal: 120,
      discountAmount: 20,
    });
  });

  it('discounts only boxed units when the bulk reward is a percentage', () => {
    // 6 boxed @ 20 = 120 → 15% = 18 off; leftover 20 stays full price.
    expect(
      computeBulkApplication([malbec], 6, { rewardType: 'PERCENTAGE', percentage: 15 }),
    ).toEqual({
      matchingQuantity: 7,
      boxes: 1,
      remainderQuantity: 1,
      unitsPerBulk: 6,
      originalSubtotal: 140,
      promotionalSubtotal: 122,
      discountAmount: 18,
    });
  });

  it('does not apply when there are not enough units for a box', () => {
    expect(
      computeBulkApplication(
        [{ ...malbec, quantity: 5 }],
        6,
        { rewardType: 'FIXED_PRICE', fixedPrice: 100 },
      ),
    ).toBeNull();
  });
});

describe('computeProductApplication', () => {
  it('applies a percentage off the product subtotal', () => {
    expect(
      computeProductApplication(
        [{ ...malbec, quantity: 2 }],
        { rewardType: 'PERCENTAGE', percentage: 25 },
      ),
    ).toEqual({
      matchingQuantity: 2,
      originalSubtotal: 40,
      promotionalSubtotal: 30,
      discountAmount: 10,
    });
  });

  it('applies a special unit price when it is cheaper', () => {
    expect(
      computeProductApplication(
        [{ ...malbec, quantity: 3 }],
        { rewardType: 'FIXED_PRICE', fixedPrice: 15 },
      ),
    ).toEqual({
      matchingQuantity: 3,
      originalSubtotal: 60,
      promotionalSubtotal: 45,
      discountAmount: 15,
    });
  });
});

describe('applyAutoPromotions', () => {
  it('lets a product sale apply to leftover bottles after a bulk box', () => {
    const evaluation = applyAutoPromotions(
      [malbec],
      [
        {
          id: 'bulk',
          name: 'Caja x6',
          type: 'BULK',
          scope: 'PRODUCT',
          productId: 'malbec',
          rewardType: 'FIXED_PRICE',
          fixedPrice: 100,
        },
        {
          id: 'sale',
          name: 'Malbec 10%',
          type: 'PRODUCT',
          productId: 'malbec',
          rewardType: 'PERCENTAGE',
          percentage: 10,
        },
      ],
    );

    expect(evaluation.applications.map((item) => item.promotionId)).toEqual(['bulk', 'sale']);
    expect(evaluation.applications[0].unitsPerBulk).toBe(6);
    expect(evaluation.applications[0].discountAmount).toBe(20);
    expect(evaluation.applications[1].discountAmount).toBe(2);
    expect(evaluation.finalTotal).toBe(118);
  });

  it('skips bulk pricing when the product has no unitsPerBulk', () => {
    const evaluation = applyAutoPromotions(
      [{ ...malbec, unitsPerBulk: undefined }],
      [
        {
          id: 'bulk',
          name: 'Caja x6',
          type: 'BULK',
          scope: 'PRODUCT',
          productId: 'malbec',
          rewardType: 'FIXED_PRICE',
          fixedPrice: 100,
        },
      ],
    );

    expect(evaluation.applications).toEqual([]);
    expect(evaluation.finalTotal).toBe(140);
  });
});

describe('computePromoCodeDiscount', () => {
  it('takes a percentage off the whole order', () => {
    expect(
      computePromoCodeDiscount(
        [malbec],
        {
          id: 'code',
          name: 'VERANO20',
          type: 'PROMO_CODE',
          scope: 'ORDER',
          rewardType: 'PERCENTAGE',
          percentage: 10,
        },
      ),
    ).toEqual({ discountAmount: 14, matchingQuantity: 7 });
  });

  it('takes a fixed amount off the whole order', () => {
    expect(
      computePromoCodeDiscount(
        [malbec],
        {
          id: 'code',
          name: 'MENOS50',
          type: 'PROMO_CODE',
          scope: 'ORDER',
          rewardType: 'FIXED_PRICE',
          fixedPrice: 50,
        },
      ),
    ).toEqual({ discountAmount: 50, matchingQuantity: 7 });
  });
});
