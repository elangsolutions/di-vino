import {useQuery} from '@apollo/client';
import {GET_AVAILABLE_PRODUCTS} from '../queries';
import {Product} from '../../../generated/graphql.ts';

// Storefront products: in-range ItemPrice with stock > 0.
// Keeps `price` mirrored from activeItemPrice for cart/cache consumers.
export const useGetAvailableProducts = (): {
    products: Product[];
    loading: boolean;
    error: Error | undefined;
} => {
    const {data, loading, error} = useQuery(GET_AVAILABLE_PRODUCTS);

    const products: Product[] = (data?.availableProducts || []).map((product: Product) => ({
        ...product,
        price: product.activeItemPrice?.price ?? 0,
    }));

    return {
        products,
        loading,
        error: error as Error | undefined,
    };
};
