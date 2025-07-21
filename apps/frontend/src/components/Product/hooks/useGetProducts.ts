import {useQuery} from '@apollo/client';
import {QUERIES} from "../../queries.ts";
import {Product} from "../../../generated/graphql.ts";

export const useGetProducts = (): { products: Product[], loading: boolean, error: any } => {
    const {data, loading, error} = useQuery(QUERIES.productQueries.GET_PRODUCTS);

    return {
        products: data?.products || [],
        loading,
        error,
    };
};
