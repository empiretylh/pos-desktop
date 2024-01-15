import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import numberWithCommas from '../custom_components/NumberWithCommas';
import { deleteCustomer, deleteVoucherfromCustomer } from '../../server/api';
import { useMutation } from 'react-query';
import { useCustomerData } from '../../context/CustomerProvider';
import { useAlertShow } from '../custom_components/AlertProvider';
import { useCartTemp } from './CartContextTempProvier';


const SalesTable = ({ data, searchtext = '', sortby = 'name', selectedRow, setSelectedRow, rowDoubleClick, setShowPayment, customerid }) => {
    const { t } = useTranslation();


    const filterData = useMemo(() => {
        if (data) {
         

            return data?.filter(item => {
                if (item?.customerName?.toLowerCase()?.includes(searchtext.toLowerCase()) || item?.voucherNumber?.toLowerCase()?.includes(searchtext.toLowerCase())) {
                    return item;
                }
            })
        }
    }, [data, searchtext, sortby])

    const { cart, plusQty, minusQty, editQty, priceEdit, total, setCart, addListToCart,  } = useCartTemp();




    return (<div className={`w-full overflow-auto my-2 absolute h-full`}>
        <div className='w-full h-full'>
            <table className={`w-full ${filterData?.length > 15 ? 'h-full' : null}`}>
                <thead className='bg-primary sticky top-0 text-white'>
                    <tr>

                        <th className='border px-2 py-2'>{t('Receipt_Number')}</th>
                        <th className='border px-2 py-2'>{t('Name')}</th>

                        <th className='border px-2 py-2'>{t('Tax_(MMK)')}</th>
                        <th className='border px-2 py-2'>{t('Discount')}</th>
                        <th className='border px-2 py-2'>{t('Delivery_Charges')}</th>
                        <th className='border px-2 py-2'>{t('Grand_Total')}</th>

                        <th className='border px-2 py-2'>{t('Date')}</th>
                        <th className='border px-2 py-2'>{t('Description')}</th>


                    </tr>
                </thead>
                <tbody className='mt-1'>
                    {data ? filterData.map((item, index) => (
                        <tr
                            onClick={() => {
                                setSelectedRow(item);
                                addListToCart(item.sproduct);
                            }}
                            onDoubleClick={() => rowDoubleClick(item)}
                            key={index}
                            className={`cursor-pointer select-none ${selectedRow?.receiptNumber == item?.receiptNumber ? 'bg-blue-800 hover:bg-blue-900' : ' hover:bg-slate-200 '}`}>
                            <td className='border px-2 py-1'>{item.voucherNumber}</td>
                            <td className='border px-2 py-1'>{item.customerName}</td>
                            <td className='border px-2 py-1 text-right'>{numberWithCommas(parseInt(item.tax))}</td>
                            <td className='border px-2 py-1 text-right'>{numberWithCommas(parseInt(item.discount))}</td>
                            <td className='border px-2 py-1 text-right'>{numberWithCommas(parseInt(item.deliveryCharges))}</td>
                            <td className='border px-2 py-1 text-right'>{numberWithCommas(parseInt(item.totalAmount))}</td>

                            <td className='border px-2 py-1 text-right'>{new Date(item.date).toLocaleDateString()}</td>
                            <td className='border px-2 py-1 text-right'>{item.description}</td>


                        </tr>
                    )) :
                        <tr>
                            <td colSpan={10} className='border px-2 py-1 text-center'>{t('No Data')}</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default SalesTable;