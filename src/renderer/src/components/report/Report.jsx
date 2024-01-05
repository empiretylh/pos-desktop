import react, { useState, useEffect, useTransition, useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import { APPNAME } from '../../config/config';
import { IMAGE } from '../../config/image';
import TextInput from '../custom_components/TextInput';
import { getSales, login } from '../../server/api';
import { useAuth } from '../../context/AuthContextProvider';
const { ipcRenderer } = window.electron
import axios from 'axios';
import Navigation from '../custom_components/Navigation';
import Loading from '../custom_components/Loading';
import { useTranslation } from 'react-i18next';
import numberWithCommas from '../custom_components/NumberWithCommas';
import PieChart from './PieChart';
import TopMoneyTable from './TopMoneyTable';
import SaleChart from './SaleChart';
import SalesTable from './SalesTable';
import CustomButton from '../custom_components/CustomButton';
import DateSelectModal from './DateSelectModal';

const Report = () => {

    const [time, setTime] = useState('today');
    const [type, setType] = useState('all');
    const [stardate, setStartdate] = useState(new Date());
    const [enddate, setEnddate] = useState(new Date());
    const [dateShow, setDateShow] = useState(false);

    const [loading, setLoading] = useState(false);

    const { setToken } = useAuth();

    const { t } = useTranslation();


    const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
    const formattedStartDate = stardate.toLocaleDateString('en-US', options);
    const formattedEndDate = enddate.toLocaleDateString('en-US', options);

    const sales_data = useQuery(['sales', type, time, formattedStartDate, formattedEndDate], getSales);
    useEffect(() => {
        sales_data.refetch();
    }, [type, time, stardate, enddate])

    const FilterSalesData = useMemo(()=>{
        let salesData = sales_data?.data?.data?.DATA;
        if(salesData?.length === 0) return sales_data;
        let finaldata = salesData;
        return finaldata;
    },[sales_data.data, time, type, stardate, enddate])

    return (
        <div className='flex flex-row h-screen'>
            <Navigation />
            <Loading show={loading} />
            <div className="bg-white font-sans h-full w-full px-3 overflow-auto">
                <div className="flex flex-row items-center select-none">
                    {/* today btn with div on click */}

                    <div className='flex flex-row items-center'>
                        <div className={`rounded-lg  mx-1 my-2 cursor-pointer text-2xl font-bold ${time === 'today' ? 'bg-blue-700 text-white p-3' : 'bg-gray-300 text-black p-2'}`} onClick={() => setTime('today')}>
                            {t('Today')}
                        </div>
                        <div className={`rounded-lg mx-1 my-2 cursor-pointer text-2xl font-bold ${time === 'month' ? 'bg-blue-700 text-white p-3' : 'bg-gray-300 text-black p-2'}`} onClick={() => setTime('month')}>
                            {t('This_Month')}
                        </div>
                        <div className={`rounded-lg  mx-1 my-2 cursor-pointer text-2xl font-bold ${time === 'year' ? 'bg-blue-700 text-white p-3' : 'bg-gray-300 text-black p-2'}`} onClick={() => setTime('year')}>
                            {t('This_Year')}
                        </div>
                        <div className={`rounded-lg  mx-1 my-2 cursor-pointer text-xl font-bold ${time === 'custom' ? 'bg-blue-700 text-white p-3' : 'bg-gray-300 text-black p-2'}`} onClick={() => setTime('custom')} onDoubleClick={() => setDateShow(true)}>
                            {stardate.toLocaleDateString()} - {enddate.toLocaleDateString()}
                        </div>
                    </div>
                    <div className="flex flex-row items-center ml-auto">
                        {/* Export Excel btn with div  */}
                        <CustomButton

                            text={t('Export Excel')} icon={'bi bi-table mr-3 text-2xl'} textcolor='text-white ' />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 border">
                        <div className="bg-white  p-3">
                            <div className='flex flex-row'>
                                <div className="text-md font-bold">
                                    <i className="bi bi-cart mr-2"></i>
                                    {t('Sales')}
                                </div>
                                <div className="text-md font-bold ml-auto">
                                    {t('Total')} : {numberWithCommas(1000000)}
                                </div>
                            </div>
                            <div className="w-full h-96">
                               <SalesTable data={FilterSalesData}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 border">
                        <div className="bg-white  p-3">
                            <div className='flex flex-row'>
                                <div className="text-md font-bold">
                                    <i className="bi bi-cart mr-2"></i>
                                    {t('Sales')}
                                </div>
                                <div className="text-md font-bold ml-auto">
                                    {t('Total')} : {numberWithCommas(1000000)}
                                </div>
                            </div>
                            <div className="w-full h-96">
                                <PieChart />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DateSelectModal show={dateShow} setShow={setDateShow} setStartDate={setStartdate} setEndDate={setEnddate} startDate={stardate} endDate={enddate} />
        </div>
    )
}

export default Report;