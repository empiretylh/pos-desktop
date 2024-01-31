import react, { useState, useEffect, useTransition, useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import { APPNAME } from '../../config/config';
import { IMAGE } from '../../config/image';
import TextInput from '../custom_components/TextInput';
import { getExpense, getSales, getTopProduct, login } from '../../server/api';
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
import { LessThanProduct, getBeforeExpireProduct, useProductsData } from '../../context/ProductsDataProvider';
import { useCustomerData } from '../../context/CustomerProvider';
import { useSupplierData } from '../../context/SupplierProvider';
import LessThanQtyModal from './LessThanQtyModal';
import ExpireInModal from './ExpireInQtyModal';
import { Link, useNavigate } from 'react-router-dom';
import { useSetting } from '../../context/SettingContextProvider';
import { useUserType } from '../../context/UserTypeProvider';

const Dashboard = () => {

    const [showtype, setShowtype] = useState('today');

    const [loading, setLoading] = useState(false);

    const { setToken } = useAuth();
    const {isAdmin} = useUserType();
    const navigate = useNavigate();

    const { t } = useTranslation();

    const [time, setTime] = useState('year');
    const [type, setType] = useState('DT');

    const [salestime, setSalesTime] = useState('t');

    const sales_data = useQuery(['sales', type, time, '', ''], getSales);
    const expense_data = useQuery(['expense', type, time, '', ''], getExpense);
    const topproduct_data = useQuery(['topproduct', time], getTopProduct);

    const { product_data, data: pdata } = useProductsData();

    const { customer_data, data: customerdata } = useCustomerData();
    const { supplier_data, data: supplierdata } = useSupplierData();
    const {settings} = useSetting();

    const [lessthanshow, setLessThanShow] = useState(false);
    const [expireshow, setExpireShow] = useState(false);

    // if usertype is not admin go to sales
    useEffect(() => {
        if(!isAdmin){
            navigate('/sales')
        }
    }, [isAdmin])

    const TopProductPie = useMemo(() => {
        let data = [];
        if (topproduct_data?.data) {
            console.log(topproduct_data.data?.data)
            for (var [k, v] of Object.entries(topproduct_data.data?.data?.T_Freq)) {
                data.push({ title: k, value: v, color: '#' + Math.floor(Math.random() * 16777215).toString(16) })
            }
        }

        if (data?.length <= 0)
            return data;

        //sort data by top value first
        data.sort((a, b) => {
            return b.value - a.value;
        })
        //    make data top 3 value and other as one so 4 in pie cahrt
        let sum = 0;
        data.map(item => {
            sum += item.value;
        })
        let other = sum - data[0]?.value - data[1]?.value - data[2]?.value;

        data = [
            ...data.slice(0, 3),
            { title: 'other', value: other, color: '#' + Math.floor(Math.random() * 16777215).toString(16) }
        ]


        return data;

    }, [topproduct_data.data]);

    const TopMoneyTableData = useMemo(() => {
        let data = [];
        if (topproduct_data?.data) {
            console.log(topproduct_data.data?.data)
            for (var [k, v] of Object.entries(topproduct_data.data?.data?.T_Money)) {
                data.push({ name: k, price: v })
            }
        }

        if (data?.length <= 0)
            return data;

        //sort data by top value first
        data.sort((a, b) => {
            return b.price - a.price;
        })

        console.log(data)

        return data;
    }, [topproduct_data.data]);


    const SumCustomerRemaing = useMemo(() => {
        let total = 0;
        if (customer_data) {
            customer_data?.data?.data.map(item => {
                item?.sales?.map(salesItem => {
                    total += parseInt(salesItem.grandtotal) - parseInt(salesItem.customer_payment);
                })
            })
        }
        return total;
    }, [customer_data])

    const SumSupplierRemaing = useMemo(() => {
        let total = 0;
        if (supplier_data) {
            supplier_data?.data?.data.map(item => {
                item?.products?.map(pd => {
                    total += parseInt(pd.cost) * parseInt(pd.qty);
                })
            })
        }
        return total;
    }, [supplier_data])

    const SumSales = useMemo(() => {
        let sum = 0;
        if (sales_data?.data) {
            sales_data?.data?.data?.DATA?.map((item) => {
                sum += parseInt(item.grandtotal);
            })
        }
        return sum;
    }, [sales_data.data]);

    const SumExpense = useMemo(() => {
        let sum = 0;
        if (expense_data?.data) {
            console.log(expense_data.data?.data)
            expense_data?.data?.data?.DATA.map((item) => {
                sum += parseInt(item.price);
            })
        }
        return sum;
    }, [expense_data.data]);

    const SumProductCost = useMemo(() => {
        let sum = 0;
        if (pdata) {
            pdata.map((item) => {
                sum += parseInt(item.cost) * parseInt(item.qty);
            })
        }
        return sum;
    }, [pdata]);

    const SumProductGetCost = useMemo(() => {
        let sum = 0;
        if (pdata) {
            pdata.map((item) => {
                sum += parseInt(item.price) * parseInt(item.qty);
            })
        }
        return sum;
    }, [pdata]);

    const LessThanProducts = LessThanProduct(10);
    const ExpireProducts = getBeforeExpireProduct(7);

    const ComputeSales = useMemo(() => {

        const salesData = sales_data?.data?.data?.DATA;

        console.log(salesData, 'SaleS Data')
        if (salesData?.length <= 0)
            return 0;
        if (salesData) {
            const label = [];
            const pricedata = [];
            const tabledata = [];
            var totalprice = 0;

            /**
             * @param{Date} time The Date
             **/

            const format12H = time => {
                return (
                    time
                        .toLocaleTimeString()
                        .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3') +
                    (time.getHours() >= 12 ? ' PM' : ' AM')
                );
            };

            if (salestime === 't') {
                const temp = salesData.filter(e => {
                    let today = new Date();
                    let d = new Date(e.date);
                    // console.log(e.date);

                    return (
                        today.getDate() === d.getDate() &&
                        today.getMonth() === d.getMonth() &&
                        d.getFullYear() === today.getFullYear()
                    );
                });

                temp.forEach(e => {
                    let d = new Date(e.date);
                    // console.log(e.customerName)
                    //  console.log(d.getHours() + ':' + d.getMinutes());
                    let time = d.toTimeString().substring(0, 5);
                    label.push(time);
                    pricedata.push(kFormatter(parseInt(e.grandtotal)));

                    tabledata.push({
                        title: format12H(d),
                        price: parseInt(e.grandtotal)
                    })
                    totalprice += parseInt(e.grandtotal);
                });
            } else if (salestime === 'w') {
                const weekString = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                var curr = new Date();
                var first = curr.getDate() - curr.getDay();
                var last = first + 6;

                var firstdate = new Date(curr.setDate(first));
                var lastdate = new Date(curr.setDate(last));

                console.log(firstdate.getTime());

                const tempw = salesData.filter(e => {
                    let d = new Date(e.date);
                    return (
                        d.getTime() >= firstdate.getTime() &&
                        d.getTime() <= lastdate.getTime()
                    );
                });

                weekString.forEach((e, index) => {
                    console.log(e);
                    var price = 0;

                    tempw.forEach(i => {
                        var d = new Date(i.date);
                        if (d.getDay() === index) {
                            price += parseInt(i.grandtotal);
                        }
                    });

                    label.push(e);
                    pricedata.push(kFormatter(price));
                    tabledata.push({ title: e, price: parseInt(price) });
                    totalprice += price;
                });
            } else {
                const monthString = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];

                var firstd = new Date();
                firstd.setDate(1);
                firstd.setMonth(0);
                firstd.setHours(0, 0, 0, 0);

                console.log('First :' + firstd);

                var lastd = new Date();
                lastd.setDate(31);
                lastd.setMonth(11);
                lastd.setHours(24, 0, 0, 0);

                const tempm = salesData.filter(e => {
                    let d = new Date(e.date);
                    return (
                        d.getTime() >= firstd.getTime() && d.getTime() <= lastd.getTime()
                    );
                });

                monthString.forEach((e, index) => {
                    console.log(e);
                    var price = 0;

                    tempm.forEach(i => {
                        var d = new Date(i.date);
                        if (d.getMonth() === index) {
                            price += parseInt(i.grandtotal);
                        }
                    });

                    label.push(e);
                    pricedata.push(kFormatter(price));
                    tabledata.push({ title: e, price: parseInt(price) });
                    totalprice += price;
                });
            }

            if (pricedata.length > 0) {
                return {
                    pricedata: pricedata,
                    label: label,
                    saleschart: {
                        labels: label,
                        datasets: [
                            {
                                label: 'Sales',
                                data: pricedata,
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                borderWidth: 1,
                            },
                        ],

                    },
                    tabledata: tabledata,
                    totalprice: totalprice,
                };
            }
        };
    }, [sales_data.data, salestime]);

    //Press F5 to refresh data from server
    useEffect(() => {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'F5') {
                sales_data.refetch();
                expense_data.refetch();
                topproduct_data.refetch();
                product_data.refetch();
                customer_data.refetch();
                supplier_data.refetch();
            }
        })
    }, [sales_data.data, expense_data.data, topproduct_data.data, product_data.data, customer_data.data, supplier_data.data])

    return (
        <div className='flex flex-row h-screen'>
            <Navigation />
            <Loading show={loading} />
            <div className="bg-white font-sans h-full w-full px-3 overflow-auto">
                <div className='grid lg:grid-cols-4 gap-2 mt-5 sm:grid-cols-2'>
                    <Link to={'/sales'} className='w-full rounded-sm relative select-none cursor-pointer'>
                        <img src={IMAGE.d1} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 10, left: 10 }}>
                            <div className="flex flex-row">
                                <i className='bi bi-cart-fill text-white text-5xl mr-2'></i>
                                <div>
                                    <h1 className='text-2xl font-bold text-white'>{t('Sales')}</h1>
                                    <h1 className='text-xl mt-2 font-bold text-white'>{numberWithCommas(SumSales)} MMK</h1>
                                </div>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/expense'} className='w-full rounded-sm relative select-none cursor-pointer'>
                        <img src={IMAGE.d2} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 10, left: 10 }}>
                            <div className="flex flex-row ">
                                <i className='bi bi-stack text-white text-5xl mr-2'></i>
                                <div>
                                    <h1 className='text-2xl font-bold text-white'>{t('Expense')}</h1>
                                    <h1 className='text-xl mt-2 font-bold text-white'>{numberWithCommas(SumExpense)} MMK</h1>
                                </div>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/products'} className='w-full rounded-sm relative select-none cursor-pointer'>
                        <img src={IMAGE.d3} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 10, left: 10 }}>
                            <div className="flex flex-row">
                                <i className='bi bi-cash text-white text-5xl mr-2'></i>
                                <div>
                                    <h1 className='text-2xl font-bold text-white'>{t('Purchase')}</h1>
                                    <h1 className='text-xl mt-2 font-bold text-white'>{numberWithCommas(SumProductCost)} MMK</h1>
                                </div>
                            </div>
                    </div>
                    </Link>
                    <Link to={'/products'} className='w-full rounded-sm relative select-none cursor-pointer'>
                        <img src={IMAGE.d4} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 10, left: 10 }}>
                            <div className="flex flex-row ">
                                <i className='bi bi-bag-dash-fill text-white text-5xl mr-2'></i>
                                <div>   
                                    <h1 className='lg:text-sm md:text-xl  font-bold text-white'>{t('pd_balance_amount')}</h1>
                                    <h1 className='text-xl mt-2 font-bold text-white'>{numberWithCommas(SumProductGetCost)} MMK</h1>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link to={'/customer'} className='w-full rounded-xl relative select-none cursor-pointer bg-primary p-3 '>

                        <div className="flex flex-row items-center">
                            <i className='bi bi-person-fill text-white text-5xl mr-2'></i>
                            <div>
                                <h1 className='text-xl md:text-xl  font-bold text-white'>{t('Customer')}</h1>
                                <h1 className='text-xl mt-2 font-bold text-white'>{numberWithCommas(SumCustomerRemaing)} MMK</h1>
                            </div>
                        </div>
                    </Link>

                    <Link to={'/supplier'} className='w-full rounded-xl relative select-none cursor-pointer bg-primary p-3 '>
                        <div className="flex flex-row items-center">
                            <i className='bi bi-box2-fill text-white text-5xl mr-2'></i>
                            <div>
                                <h1 className='text-xl md:text-xl  font-bold text-white'>{t('Supplier')}</h1>
                                <h1 className='text-xl mt-2 font-bold text-white'>{numberWithCommas(SumSupplierRemaing)} MMK</h1>
                            </div>
                        </div>
                    </Link>
                    <div className='w-full rounded-xl relative select-none cursor-pointer bg-orange-500 p-3 ' onClick={() => setLessThanShow(true)}>
                        <div className="flex flex-r ow items-center">
                            <i className='bi bi-box2-fill text-white text-5xl mr-2'></i>
                            <div>
                                <h1 className='text-xl md:text-xl  font-bold text-white'>Less than {settings?.lessthan} qty</h1>
                                <h1 className='text-xl mt-2 font-bold text-white'>{LessThanProducts?.length} Products</h1>
                            </div>
                        </div>
                    </div>
                    <div className='w-full rounded-xl relative select-none cursor-pointer bg-red-500 p-3' onClick={() => setExpireShow(true)}>
                        <div className="flex flex-row items-center">
                            <i className='bi bi-box2-fill text-white text-5xl mr-2'></i>
                            <div>
                                <h1 className='text-xl md:text-xl  font-bold text-white'>Expire in {settings?.expireshow} days</h1>
                                <h1 className='text-xl mt-2 font-bold text-white'>{ExpireProducts?.length} Products</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-2 mt-2">
                    <div className="border p-2">
                        <h1 className="text-xl font-bold">{t('TFSP')}</h1>
                        <PieChart data={TopProductPie} />
                    </div>
                    <div className="border p-2">
                        <h1 className="text-xl font-bold">{t('TMP')}</h1>
                        <TopMoneyTable data={TopMoneyTableData} />
                    </div>
                    <div className="border p-2">
                        <div className="flex flex-row justify-between w-full">
                            <h1 className="text-xl font-bold">{t('Sales_Chart')}</h1>
                            <select className="border rounded-md p-1" onChange={e => {
                                setSalesTime(e.target.value)
                            }}>
                                <option value="t">Today</option>
                                <option value="w">This Week</option>
                                <option value="y">This Year</option>
                            </select>
                        </div>
                        <SaleChart data={ComputeSales?.saleschart} />
                    </div>
                    <div className="border p-2">
                        <h1 className="text-xl font-bold">{t('Sales_Table')}</h1>
                        <SalesTable data={ComputeSales?.tabledata} />
                    </div>
                </div>
            </div>
            <LessThanQtyModal show={lessthanshow} setShow={setLessThanShow} />
            <ExpireInModal show={expireshow} setShow={setExpireShow} />
        </div>
    )
}


const kFormatter = num => {
    return Math.abs(num) > 999
        ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1)
        : Math.sign(num) * Math.abs(num);
};

export default Dashboard;