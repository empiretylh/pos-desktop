import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios';
import { useAlertShow } from '../custom_components/AlertProvider';
import { LessThanProduct, getBeforeExpireProduct, useProductsData } from '../../context/ProductsDataProvider';
import { useMutation, useQuery } from 'react-query';
import { changePrice, getSales, postCustomer, profileupdate, putCustomer, putProducts, putSupplier } from '../../server/api';
import { useCustomerData } from '../../context/CustomerProvider';
import numberWithCommas from '../custom_components/NumberWithCommas';
import { useSupplierData } from '../../context/SupplierProvider';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContextProvider';
import { useSetting } from '../../context/SettingContextProvider';

const VoucherProperties = ({ show, setShow, data, customerid }) => {

    const { showNoti, showInfo } = useAlertShow();
    const { user_data } = useAuth();
    const inputRef = useRef();

    const [oldData, setOldData] = useState(data);

    const { settings, ChangeSettings } = useSetting();
    const { t } = useTranslation();



    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {

            setShow(false);

        }
    })


    const onInputChange = (e) => {
        setOldData({ ...oldData, [e.target.name]: e.target.value });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        putProfile.mutate(oldData);
        setShow(false)
    }



    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${show ? 'scale-100' : ''}`}>
            <div className="bg-white rounded-lg w-1/2">
                <div className="flex justify-between items-center p-2">
                    <div className='flex flex-row items-center'>
                        <i className='bi bi-receipt text-2xl mr-2'></i>
                        <h1 className="text-xl font-bold">Voucher</h1>
                    </div>
                    <button className="text-red-500 p-3" onClick={() => setShow(false)}>X</button>
                </div>
                <div className="flex flex-col p-2">
                    <div className='flex flex-row items-center'>
                        <i className='bi bi-receipt text-xl' />
                        <h1 className="text-md ml-4">{t('Voucher Footer Text')}</h1>
                    </div>
                    <div>
                        <textarea type="textarea" multiple className='border rounded-md p-2 w-full mr-2 mt-2' />

                    </div>
                </div>


            </div>

        </div>
    )
}

export default VoucherProperties;