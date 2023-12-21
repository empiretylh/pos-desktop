import React from 'react';
import numberWithCommas from '../custom_components/NumberWithCommas';
import { useTranslation } from 'react-i18next';

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

const ProductTable = ({ data }) => {
    const { t } = useTranslation();


    const defaultdata = generateRandomData(100);
    return (
        <div className={`w-full overflow-auto my-2`} style={{
            height: "calc(100vh - 200px)"
        }}>
            <div className='w-full h-full'>
                <table className='w-full'>
                    <thead className='bg-primary sticky top-0 text-white'>
                        <tr>
                            <th className='border px-2 py-2'>{t('ProductName')}</th>
                            <th className='border px-2 py-2'>{t('Quantity')}</th>
                            <th className='border px-2 py-2'>{t('Price4')}</th>

                            <th className='border px-2 py-2'>{t('Price5')}</th>
                            <th className='border px-2 py-2'>{t('Expire Date')}</th>
                            <th className='border px-2 py-1'>{t('Category')}</th>
                            <th className='border px-2 py-1'>{t('Supplier_Name')}</th>






                        </tr>
                    </thead>
                    <tbody className='mt-1'>
                        {data ? data.sort((i1, i2) => parseInt(i2.price, 10) - parseInt(i1.price, 10)).map((item, index) => (
                            <tr key={index}>
                                <td className='border px-2 py-1'>{item.name}</td>
                                <td className='border px-2 py-1'>{numberWithCommas(item.price)} MMK</td>
                            </tr>
                        )) : defaultdata.sort((i1, i2) => parseInt(i2.price, 10) - parseInt(i1.price, 10)).map((item, index) => (
                            <tr key={index} className='cursor-pointer hover:bg-slate-400'>
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