import React, { useEffect, useMemo, useRef, useState } from 'react';
import numberWithCommas from '../custom_components/NumberWithCommas';
import { useTranslation } from 'react-i18next';
import { IDToCategory } from '../../context/CategoryDataProvider';
import { useCartTemp } from './CartContextTempProvier';
import { useProductsData } from '../../context/ProductsDataProvider';

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

const ProductTableModal = ({ show, setShow, sortby = 'name', selectedProduct, setSelectProduct, selectedCategory = "All" }) => {
    const { t } = useTranslation();

    const { addToCartNew, removeFromCart, clearCart, cart } = useCartTemp();


    const [selectedRow, setSelectedRow] = useState(0);

    const [searchtext, setSearchtext] = useState('');

    const { product_data, data } = useProductsData();



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
                addToCartNew(filterData[selectedRow])
                break;
            default:
                break;
        }
    };

    const searchref = useRef(null);

    useEffect(() => {
        if (show) {
            searchref.current.focus();
        }
    }, [show])

    useEffect(() => {
        setSelectProduct(filterData[selectedRow])
    }, [selectedRow, searchtext, cart])

    // press esc to close modal

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                setShow(false);
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [setShow]);
    const defaultdata = generateRandomData(10);
    return (
        <div style={{
            zIndex: 1000
        }} className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${show ? 'scale-100' : ''}`}>
            <div className="bg-white rounded-lg w-1/2 p-2 shadow-lg">
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl font-bold'>{t('Product List')}</h1>
                    {/* close btn */}
                    <button onClick={() => setShow(false)} className='px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50'>
                        X
                    </button>
                </div>
                {/* search bar */}
                <div className='w-full flex justify-between items-center my-2'>
                    <input
                        value={searchtext}
                        ref={searchref}
                        onChange={(e) => setSearchtext(e.target.value)}
                        onKeyDown={(e) => {
                            // if enter add product to cart
                            if (e.key === 'Enter') {
                                addToCartNew(filterData[selectedRow])
                                setSearchtext('')
                            }
                        }}
                        className='w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-opacity-50'
                        type="text"
                        placeholder={t('Search')}
                    />
                </div>

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
                                        onDoubleClick={(event) => addToCartNew(item)}
                                        onMouseOver={() => setSelectedRow(index)}
                                        key={index}
                                        tabIndex={0}
                                        className={`cursor-pointer hover:bg-slate-100 active:bg-primary active:text-white select-none outline-none ${index === selectedRow ? 'border-2 border-cyan-500' : ''}`}
                                    >      <td className='border px-2 py-1 text-center'>{index + 1}</td>
                                        <td className='border px-2 py-1'>{item.name}</td>

                                        <td className='border px-2 py-1 text-center'>{item.qty}</td>
                                        <td className='border px-2 py-1 text-right'>{numberWithCommas(item.price)}</td>

                                        <td className='border px-2 py-1 text-center'>
                                            <button onClick={() => addToCartNew(item)} className=' w-full px-2 py-1 bg-primary text-white rounded-md hover:bg-primary-200 active:bg-primary-300 active:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-opacity-50'>
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
            </div>
        </div>
    );
}

export default ProductTableModal;