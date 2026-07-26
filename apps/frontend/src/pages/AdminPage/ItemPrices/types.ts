// types.ts
export interface ItemPrice {
    _id: string;
    productId: string;
    price: number;
    fromDate: string;
    toDate: string;
    stock: number;
    promotionCodes?: string[];
}
