import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import numberWithCommas from '../custom_components/NumberWithCommas';
import { deleteCustomer, deleteVoucherfromCustomer } from '../../server/api';
import { useMutation } from 'react-query';
import { useCustomerData } from '../../context/CustomerProvider';
import { useAlertShow } from '../custom_components/AlertProvider';


const ProfitnLossTable = ({ data, searchtext = '', sortby = 'name', selectedRow, setSelectedRow, rowDoubleClick, setShowPayment, customerid }) => {
    const { t } = useTranslation();

    const filterData = useMemo(() => {
        if (data) {
            const sorted_data = data;

            return sorted_data;
        }
    }, [data, searchtext, sortby])




    return (<div className={`w-full overflow-auto my-2 absolute h-full`}>
        <div className='w-full h-full'>
            <table className={`w-full ${data?.length > 10 ? 'h-full' : ''}`}>
                <thead className='bg-primary sticky top-0 text-white'>
                    <tr>
                        <th className='border px-2 py-2'>{t('Time')}</th>
                        <th className='border px-2 py-2'>{t('Income')}</th>
                        <th className='border px-2 py-2'>{t('Expense&Purchase')}</th>
                        <th className='border px-2 py-1'>{t('Profit&Loss')}</th>
                    </tr>
                </thead>
                <tbody className='mt-1'>
                    {data ? filterData.map((item, index) => (
                        <tr
                            onDoubleClick={() => rowDoubleClick(item)}
                            key={index}
                            className={`cursor-pointer hover:bg-slate-100 select-none ${selectedRow?.id === item.id ? 'bg-blue-200' : ''}`}
                        >      <td className='border px-2 py-1 text-center'>{item.time}</td>
                            <td className='border px-2 py-1'>{numberWithCommas(item.plus)}</td>

                            <td className='border px-2 py-1 text-right'>{numberWithCommas(item.minus)}</td>

                            <td className='border px-2 py-1 text-center'>{numberWithCommas(parseInt(item.plus) - parseInt(item.minus))}</td>

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

export default ProfitnLossTable;