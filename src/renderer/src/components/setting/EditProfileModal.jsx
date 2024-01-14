import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios';
import { useAlertShow } from '../custom_components/AlertProvider';
import { LessThanProduct, getBeforeExpireProduct, useProductsData } from '../../context/ProductsDataProvider';
import { useMutation, useQuery } from 'react-query';
import { changePrice, getSales, postCustomer, profileupdate, putCustomer, putProducts, putSupplier } from '../../server/api';
import { useCustomerData } from '../../context/CustomerProvider';
import numberWithCommas from '../custom_components/NumberWithCommas';
import { useSupplierData } from '../../context/SupplierProvider';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContextProvider';

const EditProfileModal = ({ show, setShow, data, customerid }) => {

    const { showNoti, showInfo } = useAlertShow();
    const {user_data} = useAuth();
    const inputRef = useRef();

    const [oldData, setOldData] = useState(data);

    const putProfile = useMutation(profileupdate,{
        onSuccess: (data)=>{
            showNoti('Profile Updated Successfully');
            user_data.refetch();
            setShow(false);

        },
        onError: (error)=>{
            showNoti('Something went wrong', 'bi bi-exclamation-triangle');
            setShow(false);
        }
    })

    useEffect(()=>{
        setOldData(data);
        if(show){
            inputRef.current.focus();
        }
    },[data, show])


    const [searchtext, setSearchtext] = useState('');


    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {

            setShow(false);

        }
    })


    const onInputChange = (e) => {
        setOldData({ ...oldData, [e.target.name]: e.target.value });
    }

    const onSubmit = (e)=>{
        e.preventDefault();
        putProfile.mutate(oldData);
        setShow(false)
    }



    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${show ? 'scale-100' : ''}`}>
            <div className="bg-white rounded-lg w-1/2">
                <div className="flex justify-between items-center p-2">
                    <div className='flex flex-row items-center'>
                        <i className='bi bi-pencil text-2xl mr-2'></i>
                        <h1 className="text-xl font-bold">Edit Profile</h1>
                    </div>
                    <button className="text-red-500 p-3" onClick={() => setShow(false)}>X</button>
                </div>
                <div className="flex flex-col p-2">

                    <form className="flex flex-col" onSubmit={onSubmit}>
                        <label className="text-md font-bold">Shop Name</label>
                        <input required ref={inputRef} type="text" className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Shop Name" name="name" value={oldData?.name} onChange={onInputChange} />
                        <label className="text-md font-bold">Address</label>
                        <input required type="text" className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Address" name="address" value={oldData?.address} onChange={onInputChange} />
                        <label className="text-md font-bold">Phone</label>
                        <input required type="number" className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Phone" name="phoneno" value={oldData?.phoneno} onChange={onInputChange} />
                        <label className="text-md font-bold">Email</label>
                        <input required type="email" className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Email" name="email" value={oldData?.email} onChange={onInputChange} />

                        <button type="submit" className='bg-blue-500 text-white rounded-lg p-2 mt-2' >
                            <i className='bi bi-pencil-square mr-2'></i>
                            Edit
                        </button>
                    </form>
                </div>


            </div>

        </div>
    )
}

export default EditProfileModal;