import React, { useMemo, useState } from 'react'
import axios from 'axios';
import { useAlertShow } from '../custom_components/AlertProvider';
import { useProductsData } from '../../context/ProductsDataProvider';
import { useMutation } from 'react-query';
import { changePrice, postCustomer, postSupplier } from '../../server/api';
import { useCustomerData } from '../../context/CustomerProvider';
import { useSupplierData } from '../../context/SupplierProvider';


const AddSupplier = ({ show, setShow }) => {

    const { showNoti, showInfo } = useAlertShow();

    const {supplier_data, data} = useSupplierData();

    const CreateSupplier =  useMutation(postSupplier,{
        onSuccess: () => {
            supplier_data.refetch();
            setShow(false);
            showNoti("Successfully Added Supplier", "bi bi-check-circle-fill text-green-500")
        },
        onError: () => {
            showNoti("Failed to Add Customer", 'bi bi-x-circle-fill text-red-500')
            setShow(false);
        }
    
    })

    const [newSupplier, setNewSupplier] = useState({ supplierName: '', description: '' });
    const [searchtext, setSearchtext] = useState('');

    const filterSupplier = useMemo(() => {
        if (data) {
            return data.filter(sup => sup?.name.toLowerCase().includes(searchtext.toLowerCase()));
        } 
    }, [data, searchtext])

    const handleInputChange = (event) => {
        setNewSupplier({ ...newSupplier, [event.target.name]: event.target.value });
    };





    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setShow(false);
        }
    })

    const handleSubmit = (e) => {
       e.preventDefault();
         CreateSupplier.mutate(newSupplier);        
    }





    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${show ? 'scale-100' : ''}`}>
            <div className="bg-white rounded-lg w-1/2">
                <div className="flex justify-between items-center p-2">
                    <div className='flex flex-row items-center'>
                        <i className='bi bi-box text-2xl mr-2'></i>
                        <h1 className="text-xl font-bold">Add New Supplier</h1>
                    </div>
                    <button className="text-red-500 p-3" onClick={() => setShow(false)}>X</button>
                </div>
                <div className="h-full p-2">
                        <div>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="supplierName"
                                    value={newSupplier.supplierName}
                                    onChange={handleInputChange}
                                    placeholder="Name"
                                    className="border border-gray-200 rounded-lg p-2 mb-2 w-full"
                                    required    
                                />
                                <textarea
                                    type="text"
                                    name="description"
                                    value={newSupplier.description}
                                    onChange={handleInputChange}
                                    placeholder="Description"
                                    
                                    className="border border-gray-200 rounded-lg p-2 mb-2 w-full"
                                 
                                />
                                <button type="submit" className="bg-blue-500 text-white rounded-lg p-2 w-full">
                                    Add Supplier
                                </button>
                            </form>
                        </div>

                </div>
            </div>
        </div>
    )
}

export default AddSupplier;