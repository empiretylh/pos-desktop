import React, { useState, useContext, useRef, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import numberWithCommas from '../custom_components/NumberWithCommas';
import { deleteSales, postSales, putSales } from '../../server/api';
import { useMutation } from 'react-query';
import { useCustomerData } from '../../context/CustomerProvider';
import { useAlertShow } from '../custom_components/AlertProvider';
import { useProductsData } from '../../context/ProductsDataProvider';
import Loading from '../custom_components/Loading';
import { useCartTemp } from './CartContextTempProvier';
import ProductTableModal from './ProductTableModal';
import VoucherView from '../custom_components/VoucherView';
import CustomVoucher from '../custom_components/CustomVoucherView';
import { useSetting } from '../../context/SettingContextProvider';


const SalesForm = ({ defaultname = 'Unknown', salesid, sales_data, setSelectedRow, selectedRow }) => {
    const { t } = useTranslation();

    const salesForm = useRef(null);
    const inputRef = useRef(null);

    const {settings} = useSetting();


    const [loading, setLoading] = useState(false);
    const [print, setPrint] = useState(false);

    const [customername, setCustomername] = useState(defaultname || 'Unknown');
    const [customershow, setCustomerShow] = useState(false);

    const [showpdtable, setShowpdtable] = useState(false);

    const { cart, plusQty, minusQty, editQty, priceEdit, total, setCart } = useCartTemp();
    const { data: customerdata, customer_data } = useCustomerData();
    const { product_data } = useProductsData();
    const { showInfo, showNoti, showConfirm } = useAlertShow();


    const [isEditing, setIsEditing] = useState(false);
    const [tax, setTax] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [delivery, setDelivery] = useState(0);
    const [payment_amount, setPayment_amount] = useState(0);
    const [description, setDescription] = useState('');
    const [showDescription, setShowDescription] = useState(false);
    const [isSaveCustomer, setIsSaveCustomer] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        setCustomername(defaultname)
        console.log(defaultname);
    }, [defaultname, cart])




    const computeGrandTotal = useMemo(() => {
        // tax and discount is %
        // delivery is fixed amount
        // total is sum of all product total

        // tax discount and delivery is Nan or null or undefined make 0

        if (isNaN(tax) || tax === null || tax === undefined || tax === '') {
            setTax(0);
        }

        if (isNaN(discount) || discount === null || discount === undefined || discount === '') {
            setDiscount(0);
        }

        if (isNaN(delivery) || delivery === null || delivery === undefined || delivery === '') {
            setDelivery(0);
        }
        console.log(delivery)

        let grandTotal = total;
        grandTotal += (total * tax) / 100;
        grandTotal -= (total * discount) / 100;
        grandTotal += parseInt(delivery);

        // decimal fixed to 2
        grandTotal = parseFloat(grandTotal).toFixed(2);

        return grandTotal

    }, [tax, discount, delivery, total]);


    const UpdateReceipt = useMutation(putSales, {
        onMutate: () => {
            console.log('onMutate')
            setLoading(true);
        },
        onSuccess: (data) => {
            console.log('onSuccess')
            console.log(data)
            setLoading(false);
            setCart([])
            setCustomername('')
            setTax(0)
            setDescription('')
            setDiscount(0)
            setDelivery(0)
            setPayment_amount(0)
            setIsSaveCustomer(false);
            customer_data.refetch();
            product_data.refetch();
            sales_data.refetch();
            setSelectedRow(null);
            setCustomername('')

            showNoti(t('RSC'), 'bi bi-check-circle text-green-500')



        },
        onError: (error) => {
            console.log('onError')
            console.log(error)
            setLoading(false);
            showNoti('Error', 'bi bi-x-circle text-red-500')
        },

    })

    const deleteReceipt = useMutation(deleteSales, {
        onMutate: () => {
            console.log('onMutate')
            setLoading(true);

        },
        onSuccess: (data) => {
            console.log('onSuccess')
            console.log(data)
            setLoading(false);
            setCart([])
            setCustomername('')
            setTax(0)
            setDescription('')
            setDiscount(0)
            setDelivery(0)
            setPayment_amount(0)
            setIsSaveCustomer(false);
            customer_data.refetch();
            product_data.refetch();
            sales_data.refetch();
            setSelectedRow(null);
            setCustomername('')

            showNoti(t('Successfully Deleted Voucher'), 'bi bi-check-circle text-green-500')
        },
        onError: (error) => {
            console.log('onError')
            console.log(error)
            setLoading(false);
            showNoti('Error', 'bi bi-x-circle text-red-500')
        }
    })
    const onSubmit = (e) => {
        e.preventDefault();
        if (cart.length < 1)
            return showInfo("", "Please Select Items")





        let products = cart.filter(i => !i.isNew).map(item => {
            return {
                id: item.id,
                name: item.id,
                qty: item.qty,
                price: item.price,
                pdname: item.name,
            }
        });

        let newproducts = cart.filter(i => i.isNew).map(item => {
            return {
                name: item.id,
                qty: item.qty,
                price: item.price,
                pdname: item.name,
            }

        })



        let data = {
            id: salesid,
            customerName: customername,
            products: products,
            newproducts: newproducts,

        }

        UpdateReceipt.mutate(data)

        setCart([])
        setCustomername('')
        setTax(0)
        setDescription('')
        setDiscount(0)
        setDelivery(0)
        setPayment_amount(0)
        setIsSaveCustomer(false);
        customer_data.refetch();
        product_data.refetch();

    }

    // press alt + c to focus on customer name input

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.altKey && e.key === 'c') {
                inputRef.current.focus();
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }
        , [inputRef])

    const scrollref = useRef(null);
    // if cart data is length is change scroll to top
    useEffect(() => {
        scrollref.current.scrollTop = 0;
    }, [cart])
    
    // if user press alt enter or ctrl enter setprint to true
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.altKey || e.ctrlKey) && e.key === 'Enter') {
                setPrint(true);
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }
        , [print]);


    return (
        <div>
            <Loading show={loading} />
            <form ref={salesForm} className="flex flex-col overflow-x-hidden overflow-y-auto" onSubmit={onSubmit} >

                <label className="text-sm text-black font-bold mt-1">{t('Customer_Name')}</label>
                <div className="flex flex-row items-center">
                    <input
                        value={customername}
                        onChange={e => setCustomername(e.target.value)}
                        ref={inputRef} type="text"
                        className="border border-gray-300 rounded-md w-full p-2  my-1"
                        placeholder={t('Customer_Name')} id="name" />

                    {/* <button
                        type="button"
                        onClick={() => setCustomerShow(true)}
                        className='bg-primary text-white rounded-md p-2 ml-2'>

                        <i className="bi bi-person text-xl"></i>
                    </button> */}
                </div>
                {/* {CheckBox} */}
                {/* <div className="flex flex-row items-center">
                    <input
                        type="checkbox"
                        checked={isSaveCustomer}
                        onChange={e => setIsSaveCustomer(e.target.checked)}
                        className="border border-gray-300 rounded-md p-2  ml-auto my-1"
                        id="savecustomer" />
                    <label htmlFor='savecustomer' className="text-sm text-black font-bold ml-2">{t('savecustomer')}</label>

                </div> */}
                <div className={`flex flex-col mt-3`}>
                    <div className='w-full flex flex-row items-center'>
                        <h1 className="text-md font-bold">Cart Lists</h1>
                        <label className="text-sm text-black font-bold ml-auto"> {cart?.length}{' '}{t('item')}</label>
                        {/* Add Product btn */}
                        <button
                            type="button"
                            onClick={() => setShowpdtable(true)}
                            className='bg-primary text-white rounded-md p-2 ml-2'>
                            <i className="bi bi-plus text-xl"></i>
                            Add Products
                        </button>
                    </div>
                    <div className="overflow-y-auto max-h-[280px] mt-2 flex flex-col-reverse" tabIndex={-1} ref={scrollref}>
                        {cart?.map((item) => {
                            return (
                                <div key={item.id} className="flex flex-row justify-between mt-2 bg-slate-200 p-2 rounded">
                                    <div className="flex flex-col">
                                        <label className='font-bold '>{item.name}</label>
                                        <div className="flex flex-row items-center ">
                                            {isEditing ?
                                                <div className="flex flex-row items-center">
                                                    <input
                                                        type="number"
                                                        value={item.price}
                                                        className="border border-gray-300 rounded-md p-1  my-1 text-center w-[150px]"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                setIsEditing(false)
                                                            }
                                                        }
                                                        }

                                                        onChange={e => {

                                                            priceEdit(item, e.target.value)
                                                        }}
                                                        onFocus={e => e.target.select()}

                                                    />
                                                    <i className="bi bi-check-circle text-xl ml-2 cursor-pointer" onClick={() => setIsEditing(false)}></i>

                                                </div>
                                                :
                                                <>
                                                    <label className="font-mono text-primary">{numberWithCommas(item.price)} Ks</label>
                                                    <i className="bi bi-pencil-square text-xl ml-2 cursor-pointer" onClick={() => setIsEditing(true)}></i>
                                                </>
                                            }
                                        </div>

                                    </div>
                                    <div
                                        className="flex flex-row">
                                        <button
                                            tabIndex={-1}
                                            type="button"
                                            onClick={() => minusQty(item)}
                                            className="bg-red-500 text-white rounded-md p-2 ml-2 mr-2">
                                            <i className="bi bi-dash-lg text-xl"></i>
                                        </button>
                                        <input
                                            tabIndex={-1}
                                            type="number"
                                            value={item.qty}
                                            className="border border-gray-300 rounded-md w-16 p-2  my-1 text-center"
                                            onChange={e => {
                                                editQty(item, e.target.value)
                                            }}
                                            onFocus={e => e.target.select()}
                                        />

                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            onClick={() => plusQty(item)}
                                            className="bg-primary text-white rounded-md p-2 ml-2">
                                            <i className="bi bi-plus-lg text-xl"></i>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="border p-2">
                        <div className='flex items-center justify-between bg-slate-200 text-black p-1'>
                            <h1 className="text-xl font-bold">Total Amount</h1>
                            <h1 className="text-xl font-bold">{numberWithCommas(total)} Ks</h1>

                        </div>

                        {/* 
                        <div
                            className="flex flex-row justify-between bg-yellow-300 text-black p-1 mt-2">
                            <h1 className="text-xl font-bold">Grand Total</h1>
                            <h1 className="text-xl font-bold">{numberWithCommas(computeGrandTotal)} Ks</h1>
                        </div> */}



                        {/* Create Receipt Button */}
                        <button
                            type="submit"
                            onClick={onSubmit}
                            className="bg-primary text-white rounded-md p-2 mt-2 w-full">
                            <i className="bi bi-receipt text-md select-none cursor-pointer"></i>{' '}
                            <label className="text-md font-mono select-none cursor-pointer">Update Receipt</label>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                showConfirm('Delete Receipt','Are you sure to delete this receipt?', () => {
                                    deleteReceipt.mutate({
                                        id: salesid
                                    })
                                })
                            }}
                            className="bg-red-500 text-white rounded-md p-2 mt-2 w-full">
                            <i className="bi bi-trash text-md select-none cursor-pointer"></i>{' '}
                            <label className="text-md font-mono select-none cursor-pointer">Delete Receipt</label>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                               setPrint(true)
                            }}
                            className="bg-green-500 text-white rounded-md p-2 mt-2 w-full">
                            <i className="bi bi-printer text-md select-none cursor-pointer"></i>{' '}
                            <label className="text-md font-mono select-none cursor-pointer">Print Receipt</label>
                        </button>

                    </div>
                </div>

            </form >
            {settings.enableCustomVoucher && (settings?.paper == 'A4' || settings?.paper == 'A5') ?
                        <CustomVoucher print={print} setPrint={setPrint} data={selectedRow} />

                        :   <VoucherView print={print} setPrint={setPrint} data={selectedRow} />}
            <ProductTableModal show={showpdtable} setShow={setShowpdtable} setSelectProduct={setSelectedProduct} selectedProduct={selectedProduct} />
        </div >
    )
}

export default SalesForm;