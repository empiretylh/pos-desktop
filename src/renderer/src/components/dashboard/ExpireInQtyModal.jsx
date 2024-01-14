import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios';
import { useAlertShow } from '../custom_components/AlertProvider';
import { LessThanProduct, getBeforeExpireProduct, useProductsData } from '../../context/ProductsDataProvider';
import { useMutation, useQuery } from 'react-query';
import { changePrice, getSales, postCustomer, putCustomer, putProducts, putSupplier } from '../../server/api';
import { useCustomerData } from '../../context/CustomerProvider';
import numberWithCommas from '../custom_components/NumberWithCommas';
import { useSupplierData } from '../../context/SupplierProvider';
import { useTranslation } from 'react-i18next';
import { useSetting } from '../../context/SettingContextProvider';

const ExpireInModal = ({ show, setShow, oldSalesData, customerid }) => {

    const { showNoti, showInfo } = useAlertShow();


    const [searchtext, setSearchtext] = useState('');
    const { product_data, data } = useProductsData();
    const {settings} = useSetting();

    const pdata = getBeforeExpireProduct(settings?.expireshow);
    const { t } = useTranslation();

    const [showEditQty, setShowEditQty] = useState(false);
    const [EditData, setEditData] = useState(null);
    const [editDate, setEditDate] = useState(0);



    const UpdateProduct = useMutation(putProducts, {
        onSuccess: () => {
            product_data.refetch();
            showNoti("Successfully Updated Qty")
        },
        onError: () => {
            showNoti("Failed to Update Qty", 'bi bi-x-circle-fill text-red-500')
        }

    })



    const FilterProductsData = useMemo(() => {
        // Compare two data `salesData` and `data` with receiptNumber and intereset the result
        let salesData = pdata;
        console.log(salesData)
        if (salesData?.length === 0) return pdata;

        if (oldSalesData?.length === 0) return salesData;



        if (data) {
            let finaldata = salesData?.filter(item => !oldSalesData?.find(dataItem => dataItem.id == item.id));

            if (searchtext) finaldata = finaldata?.filter(item => item.name.toLowerCase().includes(searchtext.toLowerCase()) || item.barcode.toLowerCase().includes(searchtext.toLowerCase()));

            return finaldata;
        }

        return []


    }, [pdata?.data, data, oldSalesData, searchtext]);

    const inputRef = useRef(null);
    const qtyref = useRef(null);

    useEffect(() => {
        if (showEditQty) {
            qtyref.current.focus();
        }
    }, [showEditQty])

 
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (showEditQty) {
                setShowEditQty(false);
            }

        }
    })

  
  

    const onSubmit = (e) => {
        e.preventDefault();
        if (!editDate) {
            showNoti("Please Enter Valid Daate", 'bi bi-x-circle-fill text-red-500')
            return;
        }
        UpdateProduct.mutate({
            id: EditData.id,
            expiry_date: editDate
        })
        setShowEditQty(false);
    }

    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${show ? 'scale-100' : ''}`}>
            <div className="bg-white rounded-lg w-1/2">
                <div className="flex justify-between items-center p-2">
                    <div className='flex flex-row items-center'>
                        <i className='bi bi-package text-2xl mr-2'></i>
                        <h1 className="text-xl font-bold">Expire in {settings?.expireshow} days</h1>
                    </div>
                    <button className="text-red-500 p-3" onClick={() => setShow(false)}>X</button>
                </div>
                <div className="flex flex-row justify-between items-center p-2">
                    <div className="flex flex-row items-center">
                        {/* Search Input */}
                        <input type="text"
                            className="border-2 border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500" placeholder="Search Products" value={searchtext} onChange={(e) => setSearchtext(e.target.value)} />
                        {/* Filter Type */}
                    </div>
                   
                </div>
                <div className="p-2  overflow-y-auto" style={{
                    height: 'calc(100vh - 200px)',
                }}>
                    {FilterProductsData?.length > 0 ?
                        FilterProductsData?.map((item, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 p-2 border-b-2 items-center">
                                <div className="flex flex-col">
                                    <h1 className="text-xl font-bold">{item.name}</h1>

                                    <p className="text-sm">{new Date(item.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <h1 className="text-md font-bold">{t('Expiry Date')}</h1>
                                    <h1 className="text-xl font-bold text-red-500">{item.expiry_date}</h1>

                                </div>
                                <div className="flex flex-col items-end">
                                    <button
                                        onClick={() => {
                                            setEditData(item);
                                            setShowEditQty(true);
                                        }}
                                        className={` bg-green-600 text-white px-2 p-2 rounded-md`} >Edit</button>
                                </div>
                            </div>
                        )) :
                        <div>
                            <h1 className="text-xl font-bold text-center">No Products</h1>
                        </div>
                    }
                </div>

            </div>
            {showEditQty && <div style={{
                zIndex: 99999999
            }} className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center`}>
                <div className="bg-white rounded-lg w-[400px] p-2">
                    <div className="flex justify-between items-center p-2">
                        <div className='flex flex-col'>
                            <h1 className="font-bold">Enter New Date</h1>
                            <h1 className="text-xl font-bold">{EditData?.name}</h1>
                        </div>
                        <button className="text-red-500 p-3" onClick={() => setShowEditQty(false)}>X</button>
                    </div>
                    <form className="flex flex-col mt-1" onSubmit={onSubmit}>
                        <input
                            type="date"
                            className="border-2 border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 w-full"
                            placeholder='date'
                            ref={qtyref}
                            onChange={(e) => {
                                setEditDate(e.target.value);
                            }}
                            required
                        />
                        <button
                            type='submit'
                            className="bg-primary mt-2 text-white px-2 p-2 rounded-md w-full">Save</button>
                    </form>
                </div>
            </div>}
        </div>
    )
}

export default ExpireInModal;