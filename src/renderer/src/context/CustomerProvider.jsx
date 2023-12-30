import react, { createContext, useContext, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContextProvider';
import { useQuery } from 'react-query';
import { getCustomer } from '../server/api';

const CustomerDataContext = createContext();

const CustomerDataProvider = ({ children }) => {

    const { token } = useAuth();

    const customer_data = useQuery(['customer'], getCustomer, {
        enabled: !token,
    })

    useEffect(() => {
        if (token) {
            customer_data.refetch();
        }
    }, [token])


    const data = useMemo(() => {

        if (customer_data.data) {
            return customer_data.data.data
        }

    }, [customer_data.data])


    return (
        <CustomerDataContext.Provider value={{ customer_data, data }}>
            {children}
        </CustomerDataContext.Provider>
    )
}


export const useCustomerData = () => useContext(CustomerDataContext);

export const onlyCustomerInfo = () => {
    const { data } = useCustomerData();
    if (data) {
        return data.map(item => ({ id: item.id, name: item.name, description: item.description }))
    }
}

// salesbycustomername
export const SalesByCustomerName = (id) => {
    const { data } = useCustomerData();
    if (data) {
        const customer = data.find(item => item.id == id);
        return customer?.sales;
    }
}



    export default CustomerDataProvider;