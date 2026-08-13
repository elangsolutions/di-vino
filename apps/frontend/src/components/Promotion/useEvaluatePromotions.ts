import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../../store/cart/slice';
import { EVALUATE_PROMOTIONS } from './queries';
import { PromotionEvaluation } from './utils';

export const useEvaluatePromotions = () => {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const itemsSignature = cartItems
    .map((item: { productId: string; quantity: number; product?: { price?: number } }) =>
      `${item.productId}:${item.quantity}:${item.product?.price ?? 0}`,
    )
    .join('|');

  const items = useMemo(
    () =>
      cartItems
        .filter((item: { product?: { price?: number } }) => item.product)
        .map((item: { productId: string; quantity: number; product: { price: number } }) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price || 0,
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemsSignature],
  );

  const { data, loading } = useQuery(EVALUATE_PROMOTIONS, {
    variables: { input: { items } },
    skip: items.length === 0,
  });

  const evaluation: PromotionEvaluation = data?.evaluatePromotions ?? {
    originalTotal: cartTotal,
    discountAmount: 0,
    finalTotal: cartTotal,
    applications: [],
  };

  return { evaluation, loading, items };
};
