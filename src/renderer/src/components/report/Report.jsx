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
    const otherincome_data = useQuery(['otherincome', type, time, formattedStartDate, formattedEndDate], getOtherIncome);
    const expense_data = useQuery(['expense', type, time, formattedStartDate, formattedEndDate], getExpense);
    const profit_data = useQuery(['profitnloss'], getProfit)

    useEffect(() => {
        sales_data.refetch();
        otherincome_data.refetch();
        expense_data.refetch();
        profit_data.refetch();
    }, [type, time, stardate, enddate])

    const FilterSalesData = useMemo(() => {
        let salesData = sales_data?.data?.data?.DATA;
        if (salesData?.length === 0) return salesData;
        let finaldata = salesData;
        return finaldata;
    }, [sales_data.data, time, type, stardate, enddate])

    const SalesChartData = useMemo(() => {
        let chartData = sales_data?.data?.data?.CHART_DATA;
        let chartLabel = sales_data?.data?.data?.CHART_LABEL;

        if (chartData?.length === 0) return chartData;
        console.log(chartData, "Chart data")
        console.log(chartLabel, "Chart data")

        return {
            labels: chartLabel, datasets: [{
                label: 'Sales',
                data: chartData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgb(255, 99, 132)',
            }]
        };
    }, [sales_data.data, time, type, stardate, enddate])

    const computeSalesTotal = useMemo(() => {
        let total = 0;
        FilterSalesData?.forEach(item => {
            total += parseInt(item.grandtotal);
        })
        return total;
    }, [sales_data.data, time, type, stardate, enddate])


    const FilterOtherIncomeData = useMemo(() => {
        let otherIncomeData = otherincome_data?.data?.data?.DATA;
        console.log(otherIncomeData, "OtherIncome")
        if (otherIncomeData?.length === 0) return otherIncomeData;
        let finaldata = otherIncomeData;
        return finaldata;
    }, [otherincome_data.data, time, type, stardate, enddate])

    const OtherIncomeChartData = useMemo(() => {
        let chartData = otherincome_data?.data?.data?.CHART_DATA;
        let chartLabel = otherincome_data?.data?.data?.CHART_LABEL;

        if (chartData?.length === 0) return chartData;
        console.log(chartData, "Chart data")
        console.log(chartLabel, "Chart data")

        return {
            labels: chartLabel, datasets: [{
                label: 'Other Income',
                data: chartData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgb(255, 99, 132)',
            }]
        };
    }
        , [otherincome_data.data, time, type, stardate, enddate])

    const computeOtherIncomeTotal = useMemo(() => {
        let total = 0;
        FilterOtherIncomeData?.forEach(item => {
            total += parseInt(item.price);
        })
        return total;
    }, [otherincome_data.data, time, type, stardate, enddate])


    const FilterExpenseData = useMemo(() => {
        let expenseData = expense_data?.data?.data?.DATA;
        if (expenseData?.length === 0) return expenseData;
        let finaldata = expenseData;
        return finaldata;
    }, [expense_data.data, time, type, stardate, enddate]);

    const ExpenseChartData = useMemo(() => {
        let chartData = expense_data?.data?.data?.CHART_DATA;
        let chartLabel = expense_data?.data?.data?.CHART_LABEL;

        if (chartData?.length === 0) return chartData;
        console.log(chartData, "Chart data")
        console.log(chartLabel, "Chart data")

        return {
            labels: chartLabel, datasets: [{
                label: 'Expense',
                data: chartData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgb(255, 99, 132)',
            }]
        };
    }, [expense_data.data, time, type, stardate, enddate])

    const computeExpenseTotal = useMemo(() => {
        let total = 0;
        FilterExpenseData?.forEach(item => {
            total += parseInt(item.price);
        })
        return total;
    }, [expense_data.data, time, type, stardate, enddate])

    const handleExcelDownload = async () => {
        const params = new URLSearchParams({
            type: type,
            time: time,
            startd: formattedStartDate,
            endd: formattedEndDate,
        });
        axios
            .get('/api/exportallreport/?' + params.toString(), {
                responseType: 'blob',
            })
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'AllReport.xlsx');
                document.body.appendChild(link);
                link.click();
                showNoti("Successfully Downloaded Excel File");
            })
            .catch(err => {
                showNoti("Failed to Download Excel File", 'bi bi-x-circle-fill text-red-500')
                setShow(false);
            });
    }

    const handleProfitNLossExcelDownload = async () => {

        axios
            .get('/api/exportprofitnloss/', {
                responseType: 'blob',
            })
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Profit And Loss.xlsx');
                document.body.appendChild(link);
                link.click();
                showNoti("Successfully Downloaded Excel File");
            })
            .catch(err => {
                showNoti("Failed to Download Excel File", 'bi bi-x-circle-fill text-red-500')
                setShow(false);
            });
    }

    const ProfitChartData = useMemo(() => {
        if (!profit_data?.data?.data) return [];

        let plusdata = profit_data?.data?.data ? Object.values(profit_data?.data?.data?.addData) : null;
        let minusData = profit_data?.data?.data ? Object.values(profit_data?.data?.data?.minusData) : null;
        let chartLabel = profit_data?.data?.data ? Object.keys(profit_data?.data?.data?.addData) : null;


        // if (plusdata?.length === 0) return plusdata;
        console.log(plusdata, "Chart data")
        console.log(chartLabel, "Chart data")

        return {
            labels: chartLabel,
            datasets: [{
                label: 'Profit',
                data: plusdata,
                borderColor: 'rgb(0, 123, 255)', // blue
                backgroundColor: 'rgb(0, 123, 255)', // blue
            },
            {
                label: 'Loss',
                data: minusData,
                borderColor: 'rgb(220, 53, 69)', // red
                backgroundColor: 'rgb(220, 53, 69)', // red
            }

            ],

        };
    }, [profit_data.data, time, type, stardate, enddate])

    const ProfitTable = useMemo(() => {
        if (!profit_data?.data?.data) return [];

        let plusdata = profit_data?.data?.data ? Object.values(profit_data?.data?.data?.addData) : null;
        let minusData = profit_data?.data?.data ? Object.values(profit_data?.data?.data?.minusData) : null;
        let chartLabel = profit_data?.data?.data ? Object.keys(profit_data?.data?.data?.addData) : null;

        //combine 3 array
        let finalData = [];
        chartLabel?.forEach((item, index) => {
            finalData.push({
                id: index,
                time: item,
                plus: plusdata[index],
                minus: minusData[index],
            })
        })

        return finalData;
    }
        , [profit_data.data, time, type, stardate, enddate])


        // press f5 to refersh data from server

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'F5') {
                sales_data.refetch();
                otherincome_data.refetch();
                expense_data.refetch();
                profit_data.refetch();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, []);



    return (
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
                    <div className="flex flex-row items-center ml-auto">
                        {/* Export Excel btn with div  */}
                        <CustomButton
                            onClick={() => handleExcelDownload()}
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
                                    {t('Total')} : {numberWithCommas(computeSalesTotal)}
                                </div>
                            </div>
                            <div className="w-full h-96 relative">
                                <SalesTable data={FilterSalesData} />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 border">
                        <div className="bg-white  p-3">
                            <div className='flex flex-row'>
                                <div className="text-md font-bold">
                                    <i className="bi bi-cart mr-2"></i>
                                    {t('Sales_Chart')}
                                </div>
                                <div className="text-md font-bold ml-auto">
                                    {t('Total')} : {numberWithCommas(computeSalesTotal)}
                                </div>
                            </div>
                            <div className="w-full h-96">
                                <SaleChart data={SalesChartData} />
                            </div>
                        </div>
                    </div>
                    {/* Other Income */}

                    <div className="col-span-2 border">
                        <div className="bg-white  p-3">
                            <div className='flex flex-row'>
                                <div className="text-md font-bold">
                                    <i className="bi bi-wallet mr-2"></i>
                                    {t('Other_Income')}
                                </div>
                                <div className="text-md font-bold ml-auto">
                                    {t('Total')} : {numberWithCommas(computeOtherIncomeTotal)}
                                </div>
                            </div>
                            <div className="w-full h-96 relative">
                                <OtherTable data={FilterOtherIncomeData} />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 border">
                        <div className="bg-white  p-3">
                            <div className='flex flex-row'>
                                <div className="text-md font-bold">
                                    <i className="bi bi-wallet mr-2"></i>
                                    {t('Other_Income')}
                                </div>
                                <div className="text-md font-bold ml-auto">
                                    {t('Total')} : {numberWithCommas(computeOtherIncomeTotal)}
                                </div>
                            </div>
                            <div className="w-full h-96">
                                <SaleChart data={OtherIncomeChartData} />
                            </div>
                        </div>
                    </div>
                    {/* Expense Table */}
                    <div className="col-span-2 border">
                        <div className="bg-white  p-3">
                            <div className='flex flex-row'>
                                <div className="text-md font-bold">
                                    <i className="bi bi-stack mr-2"></i>
                                    {t('Expense')}
                                </div>
                                <div className="text-md font-bold ml-auto">
                                    {t('Total')} : {numberWithCommas(computeExpenseTotal)}
                                </div>
                            </div>
                            <div className="w-full h-96 relative">
                                <OtherTable data={FilterExpenseData} />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 border">
                        <div className="bg-white  p-3">
                            <div className='flex flex-row'>
                                <div className="text-md font-bold">
                                    <i className="bi bi-stack mr-2"></i>
                                    {t('Expense')}
                                </div>
                                <div className="text-md font-bold ml-auto">
                                    {t('Total')} : {numberWithCommas(computeExpenseTotal)}
                                </div>
                            </div>
                            <div className="w-full h-96">
                                <SaleChart data={ExpenseChartData} />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 border">
                        <div className="bg-white  p-3">
                            <div className='flex flex-row'>
                                <div className="text-md font-bold">
                                    <i className="bi bi-bar-chart mr-2"></i>
                                    {t('Profit&Loss')}
                                </div>
                                <div className="text-md font-bold ml-auto">
                                    <div className="p-2 bg-primary text-white rounded cursor-pointer"
                                        onClick={() => handleProfitNLossExcelDownload()}
                                    >
                                        <i className="bi bi-cloud-download mr-2"></i>
                                        Download Excel File
                                    </div>
                                </div>
                            </div>
                            <h2 className='font-bold text-xl mt-2'>{new Date().getFullYear()}</h2>
                            <div className="w-full h-96">
                                <SaleChart data={ProfitChartData} />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 border">
                        <div className="bg-white  p-3">
                            <div className='flex flex-row'>
                                <div className="text-md font-bold" >
                                    <i className="bi bi-bar-chart mr-2"></i>
                                    {t('Profit&Loss')}
                                </div>

                            </div>
                            <div className="w-full h-96 relative">
                                <ProfitnLossTable data={ProfitTable} />
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