import React, { useEffect, useMemo, useState } from 'react';
import numberWithCommas from '../custom_components/NumberWithCommas';
import { useTranslation } from 'react-i18next';
import { IDToCategory } from '../../context/CategoryDataProvider';
import { useCart } from './CartContextProvier';
import axios from 'axios';

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

const ProductCard = ({ data, searchtext = '', sortby = 'name', selectedProduct, setSelectProduct, selectedCategory = "All" }) => {
    const { t } = useTranslation();

    const { addToCart, removeFromCart, clearCart, cart, SSI } = useCart();


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

    useEffect(() => {
        if(filterData)setSelectProduct(filterData[selectedRow])
    }, [selectedRow, searchtext, cart])

    const defaultdata = generateRandomData(10);
    return (
        <div className={`w-full overflow-auto my-2`} style={{
            height: "calc(100vh - 200px)"
        }}>
            <div className='w-full h-full grid grid-cols-5 gap-4'>
                {/* CardView with Image  */}
                {data ? filterData.map((item, index) => (

                    <div key={item.id} className={`w-full h-[220px] rounded-lg shadow-lg flex flex-col justify-between items-center select-none hover:bg-blue-500 hover:text-white  text-black cursor-pointer`} tabIndex={0} onKeyDown={(e) => handleKeyDown(e, index)} onClick={() => addToCart(item, SSI)}>
                        <div className='w-full h-full flex flex-col'>
                            <div className='w-full h-full flex'>
                                <img src={item?.pic ? axios.defaults.baseURL + item.pic : "https://www.pngitem.com/pimgs/m/27-272007_transparent-product-icon-png-product-vector-icon-png.png"}
                                    alt=""  style={{
                                        width:'100%',
                                        height:150,
                                        objectFit:'contain'
                                    }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://www.pngitem.com/pimgs/m/27-272007_transparent-product-icon-png-product-vector-icon-png.png" }}
/>
                            </div>
                                <div className='w-full flex flex-col justify-center items-center'>
                                    <h1 className='text-md font-bold'>{item.name}</h1>
                                    <h1 className='text-md font-mono'>{numberWithCommas(item.price)} Ks</h1>
                                </div>
                        </div>
                    </div>
                )) : defaultdata.map((item, index) => (
                    <div key={item.id} className={`w-full h-48 rounded-lg shadow-lg flex flex-col justify-between items-center p-2 ${selectedRow === index ? 'bg-blue-500 text-white' : 'bg-white text-black'} `} tabIndex={0} onKeyDown={(e) => handleKeyDown(e, index)} onClick={() => addToCart(item, SSI)}>
                        <div className='w-full h-full flex flex-col justify-between items-center'>
                            <div className='w-full h-2/3 flex justify-center items-center'>
                                <img src={item.image} alt="" className='w-full h-full object-contain' />
                            </div>
                            <div className='w-full h-1/3 flex flex-col justify-center items-center'>
                                <h1 className='text-xl font-bold'>{item.name}</h1>
                                <h1 className='text-xl font-bold'>{numberWithCommas(item.price)}</h1>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default ProductCard;