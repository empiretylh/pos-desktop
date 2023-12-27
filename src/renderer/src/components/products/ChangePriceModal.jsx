import React, { useState } from 'react'
import axios from 'axios';
import { useAlertShow } from '../custom_components/AlertProvider';
import { useProductsData } from '../../context/ProductsDataProvider';
import { useMutation } from 'react-query';
import { changePrice } from '../../server/api';


const ChangePriceModal = ({ show, setShow }) => {

    const { showNoti, showInfo } = useAlertShow();
    const { product_data, data } = useProductsData();
    const [changePriceValue, setChangePriceValue] = useState(0);


    const updatePrice = useMutation(changePrice, {
        onSuccess: () => {
            product_data.refetch();
            setShow(false);
            showNoti("Successfully Updated Products' Price")
            setChangePriceValue(0);
        },
        onError: () => {
            showNoti("Failed to Update Price", 'bi bi-x-circle-fill text-red-500')
            setShow(false);
            setChangePriceValue(0);

        }

    })


    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setShow(false);
        }
    })





    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${show ? 'scale-100' : ''}`}>
            <div className="bg-white rounded-lg w-[200]">
                <div className="flex justify-between items-center p-2">
                    <h1 className="text-xl font-bold">Change Price (%)</h1>
                    <button className="text-red-500 p-3" onClick={() => setShow(false)}>X</button>
                </div>
                <div className="h-full p-2">
                    <div className="flex flex-row items-center">
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter Percentage"
                            min={0}
                            max={100}
                            required
                            value={changePriceValue+''}
                            onChange={(e) => {
                                setChangePriceValue(e.target.value)
                            }}
                        />
                        <span>%</span>
                    </div>

                    <div className="p-2 flex flex-row">

                        <button
                            onClick={() => {
                                if (changePriceValue === 0) {
                                    return showInfo("", 'Please Enter Perctange')
                                }
                                updatePrice.mutate({
                                    plus_perctange: changePriceValue
                                })
                            }}
                            className="bg-blue-700 hover:bg-blue-800 w-full mr-2 text-white p-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
                        >
                            <i className="bi bi-plus"></i>
                            <span>Price</span>
                        </button>
                        <button
                            onClick={() => {
                                if (changePriceValue === 0) {
                                    return showInfo("", 'Please Enter Perctange')
                                }
                                updatePrice.mutate({
                                    minus_perctange: changePriceValue
                                })
                            }}
                            className="bg-red-700 hover:bg-red-800 w-full text-white p-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
                        >
                            <i className="bi bi-dash"></i>
                            <span>Price</span>
                        </button>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default ChangePriceModal;