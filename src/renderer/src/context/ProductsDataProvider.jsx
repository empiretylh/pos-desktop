import react, { createContext, useContext, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContextProvider';
import { useQuery } from 'react-query';
import { getProducts } from '../server/api';

const ProductsDataContext = createContext();

const ProductsDataProvider = ({ children }) => {

    const { token } = useAuth();

    const product_data = useQuery(['products'], getProducts, {
        enabled: !token,
    })

    useEffect(() => {
        if (token) {
            product_data.refetch();
        }
    }, [token])


    const data = useMemo(() => {

        if (product_data.data) {
            return product_data.data.data
        }

    }, [product_data.data])


    return (
        <ProductsDataContext.Provider value={{ product_data, data }}>
            {children}
        </ProductsDataContext.Provider>
    )
}


export const useProductsData = () => useContext(ProductsDataContext);

//count products by category id
export const countProducts = (id) => {
    const { data } = useProductsData();
    if (data) {
        const products = data.filter(item => item.category === id);
        return products.length;
    }
}


export const productsByCategory = (id) => {
    const { data } = useProductsData();
    if (data) {
        const products = data.filter(item => item.category === id);
        return products;
    }
}


export default ProductsDataProvider;