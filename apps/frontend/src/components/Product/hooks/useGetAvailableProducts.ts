import {useQuery} from '@apollo/client';
import {GET_AVAILABLE_PRODUCTS} from '../queries';
import {Product} from '../../../generated/graphql.ts';

// Storefront products: in-range ItemPrice with stock > 0. Maps `price` from the
// active window so existing cart/cache code that reads `product.price` keeps working.
export const useGetAvailableProducts = (): {
    products: Product[];
    loading: boolean;
    error: Error | undefined;
} => {
    const {data, loading, error} = useQuery(GET_AVAILABLE_PRODUCTS);

    const products: Product[] = (data?.availableProducts || []).map(
        (product: Product & { activeItemPrice?: { price: number } | null }) => ({
            ...product,
            price: product.activeItemPrice?.price ?? product.price ?? 0,
        }),
    );

    return {
        products,
        loading,
        error: error as Error | undefined,
    };
};
