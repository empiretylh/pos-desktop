import react, { useState, useEffect, useTransition, useRef } from 'react';
import { useMutation } from 'react-query';
import { APPNAME } from '../../config/config';
import { IMAGE } from '../../config/image';
import TextInput from '../custom_components/TextInput';
import { login, postCategorys, postProducts, putProducts } from '../../server/api';
import { useAuth } from '../../context/AuthContextProvider';
const { ipcRenderer } = window.electron
import axios from 'axios';
import Navigation from '../custom_components/Navigation';
import Loading from '../custom_components/Loading';
import { useTranslation } from 'react-i18next';
import numberWithCommas from '../custom_components/NumberWithCommas';
import PieChart from './PieChart';
import TopMoneyTable from './TopMoneyTable';
import SaleChart from './SaleChart';
import ProductTable from './ProductTable';
import CustomButton from '../custom_components/CustomButton';
import { useProductsData } from '../../context/ProductsDataProvider';
import CategoryTable from './CategoryTable';
import { useCategoryData } from '../../context/CategoryDataProvider';

const Products = () => {

    const [showtype, setShowtype] = useState('today');

    const [loading, setLoading] = useState(false);

    const [selected, setSelected] = useState('Products');

    const [searchtext, setSearchtext] = useState('');
    const [sortby, setSortBy] = useState('none');

    const { t } = useTranslation();

    const { product_data, data } = useProductsData();
    const { category_data, data: category } = useCategoryData();

    const [selectedRow, setSelectedRow] = useState(null);

    const inputRef = useRef();
    const productform = useRef();

    const PostProduct = useMutation(postProducts, {
        onMutate: () => {
            setLoading(true);

        },
        onSuccess: () => {
            setLoading(false);
            product_data.refetch();
        },
        onError: () => {
            setLoading(false);

        }
    });

    const PostCategory = useMutation(postCategorys, {
        onMutate: () => {
            setLoading(true);

        },
        onSuccess: () => {
            setLoading(false);
            category_data.refetch();
        },
        onError: () => {
            setLoading(false);

        }

    })

    const PutProduct = useMutation(putProducts, {
        onMutate: () => {
            setLoading(true);
            clearProductForm();
        },
        onSuccess: () => {
            setLoading(false);
            product_data.refetch();
        },
        onError: () => {
            setLoading(false);

        }

    })

    const ProductSubmit = (e) => {
        e.preventDefault();

        //if selectedRow is not null putproduct else postproduct
        if (selectedRow?.id) {
            //selectedRow remove pic 
            delete selectedRow.pic;

            return PutProduct.mutate(selectedRow);
        }

        const form = e.target;

        let formData = {
            name: form.name.value,
            category: form.category.value,
            barcode: form.barcode.value,
            price: form.price.value,
            cost: form.cost.value,
            qty: form.qty.value,
            supplier_name: form.supplier.value,
            expiry_date: form.expire.value,
            description: form.description.value,
            pic: null,
        };

        let data = {};

        for (let key in formData) {
            if (formData[key] !== null && formData[key] !== '') {
                data[key] = formData[key];
            }
        }


        PostProduct.mutate(
            data
        );

        form.reset();
    }

    const CategorySubmit = (e) => {
        e.preventDefault();
        const form = e.target;

        let formData = {
            title: form.title.value,
        };

        let data = {};

        for (let key in formData) {
            if (formData[key] !== null && formData[key] !== '') {
                data[key] = formData[key];
            }
        }


        PostCategory.mutate(
            data
        );

        form.reset();
    }


    const productRowClick_Update = (item) => {
        productform.current.reset();
        setSelectedRow(item);
        inputRef.current.focus();
        //selectall text input
        inputRef.current.select();
    }

    const handleChange = (value, name) => {
        setSelectedRow({ ...selectedRow, [name]: value });
    }

    const clearProductForm = () => {
        setSelectedRow(null);
        productform.current.reset();
    }


    return (
        <div className='flex flex-row h-screen'>
            <Navigation />
            <Loading show={loading} />
            <div className="bg-white font-sans h-full w-full p-3 overflow-auto">
                <div className="flex flex-row items-center sticky bg-white " style={{
                    top: -10,
                }}>
                    <i className='bi bi-bag text-2xl mr-2'></i>
                    <h1 className='text-2xl font-bold'>{t('Products')}</h1>

                    <div className="flex flex-row w-full justify-center items-center">
                        <CustomButton
                            onClick={() => {
                                setSelected('Products');
                                inputRef.current.focus();
                            }}
                            text={t('Add_Product')} icon={'bi bi-bag-plus mr-3 text-2xl'} textcolor='text-white mr-3' />
                        <CustomButton
                            onClick={() => {
                                setSelected('Category')
                                inputRef.current.focus();
                            }}
                            text={t('Add_Category')} icon={'bi bi-bookmark-plus mr-3 text-2xl'} textcolor='text-white mr-3' />
                        <CustomButton text={t('Excel Export/Import')} icon={'bi bi-table mr-3 text-2xl'} textcolor='text-white mr-3' />
                        <CustomButton text={t('Change Price')} icon={'bi bi-percent mr-3 text-2xl'} textcolor='text-white mr-3' />
                    </div>
                    <h1 className='text-lg font-bold text-right' style={{ width: 180 }}>103000 MMK</h1>


                </div>

                {/*Search Bar */}
                <div className='grid grid-cols-3 gap-3 mt-3'>
                    <div className="col-span-1 border p-2">
                        {
                            selected == 'Products' ?
                                <form ref={productform} className="flex flex-col overflow-x-hidden overflow-y-auto" onSubmit={ProductSubmit} >
                                    <div className="flex flex-row">
                                        <label className="text-xl text-black font-bold ">{t('Products')}</label>

                                        {/* Clear icon */}
                                        <div onClick={clearProductForm} className="select-none ml-auto cursor-pointer bg-red-500 rounded-md px-2 text-white flex flex-row items-center">
                                            <i onClick={clearProductForm} className="bi bi-x text-2xl text-white cursor-pointer"></i>
                                            <label>Clear</label>
                                        </div>

                                    </div>
                                    <label className="text-sm text-black font-bold mt-3">{t('ProductName')}</label>
                                    <input value={selectedRow?.name} onChange={e => handleChange(e.target.value, e.target.id)} ref={inputRef} type="text" className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('ProductName')} required id="name" />

                                    <label className="text-sm text-black font-bold mt-1">{t('Barcode')}</label>
                                    <input value={selectedRow?.barcode} onChange={e => handleChange(e.target.value, e.target.id)} type="number" className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('Barcode')} id="barcode" />

                                    <label className="text-sm text-black font-bold mt-1">{t('Category')}</label>
                                    <select value={selectedRow?.category} onChange={e => handleChange(e.target.value, e.target.id)} className="border border-gray-300 rounded-md w-full p-2 mr-3 my-1" required id="category">
                                        {category.map((item, index) => (
                                            <option key={index} value={item.id}>{item.title}</option>
                                        ))}
                                    </select>

                                    {
                                        /* qty, price , cost , supplier name*/
                                    }
                                    <label className="text-sm text-black font-bold mt-1">{t('Quantity')}</label>
                                    <input value={selectedRow?.qty} onChange={e => handleChange(e.target.value, e.target.id)} type="number" className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('Quantity')} required id="qty" />

                                    <div className="flex space-x-4">
                                        <div className="flex-1">
                                            <label className="text-sm text-black font-bold mt-1">{t('Price4')}</label>
                                            <input value={selectedRow?.price} onChange={e => handleChange(e.target.value, e.target.id)} type="number" className="border border-gray-300 rounded-md w-full p-2 my-1" placeholder={t('Price4')} required id="price" />
                                        </div>

                                        <div className="flex-1">
                                            <label className="text-sm text-black font-bold mt-1">{t('Price5')}</label>
                                            <input value={selectedRow?.cost} onChange={e => handleChange(e.target.value, e.target.id)} type="number" className="border border-gray-300 rounded-md w-full p-2 my-1" placeholder={t('Price5')} required id="cost" />
                                        </div>
                                    </div>
                                    <label className="text-sm text-black font-bold mt-1">{t('Supplier_Name')}</label>
                                    <input type="text" value={selectedRow?.supplier} onChange={e => handleChange(e.target.value, e.target.id)} className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('Supplier_Name')} id="supplier" />

                                    {/*Expire Date */}
                                    <label className="text-sm text-black font-bold mt-1">{t('Expire_Date')}</label>
                                    <input type="date" value={selectedRow?.expiry_date} onChange={e => handleChange(e.target.value, "expiry_date")} className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('Expire_Date')} id="expire" />

                                    {/* Description */}
                                    <label className="text-sm text-black font-bold mt-1">{t('Description')}</label>
                                    <input type="text" value={selectedRow?.description == 'undefined' ? '' : selectedRow?.description} onChange={e => handleChange(e.target.value, e.target.id)} className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('Description')} id="description" />

                                    <button className={`${selectedRow?.id ? "bg-green-800" : "bg-primary"} text-white rounded-md w-full p-2 mr-3 mt-1`}>{t(selectedRow?.id ? "Edit_Product" : "Add_Product")}</button>
                                </form> :
                                <form onSubmit={CategorySubmit} className="flex flex-col overflow-x-hidden overflow-y-auto">

                                    <label className="text-sm text-black font-bold">{t('Category')}</label>
                                    <input id="title" type="text" ref={inputRef} className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('Category')} required />


                                    <button className="bg-primary text-white rounded-md w-full p-2 mr-3 mt-1">{t('Add_Category')}</button>
                                </form>
                        }

                    </div>
                    <div className="col-span-2 border p-2">
                        <div className="flex flex-row items-center mt-3 w-full">
                            <icon className="bi bi-search text-2xl text-gray-400 mr-2"></icon>
                            <input type="text" className="border border-gray-300 rounded-md w-full p-2 mr-3" placeholder={t('Search Products')} onChange={(e) => setSearchtext(e.target.value)} />
                        </div>

                        <div>
                            {/* 2 tab Sales and Category if selected fill color */}
                            <div className="flex flex-row items-center mt-3">
                                <button className={`border border-gray-300 ${selected == 'Products' ? "bg-primary text-white font-bold" : ''} rounded-md w-1/2 p-2 mr-3`}
                                    onClick={() => {
                                        setSelected("Products")
                                    }}
                                >{t('Products')}</button>
                                <button
                                    onClick={() => {
                                        setSelected("Category")
                                    }}
                                    className={`border border-gray-300 ${selected == 'Category' ? 'bg-primary text-white font-bold' : ''} rounded-md w-1/2 p-2 mr-3`}>{t('Category')}</button>
                                {/* Sort with select -option */}
                                <h1 className='mx-2 w-[100px]'>{t('Sort By :')}</h1>
                                <select
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-300 rounded-md w-[200px] p-2 mr-3">
                                    {
                                        selected == 'Products' ?
                                            <>
                                                <option value="name">{t('Name')}</option>
                                                <option value="price">{t('Price4')}</option>
                                                <option value="cost">{t('Price5')}</option>
                                                <option value="qty">{t('Quantity')}</option>
                                                <option value="expire">{t('Expire Date')}</option>
                                            </>
                                            :
                                            <>
                                                <option value="name">{t('Name')}</option>
                                                <option value="products">{t('Products')}</option>
                                            </>
                                    }


                                </select>

                            </div>

                        </div>

                        {/* Table */}
                        {selected == 'Products' ?
                            <ProductTable
                                data={data}
                                searchtext={searchtext}
                                sortby={sortby}
                                selectedRow={selectedRow}
                                setSelectedRow={setSelectedRow}
                                rowDoubleClick={productRowClick_Update} /> :
                            <CategoryTable data={category} searchtext={searchtext} sortby={sortby} />
                        }
                    </div>


                </div>

            </div>
        </div>
    )
}

export default Products;