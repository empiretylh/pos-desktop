import React, { useState, useContext, useRef, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CustomerChoice from './CustomerChoiceModal';
import { useCart } from './CartContextProvier';
import numberWithCommas from '../custom_components/NumberWithCommas';
import { postSales } from '../../server/api';
import { useMutation } from 'react-query';
import { useCustomerData } from '../../context/CustomerProvider';
import { useAlertShow } from '../custom_components/AlertProvider';
import { useProductsData } from '../../context/ProductsDataProvider';
import Loading from '../custom_components/Loading';
import { useSetting } from '../../context/SettingContextProvider';
import VoucherView from '../custom_components/VoucherView';


const SalesForm = () => {
    const { t } = useTranslation();

    const salesForm = useRef(null);
    const inputRef = useRef(null);

    const { settings } = useSetting();

    const [loading, setLoading] = useState(false);

    const [customername, setCustomername] = useState('');
    const [customershow, setCustomerShow] = useState(false);

    const { cart, plusQty, minusQty, editQty, priceEdit, total, setCart } = useCart();
    const { data: customerdata, customer_data } = useCustomerData();
    const { product_data } = useProductsData();
    const { showInfo, showNoti } = useAlertShow();


    const [isEditing, setIsEditing] = useState(false);
    const [tax, setTax] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [delivery, setDelivery] = useState(0);
    const [payment_amount, setPayment_amount] = useState(0);
    const [description, setDescription] = useState('');
    const [showDescription, setShowDescription] = useState(false);
    const [isSaveCustomer, setIsSaveCustomer] = useState(false);

    const [print, setPrint] = useState(false);
    const [printData, setPrintData] = useState(null);
    
    let IsPrint = false;

    useEffect(() => {
        if (customername) {
            const isCustomer = customerdata?.find(item => item.name == customername)
            console.log(isCustomer)
            if (isCustomer?.name) {
                setIsSaveCustomer(true)
            } else {
                setIsSaveCustomer(false)
            }

        }
    }, [customerdata, customername])




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
        if (settings?.discount == 'percent') {
            grandTotal -= (total * discount) / 100;
        } else {
            grandTotal -= discount;
        }
        grandTotal += parseInt(delivery);

        // decimal fixed to 2
        grandTotal = parseFloat(grandTotal).toFixed(2);

        return grandTotal

    }, [tax, discount, delivery, total, settings?.discount]);


    const CreateReceipt = useMutation(postSales, {
        onMutate: () => {
            console.log('onMutate')
            setLoading(true);
        },
        onSuccess: (data) => {
            console.log('onSuccess')
            console.log(data)
            setPrintData(data.data); 

            if(IsPrint){
                setPrint(true);
                console.log('Is print true');
                IsPrint = false;
            }
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
            showNoti(t('RSC'), 'bi bi-check-circle text-green-500')
            product_data.refetch();
        },
        onError: (error) => {
            console.log('onError')
            console.log(error)
            setLoading(false);
            showNoti('Error', 'bi bi-x-circle text-red-500')
        },

    })

    const onSubmit = (e) => {
        e.preventDefault();

        // if user press eneter on Submit Normal Form
        //  if user press cltrl enter on Submit Print Form

        if (cart.length < 1)
            return showInfo("", "Please Select Items")


        let products = cart.map(item => {
            return {
                name: item.id,
                qty: item.qty,
                price: item.price,
                pdname: item.name,
            }
        });


        let data = {
            customerName: customername,
            products: JSON.stringify(products),
            totalAmount: total,
            grandtotal: computeGrandTotal,

        }

        if (customername == '') {
            data.customerName = "Unknown"
        }

        if (tax && tax !== '0') {
            data.tax = tax;
        } else {
            data.tax = 0;
        }

        if (discount && discount !== '0') {
            data.discount = discount
        } else {
            data.discount = 0
        }

        if (delivery && delivery !== '0') {
            data.deliveryCharges = delivery
        } else {
            data.deliveryCharges = 0
        }

        if (isSaveCustomer) {
            data.isSaveCustomer = true
            data.payment_amount = payment_amount
        }

        if (description && description !== '') {
            data.description = description;
        } else {
            data.description = ''
        }

        if (settings?.discount == 'amount') {
            data.isDiscountAmount = true
          }

        console.log(data)

        CreateReceipt.mutate(data)

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



    return (
        <div>
            <Loading show={loading} />
            <form
            onKeyDown={(e)=>{
                if(e.ctrlKey && e.key == 'Enter'){
                    IsPrint = true;
                    onSubmit(e)
                }else if(e.altKey && e.key == 'Enter'){
                    IsPrint = true;
                    onSubmit(e)
                }
                
                else if(e.key == 'Enter'){
                    console.log("without Printer")
                    IsPrint = false;
                    onSubmit(e);
                }
            }
            }
             ref={salesForm} className="flex flex-col overflow-x-hidden overflow-y-auto" >

                <label className="text-sm text-black font-bold mt-1">{t('Customer_Name')}</label>
                <div className="flex flex-row items-center">
                    <input
                        value={customername}
                        onChange={e => setCustomername(e.target.value)}
                        ref={inputRef} type="text"
                        className="border border-gray-300 rounded-md w-full p-2  my-1"
                        placeholder={t('Customer_Name')} id="name" />

                    <button
                        type="button"
                        onClick={() => setCustomerShow(true)}
                        className='bg-primary text-white rounded-md p-2 ml-2'>

                        <i className="bi bi-person text-xl"></i>
                    </button>
                </div>
                {/* {CheckBox} */}
                <div className="flex flex-row items-center">
                    <input
                        type="checkbox"
                        checked={isSaveCustomer}
                        onChange={e => setIsSaveCustomer(e.target.checked)}
                        className="border border-gray-300 rounded-md p-2  ml-auto my-1"
                        id="savecustomer" />
                    <label htmlFor='savecustomer' className="text-sm text-black font-bold ml-2">{t('savecustomer')}</label>

                </div>
                <div className={`flex flex-col mt-3`}>
                    <div className='w-full flex flex-row'>
                        <h1 className="text-md font-bold">Cart Lists</h1>
                        <label className="text-sm text-black font-bold ml-auto"> {cart?.length}{' '}{t('item')}</label>
                    </div>
                    <div className="overflow-y-auto max-h-[280px] mt-2 flex flex-col-reverse" tabIndex={-1}>
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
                        <div className='flex flex-col'>
                            {/* Tax %, Discount %, Delivery Charges */}
                            <div className="flex flex-row w-full">
                                <div className="flex flex-col w-1/2">
                                    <label className="text-sm text-black font-bold mt-3">Tax %</label>
                                    <input
                                        type="number"
                                        className="border border-gray-300 rounded-md  p-2  my-1 text-center"
                                        placeholder="0"
                                        value={tax + ''}
                                        onFocus={e => e.target.select()}
                                        onChange={e => setTax(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="text-sm utext-black font-bold mt-3 ml-2">{settings?.discount == 'percent' ? 'Discount %' : 'Discount (amount)'}</label>
                                    <input
                                        type="number"
                                        className="border border-gray-300 rounded-md p-2  my-1 text-center ml-2"
                                        placeholder="0"
                                        value={discount + ''}
                                        onFocus={e => e.target.select()}
                                        onChange={e => setDiscount(e.target.value)}
                                    />
                                </div>
                            </div>


                        </div>
                        <label className="text-sm text-black font-bold mt-3">Delivery Charges</label>
                        <input
                            type="number"
                            className="border border-gray-300 rounded-md w-full p-2  my-1 "
                            placeholder="0"
                            value={delivery + ''}
                            onFocus={e => e.target.select()}
                            onChange={e => setDelivery(e.target.value)}
                        />

                        <div
                            className="flex flex-row justify-between bg-yellow-300 text-black p-1 mt-2">
                            <h1 className="text-xl font-bold">Grand Total</h1>
                            <h1 className="text-xl font-bold">{numberWithCommas(computeGrandTotal)} Ks</h1>
                        </div>

                        {isSaveCustomer ?
                            <div className="flex flex-col">
                                <label className="text-sm text-black font-bold mt-3">Payment Amount</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded-md w-full p-2  my-1 "
                                    placeholder="0"
                                    value={payment_amount + ''}
                                    onFocus={e => e.target.select()}
                                    onChange={e => setPayment_amount(e.target.value)}
                                />
                            </div>
                            : null}

                        <details className="mt-1" open={showDescription} >
                            <summary className="font-bold mb-2 cursor-pointer select-none" onClick={e => setDescription(prev => !prev)}>Description</summary>
                            <textarea
                                className="border border-gray-300 rounded-md w-full p-2  my-1 "
                                placeholder="Description"
                                onChange={e => setDescription(e.target.value)}
                            />
                        </details>

                        {/* Create Receipt Button */}
                        <VoucherView print={print} setPrint={setPrint} data={printData} />
                        <button
                            type="submit"
                            onClick={onSubmit}
                            className="bg-primary text-white rounded-md p-2 mt-2 w-full">
                            <i className="bi bi-receipt text-md select-none cursor-pointer"></i>{' '}
                            <label className="text-md font-mono select-none cursor-pointer">Create Receipt</label>
                        </button>
                        <button
                            type="submit"
                            onClick={(e)=>{
                                onSubmit(e)
                                IsPrint = true;
                            
                            }}
                            className="bg-primary text-white rounded-md p-2 mt-2 w-full cursor-pointer">
                            <i className="bi bi-printer text-md select-none cursor-pointer"></i>{' '}
                            <label className="text-md font-mono select-none cursor-pointer">Create & Print Receipt</label>
                        </button>

                    </div>
                </div>

            </form >
            <CustomerChoice show={customershow} setShow={setCustomerShow} customer={customername} setCustomer={setCustomername} />
        </div >
    )
}

export default SalesForm;