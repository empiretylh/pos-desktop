import React from 'react';
import { useTranslation } from 'react-i18next';
import { productsByCategory } from '../../context/ProductsDataProvider';
import numberWithCommas from '../custom_components/NumberWithCommas';
import axios from 'axios';

const ProductsByCategoryView = ({ category_id }) => {
    const { t } = useTranslation();
    const products = productsByCategory(category_id);

    const PDITEM = ({ item, key }) => {
        //Card Product View with image (pic) and some data for product
        return (
            <div key={key} className='w-full flex flex-row bg-gray-100 p-2 my-2 rounded relative'>
                <div>
                    <img
                        src={item?.pic ? axios.defaults.baseURL + item.pic : "https://www.pngitem.com/pimgs/m/27-272007_transparent-product-icon-png-product-vector-icon-png.png"}
                        alt={item.name}
                        className='w-[120px] h-[100px] object-cover'
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://www.pngitem.com/pimgs/m/27-272007_transparent-product-icon-png-product-vector-icon-png.png" }}

                    />
                </div>
                <div className='w-full h-1/2 py-2 ml-2 relative'>
                    <h1 className="text-lg font-bold">{item.name}</h1>
                    <h1 className="text-lg">{numberWithCommas(item.price)} Ks</h1>
                </div>
                    <h2 className="text-sm p-2 bg-red-600 text-white rounded absolute right-1">{item.qty}</h2>
            </div>
        )
    }

    return (
        <div className='flex flex-col w-full'> 
            <div className='flex flex-row w-full items-center justify-between'>
                <h1 className="text-xl font-bold my-3">{t('RPDs')}</h1>
                <h1 classname="ml-auto  text-xl font-bold">{products.length + ' ' + t('item')}</h1>
            </div>

            <ul style={{
                height: 'calc(100vh - 370px)',
                overflowY: 'auto'
            }}>
                {products.map(item => (
                    <PDITEM item={item} key={item.id} />
                ))}
            </ul>
        </div>
    )
}

export default ProductsByCategoryView;