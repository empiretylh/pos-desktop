import React, { useMemo, useState } from 'react';
import numberWithCommas from '../custom_components/NumberWithCommas';
import { useTranslation } from 'react-i18next';
import { IDToCategory } from '../../context/CategoryDataProvider';

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

const ProductTable = ({ data, searchtext = '', sortby = 'name', selectedRow, setSelectedRow, rowDoubleClick }) => {
    const { t } = useTranslation();



    //fill 0 if barcode has less than 13 digits
    const fillBarcode = (barcode = '0') => {
        if (barcode?.length < 13) {
            const fill = 13 - barcode.length;
            let newbarcode = '';
            for (let i = 0; i < fill; i++) {
                newbarcode += '0';
            }
            return newbarcode + barcode;
        } else {
            return barcode;
        }
    }

    //filter data with searchtext by product name and barcode and category and also sort with sortby ('name', 'price', 'cost', 'qty', 'expire')
    const filterData = useMemo(() => {
        if (data) {
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
                if (item.name.toLowerCase()?.includes(searchtext.toLowerCase()) || item?.barcode?.includes(searchtext) || IDToCategory(item.category).toLowerCase().includes(searchtext.toLowerCase())) {
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

                            <th className='border px-2 py-2'>{t('ProductName')}</th>
                            <th className='border px-2 py-2'>{'Qty'}</th>
                            <th className='border px-2 py-2'>{t('Price4')}</th>
                            <th className='border px-2 py-2'>{t('Price5')}</th>
                            <th className='border px-2 py-2'>{t('Expire Date')}</th>
                            <th className='border px-2 py-1'>{t('Category')}</th>
                            <th className='border px-2 py-1'>{t('Barcode')}</th>
                        </tr>
                    </thead>
                    <tbody className='mt-1'>
                        {data ? filterData.map((item, index) => (
                            <tr
                                onDoubleClick={() => rowDoubleClick(item)}
                                key={index}
                                className={`cursor-pointer hover:bg-slate-100 select-none ${selectedRow?.id === item.id ? 'bg-blue-200' : ''}`}
                            >      <td className='border px-2 py-1 text-center'>{index + 1}</td>
                                <td className='border px-2 py-1'>{item.name}</td>

                                <td className={`border px-2 py-1 text-center ${item.qty  <= 0  ?  'bg-red-500 text-white' : ''}`}>{item.qty}</td>
                                <td className={`border px-2 py-1 text-right ${parseInt(item?.price) < parseInt(item?.cost) ? 'bg-red-500 text-white' : ''}`}>{numberWithCommas(item.price)}</td>

                                <td className={`border px-2 py-1 text-right ${parseInt(item?.price) < parseInt(item?.cost) ? 'bg-red-500 text-white' : ''}`}>{numberWithCommas(item.cost)}</td>
                                <td className='border px-2 py-1 text-center'>{item.expiry_date}</td>

                                <td className='border px-2 py-1'>{IDToCategory(item.category)} </td>
                                <td className='border px-2 py-1 font-mono text-right text-sm'>{fillBarcode(item.barcode)}</td>
                            </tr>
                        )) : defaultdata.map((item, index) => (
                            <tr key={index} className={`cursor-pointer hover:bg-slate-400`}>
                                <td className='border px-2 py-1'>{item.name}</td>
                                <td className='border px-2 py-1'>{numberWithCommas(item.price)} MMK</td>
                                <td className='border px-2 py-1'>{numberWithCommas(item.price)} MMK</td>

                                <td className='border px-2 py-1'>{numberWithCommas(item.price)} MMK</td>
                                <td className='border px-2 py-1'>{numberWithCommas(item.price)} MMK</td>

                                <td className='border px-2 py-1'>{numberWithCommas(item.price)} MMK</td>
                                <td className='border px-2 py-1'>{numberWithCommas(item.price)} MMK</td>


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductTable;