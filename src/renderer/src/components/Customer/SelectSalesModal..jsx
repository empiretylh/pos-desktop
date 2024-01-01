import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios';
import { useAlertShow } from '../custom_components/AlertProvider';
import { useProductsData } from '../../context/ProductsDataProvider';
import { useMutation, useQuery } from 'react-query';
import { changePrice, getSales, postCustomer, putCustomer } from '../../server/api';
import { useCustomerData } from '../../context/CustomerProvider';
import numberWithCommas from '../custom_components/NumberWithCommas';

const SelectedSalesModal = ({ show, setShow, oldSalesData, customerid }) => {

    const { showNoti, showInfo } = useAlertShow();

    const { customer_data, data } = useCustomerData();

    const [type, setType] = useState('all');
    const [time, setTime] = useState('today');
    const [startd, setStartd] = useState('');
    const [endd, setEndd] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchtext, setSearchtext] = useState('');


    const sales_data = useQuery(['sales', type, time, startd, endd], getSales);

    useEffect(() => {
        sales_data.refetch();
    }, [type, time, startd, endd])

    const UpdateCustomer = useMutation(putCustomer, {
        onSuccess: () => {
            customer_data.refetch();
            setShow(false);
            showNoti("Successfully Updated Customer")
            setSelectedItem([]);
        },
        onError: () => {
            showNoti("Failed to Update Customer", 'bi bi-x-circle-fill text-red-500')
            setShow(false);
        }

    })



    const FilterSalesData = useMemo(() => {
        // Compare two data `salesData` and `data` with receiptNumber and intereset the result
        let salesData = sales_data?.data?.data?.DATA;
        console.log(salesData)
        if (salesData?.length === 0) return sales_data;

        if (oldSalesData?.length === 0) return salesData;



        if (data) {
            let finaldata = salesData?.filter(item => !oldSalesData?.find(dataItem => dataItem.receiptNumber == item.receiptNumber));

            if (searchtext) finaldata = finaldata?.filter(item => item.voucherNumber.toLowerCase().includes(searchtext.toLowerCase()) || item.customerName.toLowerCase().includes(searchtext.toLowerCase()));

            return finaldata;
        }

        return []


    }, [sales_data.data, data, oldSalesData, searchtext]);

    const inputRef = useRef(null);
    const handleInputChange = (event) => {
        setNewCustomer({ ...newCustomer, [event.target.name]: event.target.value });
    };

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setShow(false);
        }
    })

    const [selectedItem, setSelectedItem] = useState([]);

    const onSelectItem = (id) => {

        //if id is include remove
        if (selectedItem.includes(id)) {
            setSelectedItem(prev => prev.filter(item => item != id))
        } else {
            setSelectedItem(prev => [...prev, id])

        }


    }


    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${show ? 'scale-100' : ''}`}>
            <div className="bg-white rounded-lg w-1/2">
                <div className="flex justify-between items-center p-2">
                    <div className='flex flex-row items-center'>
                        <i className='bi bi-receipt text-2xl mr-2'></i>
                        <h1 className="text-xl font-bold">Recent Vouchers</h1>
                    </div>
                    <button className="text-red-500 p-3" onClick={() => setShow(false)}>X</button>
                </div>
                <div className="flex flex-row justify-between items-center p-2">
                    <div className="flex flex-row items-center">
                        {/* Search Input */}
                        <input type="text"
                            className="border-2 border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500" placeholder="Search Voucher" value={searchtext} onChange={(e) => setSearchtext(e.target.value)} />
                        {/* Filter Type */}
                    </div>
                    <div className="flex flex-row items-center">
                        {/* Unselect all button */}
                        <button className="bg-red-500 text-white px-2 p-2 rounded-md mr-2" onClick={() => setSelectedItem([])}>Unselect All</button>
                        {/* Select all button */}
                        <button className="bg-green-500 text-white px-2 p-2 rounded-md" onClick={() => setSelectedItem(FilterSalesData.map(item => item.receiptNumber))}>Select All</button>
                    </div>
                    <h1 className="text-md font-bold">{selectedItem.length} Selected</h1>
                </div>
                <div className="p-2  overflow-y-auto" style={{
                    height: 'calc(100vh - 200px)',
                }}>
                    {FilterSalesData?.length > 0 ?
                        FilterSalesData?.map((item, index) => (
                            <div key={index} className="flex flex-row justify-between items-center p-2 border-b-2">
                                <div className="flex flex-col">
                                    <h1 className="text-xl font-bold">{item.voucherNumber}</h1>
                                    <p className="text-sm">{new Date(item.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-xl font-bold">{numberWithCommas(parseInt(item.grandtotal))} Ks</h1>
                                    <p className="text-sm">{item.customerName}</p>
                                </div>
                                <div className="flex flex-col">
                                    <button className={`${selectedItem.includes(item.receiptNumber) ? 'bg-green-800' : 'bg-green-600'}  text-white px-2 p-2 rounded-md`} onClick={() => onSelectItem(item.receiptNumber)}>{selectedItem.includes(item.receiptNumber) ? 'Selected' : 'Select'}</button>
                                </div>
                            </div>
                        )) :
                        <div>
                            <h1 className="text-xl font-bold text-center">No Recent Voucher</h1>
                        </div>
                    }
                </div>
                <div>
                    <button className="bg-primary text-white px-2 p-2 rounded-md w-full mt-3" onClick={() => {
                        UpdateCustomer.mutate({
                            customer_id: customerid,
                            sales: selectedItem,
                        });
                    }}>Add Selected Sales</button>
                </div>
            </div>
        </div>
    )
}

export default SelectedSalesModal;