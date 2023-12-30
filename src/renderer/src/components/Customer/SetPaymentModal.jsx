import React, { useMemo, useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { useAlertShow } from '../custom_components/AlertProvider';
import { useProductsData } from '../../context/ProductsDataProvider';
import { useMutation } from 'react-query';
import { changePrice, postCustomer, salesSetPayment } from '../../server/api';
import { useCustomerData } from '../../context/CustomerProvider';


const SetPaymentModal = ({ show, setShow, payment_data }) => {

    const { showNoti, showInfo } = useAlertShow();

    const { customer_data, data } = useCustomerData();
    const [price, setPrice] = useState(0);
    const paymentref = useRef(null);

    const SetPaymentToServer = useMutation(salesSetPayment, {
        onSuccess: () => {
            customer_data.refetch();
            setShow(false);
            showNoti("Successfully updated voucher")
            setPrice(0)
        },
        onError: () => {
            showNoti("Failed to update voucher", 'bi bi-x-circle-fill text-red-500')
            setShow(false);
        }

    })

    useEffect(()=>{
        if(show){
            paymentref.current.focus();
        }
    },[show])


    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setShow(false);
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        SetPaymentToServer.mutate({
            sale_id : parseInt(payment_data.receiptNumber, 10),
            customer_payment : price
        });
    }

    const shouldpaymentprice = useMemo(() => {
        if (payment_data) {
            let price = parseInt(payment_data.grandtotal) - parseInt(payment_data.customer_payment)
            return price;
        }
    }, [payment_data])




    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${show ? 'scale-100' : ''}`}>
            <div className="bg-white rounded-lg w-[350px]">
                <div className="flex justify-between items-center p-2">
                    <div className="flex-col">
                        <div className='flex flex-row items-center'>
                            <i className='bi bi-cash text-2xl mr-2'></i>
                            <h1 className="text-xl font-bold">Set Payment</h1>
                        </div>
                        <p>Customer ပေးသည့် amount ကိုရိုက်ထည့်ရန်</p>
                    </div>
                    <button className="text-red-500 p-3" onClick={() => setShow(false)}>X</button>
                </div>
                <div className="h-full p-2">
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-row items-center">
                                <input
                                    type="number"
                                    name="price"
                                    value={price}
                                    ref={paymentref}
                                    onChange={e => setPrice(e.target.value)}
                                    placeholder="Payment Amount"
                                    className="border border-gray-200 rounded-lg p-2 w-full"
                                    required
                                />
                                <button onClick={() => setPrice(shouldpaymentprice)} type="button" className="p-2 bg-red-600 text-white rounded ml-2">
                                    {shouldpaymentprice}
                                </button>
                                <button onClick={() => setPrice(shouldpaymentprice/2)} type="button" className="p-2 bg-red-500 text-white rounded ml-2">
                                    {shouldpaymentprice / 2}
                                </button>
                            </div>
                            <button type="submit" className="bg-primary hover:bg-blue-600 text-white rounded-lg p-2 w-full mt-2">
                                Set Payment
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SetPaymentModal;