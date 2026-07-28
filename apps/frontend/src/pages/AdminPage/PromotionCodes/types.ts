export type PromotionScope = 'ORDER' | 'PRODUCT';

export interface PromotionCode {
  _id: string;
  code: string;
  fromDate: string;
  toDate: string;
  percentage: number;
  scope: PromotionScope;
  productId?: string;
}
