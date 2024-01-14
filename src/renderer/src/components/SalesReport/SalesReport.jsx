import react, { useState, useEffect, useTransition, useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import { APPNAME } from '../../config/config';
import { IMAGE } from '../../config/image';
import TextInput from '../custom_components/TextInput';
import { getExpense, getOtherIncome, getProfit, getSales, login } from '../../server/api';
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
import OtherTable from './OtherTable';
import ProfitnLossTable from './ProfitnLossTable';
import SalesForm from './SalesForm';
import { CartContextTempProvider } from './CartContextTempProvier';
import VoucherView from '../custom_components/VoucherView';

const SalesReport = () => {

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

    const [searchtext, setSearchtext] = useState('');


    useEffect(() => {
        sales_data.refetch();
    }, [type, time, stardate, enddate])

    const FilterSalesData = useMemo(() => {
        let salesData = sales_data?.data?.data?.DATA;
        if (salesData?.length === 0) return salesData;
        let finaldata = salesData;
        return finaldata;
    }, [sales_data.data, time, type, stardate, enddate])



    const computeSalesTotal = useMemo(() => {
        let total = 0;
        FilterSalesData?.forEach(item => {
            total += parseInt(item.grandtotal);
        })
        return total;
    }, [sales_data.data, time, type, stardate, enddate])


    const [selectedRow, setSelectedRow] = useState(null);


    return (
        <CartContextTempProvider>


            <div className='flex flex-row h-screen'>
                <Navigation />
                <Loading show={loading} />
                <div className="bg-white font-sans h-full w-full px-3 overflow-auto ">
                    <div className="flex flex-row items-center select-none w-full sticky bg-white shadow-sm" style={{ top: 0, zIndex: 1 }}>
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

                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1 border">
                            <div className="bg-white  p-3">
                                <div className='flex flex-row items-center'>
                                    <div className="text-md font-bold">
                                        <i className="bi bi-cart mr-2"></i>
                                        {t('Sales')}
                                    </div>
                                    {/* Search Receipt Bar  */}
                                    <div className="ml-3">
                                        <input type="text" className="border rounded-lg p-2" placeholder={t('Search Receipt')} value={searchtext} onChange={e => setSearchtext(e.target.value)} />
                                    </div>
                                    <div className="text-md font-bold ml-auto">
                                        {t('Total')} : {numberWithCommas(computeSalesTotal)}
                                    </div>
                                </div>
                                <div className="w-full relative" style={{
                                    height: 'calc(100vh - 120px)'
                                }}>
                                    <SalesTable data={FilterSalesData} selectedRow={selectedRow} setSelectedRow={setSelectedRow} searchtext={searchtext} />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 border p-2">

                            <SalesForm defaultname={selectedRow?.customerName} salesid={selectedRow?.receiptNumber} sales_data={sales_data} setSelectedRow={setSelectedRow} />

                        </div>
                        <div className="col-span-1 border p-2">

                           <VoucherView data={selectedRow}/>
                        </div>
                        {/* Other Income */}
                    </div>
                </div>
                <DateSelectModal show={dateShow} setShow={setDateShow} setStartDate={setStartdate} setEndDate={setEnddate} startDate={stardate} endDate={enddate} />
            </div>
        </CartContextTempProvider>
    )
}

export default SalesReport;