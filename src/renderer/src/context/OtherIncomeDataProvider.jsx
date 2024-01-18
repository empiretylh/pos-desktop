import react, { createContext, useContext, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContextProvider';
import { useQuery } from 'react-query';
import { getOtherIncome } from '../server/api';
import axios from 'axios';

const OtherIncomeDataContext = createContext();

const OtherIncomeDataProvider = ({ children }) => {

    const { token } = useAuth();

    const [type, setType] = react.useState('');
    const [time, setTime] = react.useState('month');
    const [startd, setStartd] = react.useState('');
    const [endd, setEndd] = react.useState('');

    const otherincome_data = useQuery(['otherincome', type, time, startd, endd], getOtherIncome, {
        enabled: !token,
    })

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common = { Authorization: `Token ${token}` };
            otherincome_data.refetch();
        }
    }, [token])


    const data = useMemo(() => {

        if (otherincome_data.data) {
            console.log(otherincome_data.data.data)
            return otherincome_data.data.data.DATA
        }

    }, [otherincome_data.data])

    const reload = (type = '', time = 'today', startd = '', endd = '') => {
        setType(type);
        setTime(time);
        setStartd(startd);
        setEndd(endd);
    }


    return (
        <OtherIncomeDataContext.Provider value={{ otherincome_data, data, reload }}>
            {children}
        </OtherIncomeDataContext.Provider>
    )
}


export const useOtherIncome = () => useContext(OtherIncomeDataContext);


export default OtherIncomeDataProvider;