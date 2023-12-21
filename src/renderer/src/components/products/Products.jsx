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
import ProductTable from './ProductTable';
import CustomButton from '../custom_components/CustomButton';

const Products = () => {

    const [showtype, setShowtype] = useState('today');

    const [loading, setLoading] = useState(false);

    const [selected, setSelected] = useState('Sales');

    const { setToken } = useAuth();

    const { t } = useTranslation();



    return (
        <div className='flex flex-row h-screen'>
            <Navigation />
            <Loading show={loading} />
            <div className="bg-white font-sans h-full w-full p-3 overflow-auto">
                <div className="flex flex-row items-center sticky top-0 p-3 bg-white ">
                    <i className='bi bi-bag text-2xl mr-2'></i>
                    <h1 className='text-2xl font-bold'>{t('Products')}</h1>

                    <div className="flex flex-row w-full justify-center items-center">
                        <CustomButton text={t('Add_Product')} icon={'bi bi-bag-plus mr-3 text-2xl'} textcolor='text-white mr-3' />
                        <CustomButton text={t('Add_Category')} icon={'bi bi-bookmark-plus mr-3 text-2xl'} textcolor='text-white mr-3' />
                        <CustomButton text={t('Excel Export/Import')} icon={'bi bi-table mr-3 text-2xl'} textcolor='text-white mr-3' />
                        <CustomButton text={t('Change Price')} icon={'bi bi-percent mr-3 text-2xl'} textcolor='text-white mr-3' />
                    </div>
                    <h1 className='text-lg font-bold text-right' style={{ width: 180 }}>103000 MMK</h1>


                </div>

                {/*Search Bar */}
                <div className='grid grid-cols-3 gap-3 mt-3'>
                    <div className="col-span-2 border p-2">
                        <div className="flex flex-row items-center mt-3 w-full">
                            <icon className="bi bi-search text-2xl text-gray-400 mr-2"></icon>
                            <input type="text" className="border border-gray-300 rounded-md w-full p-2 mr-3" placeholder={t('Search Products')} />
                        </div>

                        <div>
                            {/* 2 tab Sales and Category if selected fill color */}
                            <div className="flex flex-row items-center mt-3">
                                <button className={`border border-gray-300 ${selected == 'Sales' ? 'bg-primary text-white font-bold' : ''} rounded-md w-1/2 p-2 mr-3`}
                                    onClick={() => {
                                        setSelected("Sales")
                                    }}
                                >{t('Sales')}</button>
                                <button
                                    onClick={() => {
                                        setSelected("Category")
                                    }}
                                    className={`border border-gray-300 ${selected == 'Category' ? 'bg-primary text-white font-bold' : ''} rounded-md w-1/2 p-2 mr-3`}>{t('Category')}</button>
                                {/* Sort with select -option */}
                                <h1 className='mx-2 w-[100px]'>{t('Sort By :')}</h1>
                                <select className="border border-gray-300 rounded-md w-[200px] p-2 mr-3">
                                    <option value="">{t('Name')}</option>
                                    <option value="">{t('Price')}</option>
                                    <option value="">{t('Quantity')}</option>
                                </select>

                            </div>

                        </div>

                        {/* Table */}
                        <ProductTable/>
                    </div>

                    <div className="col-span-1 border p-2">
                        <form className="flex flex-col overflow-x-hidden overflow-y-auto">
                            <label className="text-lg font-bold">{t('Product')}</label>

                            <label className="text-sm text-black font-bold">{t('ProductName')}</label>
                            <input type="text" className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('ProductName')} required />

                            <label className="text-sm text-black font-bold mt-1">{t('Barcode')}</label>
                            <input type="number" className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('Barcode')} />

                            <label className="text-sm text-black font-bold mt-1">{t('Category')}</label>
                            <select className="border border-gray-300 rounded-md w-full p-2 mr-3 my-1" required>
                                <option value="">{t('Category')}</option>
                                <option value="">{t('Category')}</option>
                                <option value="">{t('Category')}</option>
                            </select>

                            {
                                /* qty, price , cost , supplier name*/
                            }
                            <label className="text-sm text-black font-bold mt-1">{t('Quantity')}</label>
                            <input type="number" className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('Quantity')} required />

                            <label className="text-sm text-black font-bold mt-1">{t('Price4')}</label>
                            <input type="number" className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('Price4')} required />

                            <label className="text-sm text-black font-bold mt-1">{t('Price5')}</label>
                            <input type="number" className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('Price5')} required />

                            <label className="text-sm text-black font-bold mt-1">{t('Supplier_Name')}</label>
                            <input type="text" className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('Supplier_Name')} />

                            {/*Expire Date */}
                            <label className="text-sm text-black font-bold mt-1">{t('Expire_Date')}</label>
                            <input type="date" className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('Expire_Date')} />

                            {/* Description */}
                            <label className="text-sm text-black font-bold mt-1">{t('Description')}</label>
                            <input type="text" className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('Description')} />

                            <button className="bg-primary text-white rounded-md w-full p-2 mr-3 mt-1">{t('Add_Product')}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products;