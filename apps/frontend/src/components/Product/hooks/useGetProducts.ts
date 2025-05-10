import {useQuery} from '@apollo/client';
import {QUERIES} from "../../queries.ts";

export const useGetProducts = () => {
    const { data, loading, error } = useQuery(QUERIES.productQueries.GET_PRODUCTS);

    return {
        products: data?.products || [],
        loading,
        error,
    };
};
