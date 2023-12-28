import react, { createContext, useContext, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContextProvider';
import { useQuery } from 'react-query';
import { getExpense, getProducts } from '../server/api';

const ExpenseDataContext = createContext();

const ExpenseDataProvider = ({ children }) => {

    const { token } = useAuth();

    const [type, setType] = react.useState('');
    const [time, setTime] = react.useState('month');
    const [startd, setStartd] = react.useState('');
    const [endd, setEndd] = react.useState('');

    const expense_data = useQuery(['expense', type, time, startd, endd], getExpense, {
        enabled: !token,
    })

    useEffect(() => {
        if (token) {
            expense_data.refetch();
        }
    }, [token])


    const data = useMemo(() => {

        if (expense_data.data) {
            console.log(expense_data.data.data)
            return expense_data.data.data.DATA
        }

    }, [expense_data.data])

    const reload = (type='', time='today', startd='', endd='') => {
        setType(type);
        setTime(time);
        setStartd(startd);
        setEndd(endd);
    }


    return (
        <ExpenseDataContext.Provider value={{ expense_data, data, reload }}>
            {children}
        </ExpenseDataContext.Provider>
    )
}


export const useExpenseData = () => useContext(ExpenseDataContext);


export default ExpenseDataProvider;