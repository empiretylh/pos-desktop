import React, { useEffect, useMemo, useState } from 'react';
import numberWithCommas from '../custom_components/NumberWithCommas';
import { useTranslation } from 'react-i18next';
import { IDToCategory } from '../../context/CategoryDataProvider';
import { useCart } from './CartContextProvier';

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

const ProductTable = ({ data, searchtext = '', sortby = 'name', selectedProduct, setSelectProduct, selectedCategory = "All" }) => {
    const { t } = useTranslation();

    const { addToCart, removeFromCart, clearCart, cart , SSI} = useCart();


    const [selectedRow, setSelectedRow] = useState(0);




    const filterData = useMemo(() => {
        if (data) {
            let filtered_data;
            setSelectedRow(0);

            if (selectedCategory === 'All') {
                filtered_data = data;
            } else {

                filtered_data = data.filter(item => {
                    //filter by category  if selectedCategory is not 'All'
                    if (selectedCategory !== 'All') {
                        if (item.category == selectedCategory) {
                            return true;
                        }
                    }
                });
            }

            let sorted_data = filtered_data.sort((a, b) => {
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

            //remove same data from sorted data by cart
            if (cart) {
                cart.forEach(item => {
                    sorted_data = sorted_data.filter((data) => {
                        if (data.id !== item.id) {
                            return true;
                        }
                    })
                })
            }


            return sorted_data?.filter(item => {
                if (item.name.toLowerCase()?.includes(searchtext.toLowerCase()) || item?.barcode?.includes(searchtext) || IDToCategory(item.category).toLowerCase().includes(searchtext.toLowerCase())) {
                    return item;
                }
            })
        }
    }, [data, searchtext, sortby, selectedCategory, cart])


    const handleKeyDown = (event, index) => {
        switch (event.key) {
            case 'ArrowUp':
                setSelectedRow(Math.max(0, selectedRow - 1));
                break;
            case 'ArrowDown':
                setSelectedRow(Math.min(data.length - 1, selectedRow + 1));
                break;
            case 'Tab':
                setSelectedRow(Math.min(data.length - 1, selectedRow + 1));
                break;
            case 'Enter':
                // Replace this with your code to handle row selection
                addToCart(filterData[selectedRow], SSI)
                break;
            default:
                break;
        }
    };

    useEffect(()=>{
        setSelectProduct(filterData[selectedRow])
    },[selectedRow, searchtext, cart])

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
                            <th className='border px-2 py-2'>{' '}</th>
                        </tr>
                    </thead>
                    <tbody className='mt-1'>
                        {data ? filterData.map((item, index) => (
                            <tr
                                onKeyDown={(event) => handleKeyDown(event, index)}
                                onDoubleClick={(event) => addToCart(item, SSI)}
                                onMouseOver={() => setSelectedRow(index)}
                                key={index}
                                tabIndex={0}
                                className={`cursor-pointer hover:bg-slate-100 active:bg-primary active:text-white select-none outline-none ${index === selectedRow ? 'border-2 border-cyan-500' : ''}`}
                            >      <td className='border px-2 py-1 text-center'>{index + 1}</td>
                                <td className='border px-2 py-1'>{item.name}</td>

                                <td className='border px-2 py-1 text-center'>{item.qty}</td>
                                <td className='border px-2 py-1 text-right'>{numberWithCommas(item.price)}</td>

                                <td className='border px-2 py-1 text-center'>
                                    <button onClick={() => addToCart(item, SSI)} className=' w-full px-2 py-1 bg-primary text-white rounded-md hover:bg-primary-200 active:bg-primary-300 active:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-opacity-50'>
                                        {t('Add')}
                                    </button>
                                </td>
                            </tr>
                        )) : defaultdata.map((item, index) => (
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