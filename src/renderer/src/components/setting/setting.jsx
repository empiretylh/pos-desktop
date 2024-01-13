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
import { Link } from 'react-router-dom';

const Setting = () => {


    const [loading, setLoading] = useState(false);

    const { user_data, profiledata } = useAuth();

    // useEffect(() => {
    //     user_data.refetch();
    // }
    //     , []);

    return (
        <div className='flex flex-row h-screen'>
            <Navigation />
            <Loading show={loading} />
            <div className="bg-white font-sans h-full w-full px-3 overflow-auto">
                <div className="flex justify-center flex-col items-center w-full">
                    <h1 className="text-xl font-bold mt-10">Settings</h1>
                    <div className="card rounded-lg border mt-3 shadow-lg p-3 w-1/2">
                        <div className='flex flex-row items-center'>
                            <img src={axios.defaults.baseURL + profiledata?.image} className='w-20 h-20 rounded-full' onError={
                                (e) => {
                                    e.target.onerror = null;
                                    e.target.src = IMAGE.app_icon;
                                }
                            } />
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold">{profiledata?.name}</h1>
                                <h1 className="text-md text-gray-800">{profiledata?.username}</h1>
                                <h1 className="text-md text-gray-800">{profiledata?.email}</h1>
                                <h1 className="text-md text-gray-800">{profiledata?.address}</h1>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}


const kFormatter = num => {
    return Math.abs(num) > 999
        ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1)
        : Math.sign(num) * Math.abs(num);
};

export default Setting;