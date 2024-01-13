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
                        {data ? data.map((item, index) => (
                            <tr key={index}>
                                <td className='border px-2 py-1'>{item.title}</td>
                                <td className='border px-2 py-1'>{numberWithCommas(item.price)} MMK</td>
                            </tr>
                        )) : <tr colSpan={2} className='text-center'>
                            <td className='border px-2 py-1'>No Data</td>
                        </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SalesTable;