import react, { useState, useEffect, useTransition } from 'react';
import { useMutation } from 'react-query';
import { APPNAME } from '../../config/config';
import { IMAGE } from '../../config/image';
import TextInput from '../custom_components/TextInput';
import { login } from '../../server/api';
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

const Dashboard = () => {

    const [showtype, setShowtype] = useState('today');

    const [loading, setLoading] = useState(false);

    const { setToken } = useAuth();

    const { t } = useTranslation();



    return (
        <div className='flex flex-row h-screen'>
            <Navigation />
            <Loading show={loading} />
            <div className="bg-white font-sans h-full w-full px-3 overflow-auto">
                <div className='grid lg:grid-cols-4 gap-2 mt-5 sm:grid-cols-2'>
                    <div className='w-full rounded-sm relative'>
                        <img src={IMAGE.d1} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 10, left: 10 }}>
                            <div className="flex flex-row items-center">
                                <i className='bi bi-cart-fill text-white text-5xl mr-2'></i>
                                <div>
                                    <h1 className='text-2xl font-bold text-white'>{t('Sales')}</h1>
                                    <h1 className='text-xl mt-2 font-bold text-white'>{numberWithCommas(10000)} MMK</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full rounded-sm relative'>
                        <img src={IMAGE.d2} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 10, left: 10 }}>
                            <div className="flex flex-row items-center">
                                <i className='bi bi-stack text-white text-5xl mr-2'></i>
                                <div>
                                    <h1 className='text-2xl font-bold text-white'>{t('Expense')}</h1>
                                    <h1 className='text-xl mt-2 font-bold text-white'>{numberWithCommas(10000)} MMK</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full rounded-sm relative'>
                        <img src={IMAGE.d3} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 10, left: 10 }}>
                            <div className="flex flex-row items-center">
                                <i className='bi bi-cash text-white text-5xl mr-2'></i>
                                <div>
                                    <h1 className='text-2xl font-bold text-white'>{t('Purchase')}</h1>
                                    <h1 className='text-xl mt-2 font-bold text-white'>{numberWithCommas(10000)} MMK</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full rounded-sm relative'>
                        <img src={IMAGE.d4} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 10, left: 10 }}>
                            <div className="flex flex-row items-center">
                                <i className='bi bi-bag-dash-fill text-white text-5xl mr-2'></i>
                                <div>
                                    <h1 className='lg:text-xl md:text-xl  font-bold text-white'>{t('pd_balance_amount')}</h1>
                                    <h1 className='text-xl mt-2 font-bold text-white'>{numberWithCommas(10000)} MMK</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-full rounded-xl relative bg-primary p-3 '>

                        <div className="flex flex-row items-center">
                            <i className='bi bi-person-fill text-white text-5xl mr-2'></i>
                            <div>
                                <h1 className='text-xl md:text-xl  font-bold text-white'>{t('Customer')}</h1>
                                <h1 className='text-xl mt-2 font-bold text-white'>{numberWithCommas(10000)} MMK</h1>
                            </div>
                        </div>
                    </div>

                    <div className='w-full rounded-xl relative bg-primary p-3 '>
                        <div className="flex flex-row items-center">
                            <i className='bi bi-box2-fill text-white text-5xl mr-2'></i>
                            <div>
                                <h1 className='text-xl md:text-xl  font-bold text-white'>{t('Supplier')}</h1>
                                <h1 className='text-xl mt-2 font-bold text-white'>{numberWithCommas(10000)} MMK</h1>
                            </div>
                        </div>
                    </div>
                    <div className='w-full rounded-xl relative bg-orange-500 p-3 '>
                        <div className="flex flex-row items-center">
                            <i className='bi bi-box2-fill text-white text-5xl mr-2'></i>
                            <div>
                                <h1 className='text-xl md:text-xl  font-bold text-white'>Less than 10 qty</h1>
                                <h1 className='text-xl mt-2 font-bold text-white'>0 Products</h1>
                            </div>
                        </div>
                    </div>
                    <div className='w-full rounded-xl relative bg-red-500 p-3 '>
                        <div className="flex flex-row items-center">
                            <i className='bi bi-box2-fill text-white text-5xl mr-2'></i>
                            <div>
                                <h1 className='text-xl md:text-xl  font-bold text-white'>Expire in week</h1>
                                <h1 className='text-xl mt-2 font-bold text-white'>0 Products</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-2 mt-2">
                    <div className="border p-2">
                        <h1 className="text-xl font-bold">{t('TFSP')}</h1>
                        <PieChart />
                    </div>
                    <div className="border p-2">
                        <h1 className="text-xl font-bold">{t('TMP')}</h1>
                        <TopMoneyTable />
                    </div>
                    <div className="border p-2">
                        <div className="flex flex-row justify-between w-full">
                            <h1 className="text-xl font-bold">{t('Sales_Chart')}</h1>
                            <select className="border rounded-md p-1" onChange={e => {
                                setShowtype(e.target.value);
                            }}>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>
                        <SaleChart />
                    </div>
                    <div className="border p-2">
                        <h1 className="text-xl font-bold">{t('Sales_Table')}</h1>
                        <SalesTable />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;