import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import numberWithCommas from '../custom_components/NumberWithCommas';
import { deleteCustomer, deleteProductsFromSupplier, deleteSupplier, deleteVoucherfromCustomer } from '../../server/api';
import { useMutation } from 'react-query';
import { useCustomerData } from '../../context/CustomerProvider';
import { useAlertShow } from '../custom_components/AlertProvider';
import { useSupplierData } from '../../context/SupplierProvider';
import { useUserType } from '../../context/UserTypeProvider';

const generateRandomData = (numItems) => {
    const data = [];
    for (let i = 0; i < numItems; i++) {
        data.push({
            name: `Product ${i + 1}`,
            price: Math.floor(Math.random() * 10000) + 1,
        });
    }
    return data;
};

const SupplierVoucherTable = ({ data, searchtext = '', sortby = 'name', selectedRow, setSelectedRow, rowDoubleClick, setShowPayment, customerid}) => {
    const { t } = useTranslation();

    const {showNoti}= useAlertShow();

    const {isAdmin} = useUserType();


    const filterData = useMemo(() => {
        if (data) {
            console.log(data);
          

            return data.filter(item => {
                if (item?.name?.toLowerCase()?.includes(searchtext.toLowerCase()) || item?.barcode?.toLowerCase()?.includes(searchtext.toLowerCase())) {
                    return item;
                }
            })
        }
    }, [data, searchtext, sortby])

    const defaultdata = generateRandomData(10);

    const {supplier_data} = useSupplierData();

    const removeVoucher = useMutation(deleteProductsFromSupplier, {
        onSuccess: () => {
            supplier_data.refetch();
            showNoti("Successfully Removed Voucher")
        },
        onError: () => {
            showNoti("Failed to Delete Customer", 'bi bi-x-circle-fill text-red-500')
        }

    })


    return (
        <div className={`w-full overflow-auto my-2`} style={{
            height: "calc(100vh - 200px)"
        }}>
            <div className='w-full h-full'>
                <table className='w-full'>
                    <thead className='bg-primary sticky top-0 text-white'>
                        <tr>
                            <th className='border px-2 py-2'>{t('No')}</th>

                            <th className='border px-2 py-2'>{t('Name')}</th>
                            <th className='border px-2 py-2'>{t('Qty')}</th>

                            <th className='border px-2 py-2'>{t('Payyan')}</th>
                            <th className='border px-2 py-2'>{t('SRemaing')}</th>
                            <th className='border px-2 py-2'></th>

                        </tr>
                    </thead>
                    <tbody className='mt-1'>
                        {data ? filterData.map((item, index) => (
                            <tr
                                onDoubleClick={() => rowDoubleClick(item)}
                                key={index}
                                className={`cursor-pointer select-none ${parseInt((parseInt(item.cost) * parseInt(item.qty))- parseInt(item.supplier_payment)) == 0 ? 'bg-green-500 hover:bg-green-800' : 'hover:bg-slate-100'}`}
                            >      <td className='border px-2 py-1 text-center'>{index + 1}</td>
                                <td className='border px-2 py-1'>{item.name}</td>
                                <td className='border px-2 py-1 text-center'>{item.qty}</td>

                                <td className='border px-2 py-1 text-right'>{numberWithCommas(parseInt(item.cost) * parseInt(item.qty))}</td>
                                <td className='border px-2 py-1 text-right'>{numberWithCommas(parseInt((parseInt(item.cost) * parseInt(item.qty))- parseInt(item.supplier_payment)))}</td>
                                <td claassName='border px-2 py-1 text-center'>
                                    {parseInt((parseInt(item.cost) * parseInt(item.qty))- parseInt(item.supplier_payment)) == 0 && isAdmin ?
                                        <button
                                            onClick={() => { 
                                                removeVoucher.mutate({ supplier_id : customerid , products : item.id})
                                             }}
                                            className='px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 text-center w-full'

                                        >Remove</button>
                                        : <button
                                            onClick={() => { setSelectedRow(item); setShowPayment(true) }}
                                            className='px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 text-center w-full'

                                        >{t('Set Payment')}</button>}
                                </td>
                            </tr>
                        )) :
                            <tr>
                                <td colSpan={5} className='border px-2 py-1 text-center'>{t('No Data')}</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SupplierVoucherTable;