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



    const { settings, ChangeSettings } = useSetting();
    const { t } = useTranslation();



    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {

            setShow(false);

        }
    })

    useEffect(() => {
        if (settings?.paper == 58) {
            ChangeSettings(500, 'paperWidth')
        } else if (settings?.paper == 80) {
            ChangeSettings(620, 'paperWidth')
        }
    }, [settings?.paperWidth, settings?.paper])




    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${show ? 'scale-100' : ''}`}>
            <div className="bg-white rounded-lg w-1/3">
                <div className="flex justify-between items-center p-2">
                    <div className='flex flex-row items-center'>
                        <i className='bi bi-receipt text-2xl mr-2'></i>
                        <h1 className="text-xl font-bold">Voucher</h1>
                    </div>
                    <button className="text-red-500 p-3" onClick={() => setShow(false)}>X</button>
                </div>
                <div className="flex flex-row p-2 justify-between">
                    <div className='flex flex-row items-center'>
                        <i className='bi bi-receipt text-xl' />
                        <h1 className="text-md ml-4">{t('Paper Size')}</h1>
                    </div>
                    <div>
                        <select name="paper" id="paper" className="border border-gray-300 rounded-md p-1"
                            value={settings?.paper}
                            onChange={(e) => {
                                console.log(e.target.value)
                                ChangeSettings(e.target.value, 'paper')

                            }}
                        >
                            <option value={58}>58 mm  (2 inches)</option>
                            <option value={80}>80 mm (3 inches)</option>
                            <option value="A4">A4 (8.268 in x 11.693 in)</option>
                            <option value="A5">
                                A5 (5.83 in x 8.27 in)
                            </option>

                        </select>
                    </div>

                </div>
                <div className="flex flex-row p-2 justify-between">
                    <div className='flex flex-row items-center'>
                        <i className='bi bi-arrows text-xl' />
                        <h1 className="text-md ml-4">{t('Printable Width')}</h1>
                    </div>
                    <div>
                        <input type="number" name="width" id="width" className="border border-gray-300 rounded-md p-1 mr-2"
                            value={settings?.paperWidth}
                            onChange={(e) => {
                                ChangeSettings(e.target.value, 'paperWidth')
                            }
                            }
                        />
                        px
                    </div>

                </div>
                <div className="flex flex-row p-2 justify-between">
                    <div className='flex flex-row items-center'>
                        <i className='bi bi-pencil text-xl' />
                        <h1 className="text-md ml-4">{t('Custom Voucher')}</h1>
                    </div>
                    <div className='flex flex-row items-center'>
                        <input type="checkbox" name="custom" id="custom" className="border border-gray-300 rounded-md p-1 mr-2"
                            value={settings?.enableCustomVoucher}
                            onChange={(e) => {
                                ChangeSettings(e.target.checked, 'enableCustomVoucher')
                            }
                            }
                        />
                        <label className="text-md cursor-pointer select-none" htmlFor='custom'>{t('Enable')}</label>
                        <button className='bg-white border border-gray-300 rounded-md p-2 ml-3'>
                            {t('Edit Voucher')}
                        </button>
                    </div>

                </div>


            </div>

        </div>
    )
}

export default VoucherProperties;