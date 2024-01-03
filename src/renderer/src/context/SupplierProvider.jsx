import react, { createContext, useContext, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContextProvider';
import { useQuery } from 'react-query';
import { getCustomer, getSupplier } from '../server/api';

const SupplierDataContext = createContext();

const SupplierDataProvider = ({ children }) => {

    const { token } = useAuth();

    const supplier_data = useQuery(['supplier'], getSupplier, {
        enabled: !token,
    })

    useEffect(() => {
        if (token) {
            supplier_data.refetch();
        }
    }, [token])


    const data = useMemo(() => {

        if (supplier_data.data) {
            return supplier_data.data.data
        }

    }, [supplier_data.data])


    return (
        <SupplierDataContext.Provider value={{ supplier_data, data }}>
            {children}
        </SupplierDataContext.Provider>
    )
}


export const useSupplierData = () => useContext(SupplierDataContext);

export const onlyCustomerInfo = () => {
    const { data } = useSupplierData();
    if (data) {
        return data.map(item => ({ id: item.id, name: item.name, description: item.description }))
    }
}

// salesbycustomername
export const ProductsByID = (id) => {
    const { data } = useSupplierData();
    if (data) {
        const customer = data.find(item => item.id == id);
        console.log(customer?.products)
        return customer?.products;
    }
}



    export default SupplierDataProvider;