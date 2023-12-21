import React from 'react';
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

const SalesTable = ({ data, height = 250 }) => {


    const defaultdata = generateRandomData(100);
    return (
        <div className={`w-full overflow-auto my-2`} style={{ height: height }}>
            <div className='w-full h-full'>
                <table className='w-full'>
                    <thead className='bg-primary sticky top-0 text-white'>
                        <tr>
                            <th className='border px-2 py-1'>Time</th>
                            <th className='border px-2 py-1'>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data ? data.sort((i1, i2) => parseInt(i2.price, 10) - parseInt(i1.price, 10)).map((item, index) => (
                            <tr key={index}>
                                <td className='border px-2 py-1'>{item.name}</td>
                                <td className='border px-2 py-1'>{numberWithCommas(item.price)} MMK</td>
                            </tr>
                        )) : defaultdata.sort((i1, i2) => parseInt(i2.price, 10) - parseInt(i1.price, 10)).map((item, index) => (
                            <tr key={index}>
                                <td className='border px-2 py-1'>{item.name}</td>
                                <td className='border px-2 py-1'>{numberWithCommas(item.price)} MMK</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SalesTable;