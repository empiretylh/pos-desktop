import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import numberWithCommas from '../custom_components/NumberWithCommas';

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

const CustomerVoucherTable = ({ data, searchtext = '', sortby = 'name', selectedRow, setSelectedRow, rowDoubleClick }) => {
    const { t } = useTranslation();


    const filterData = useMemo(() => {
        if (data) {
            console.log(data);
            const sorted_data = data.sort((a, b) => {
                if (sortby === 'name') {
                    return a.name.localeCompare(b.name);
                } else if (sortby === 'price') {
                    return b.price - a.price;
                } else if (sortby === 'cost') {
                    return b.cost - a.cost;
                } else if (sortby === 'qty') {
                    return a.qty - b.qty;
                } else if (sortby === 'expire') {
                    // two date compare
                    if (a.expiry_date && b.expiry_date) {
                        const date1 = new Date(a.expiry_date);
                        const date2 = new Date(b.expiry_date);
                        return date1 - date2;
                    } else if (a.expiry_date) {
                        return -1;
                    }
                    else if (b.expiry_date) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    return 0;

                }
            }
            )

            return sorted_data.filter(item => {
                if (item?.customerName?.toLowerCase()?.includes(searchtext.toLowerCase()) || item?.voucherNumber?.toLowerCase()?.includes(searchtext.toLowerCase())) {
                    return item;
                }
            })
        }
    }, [data, searchtext, sortby])

    const defaultdata = generateRandomData(10);
    return (
        <div className={`w-full overflow-auto my-2`} style={{
            height: "calc(100vh - 200px)"
        }}>
            <div className='w-full h-full'>
                <table className='w-full'>
                    <thead className='bg-primary sticky top-0 text-white'>
                        <tr>
                            <th className='border px-2 py-2'>{t('No')}</th>

                            <th className='border px-2 py-2'>{t('Receipt_Number')}</th>
                            <th className='border px-2 py-2'>{t('Name')}</th>
                            <th className='border px-2 py-2'>{t('Total_Amount')}</th>
                            <th className='border px-2 py-2'>{t('Customer_Payment')}</th>
                            <th className='border px-2 py-2'>{t('TRemaing')}</th>
                            <th className='border px-2 py-2'>{t('Date')}</th>
                            <th className='border px-2 py-2'></th>

                        </tr>
                    </thead>
                    <tbody className='mt-1'>
                        {data ? filterData.map((item, index) => (
                            <tr
                                onDoubleClick={() => rowDoubleClick(item)}
                                key={index}
                                className={`cursor-pointer hover:bg-slate-100 select-none`}
                            >      <td className='border px-2 py-1 text-center'>{index + 1}</td>
                                <td className='border px-2 py-1'>{item.voucherNumber}</td>
                                <td className='border px-2 py-1'>{item.customerName}</td>



                                <td className='border px-2 py-1 text-right'>{numberWithCommas(parseInt(item.grandtotal))}</td>
                                <td className='border px-2 py-1 text-right'>{numberWithCommas(parseInt(item.customer_payment))}</td>
                                <td className='border px-2 py-1 text-right'>{numberWithCommas(parseInt(item.grandtotal) - parseInt(item.customer_payment))}</td>
                                <td className='border px-2 py-1 text-right'>{new Date(item.date).toLocaleDateString()}</td>
                                <td claassName='border px-2 py-1 text-center'>
                                    <button
                                        onClick={() => setSelectedRow(item)}
                                        className='px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 text-center w-full'

                                    >{t('Set Payment')}</button>
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

export default CustomerVoucherTable;