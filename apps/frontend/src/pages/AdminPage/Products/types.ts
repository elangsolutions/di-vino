// types.ts
export interface Product {
    _id: string;
    name: string;
    details: string;
    description?: string;
    image?: string;
    category: string;
    activeItemPrice?: {
        _id: string;
        price: number;
        stock: number;
        fromDate: string;
        toDate: string;
    } | null;
}
