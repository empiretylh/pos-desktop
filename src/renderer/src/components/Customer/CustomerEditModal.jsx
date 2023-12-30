import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios';
import { useAlertShow } from '../custom_components/AlertProvider';
import { useProductsData } from '../../context/ProductsDataProvider';
import { useMutation } from 'react-query';
import { changePrice, postCustomer, putCustomer } from '../../server/api';
import { useCustomerData } from '../../context/CustomerProvider';


const CustomerEditModal = ({ show, setShow, oldcustomer }) => {

    const { showNoti, showInfo } = useAlertShow();

    const { customer_data, data } = useCustomerData();

    const UpdateCustomer =  useMutation(putCustomer,{
        onSuccess: () => {
            customer_data.refetch();
            setShow(false);
            showNoti("Successfully Updated Customer")
        },
        onError: () => {
            showNoti("Failed to Update Customer", 'bi bi-x-circle-fill text-red-500')
            setShow(false);
        }
    
    })

    const [newCustomer, setNewCustomer] = useState({ name: oldcustomer?.name, description: oldcustomer?.description });
    const inputRef = useRef(null);
    const handleInputChange = (event) => {
        setNewCustomer({ ...newCustomer, [event.target.name]: event.target.value });
    };


    useEffect(()=>{
        setNewCustomer({ name: oldcustomer?.name, description: oldcustomer?.description })
        if(show){
            inputRef.current.focus();
        }
    },[show])



    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setShow(false);
        }
    })

    const handleSubmit = (e) => {
       e.preventDefault();
         UpdateCustomer.mutate({
            id : oldcustomer?.id,
            name : newCustomer?.name,
            description : newCustomer?.description
         });        
    }





    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${show ? 'scale-100' : ''}`}>
            <div className="bg-white rounded-lg w-1/2">
                <div className="flex justify-between items-center p-2">
                    <div className='flex flex-row items-center'>
                        <i className='bi bi-person-circle text-2xl mr-2'></i>
                        <h1 className="text-xl font-bold">Edit Customer</h1>
                    </div>
                    <button className="text-red-500 p-3" onClick={() => setShow(false)}>X</button>
                </div>
                <div className="h-full p-2">
                        <div>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    ref={inputRef}
                                    value={newCustomer.name}
                                    onChange={handleInputChange}
                                    placeholder="Name"
                                    className="border border-gray-200 rounded-lg p-2 mb-2 w-full"
                                    required    
                                />
                                <textarea
                                    type="text"
                                    name="description"
                                    value={newCustomer.description}
                                    onChange={handleInputChange}
                                    placeholder="Description"
                                    
                                    className="border border-gray-200 rounded-lg p-2 mb-2 w-full"
                                 
                                />
                                <button type="submit" className="bg-green-800 text-white rounded-lg p-2 w-full">
                                    Update
                                </button>
                            </form>
                        </div>

                </div>
            </div>
        </div>
    )
}

export default CustomerEditModal;