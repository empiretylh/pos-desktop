import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import CustomerVoucherTable from './CustomerVoucherTable';
import { useOtherIncome } from '../../context/OtherIncomeDataProvider';
import { deleteCustomer, deleteOtherIncome, postOtherIncome, putOtherIncome } from '../../server/api';
import { useAlertShow } from '../custom_components/AlertProvider';
import Loading from '../custom_components/Loading';
import Navigation from '../custom_components/Navigation';
import numberWithCommas from '../custom_components/NumberWithCommas';
import { SalesByCustomerName, useCustomerData } from '../../context/CustomerProvider';
import AddCustomer from './CustomerAddModal';
import SetPaymentModal from './SetPaymentModal';
import CustomerEditModal from './CustomerEditModal';
import SelectedSalesModal from './SelectSalesModal.';
import { useUserType } from '../../context/UserTypeProvider';
const { ipcRenderer } = window.electron


const Customer = () => {


    const { showConfirm, showInfo, showNoti } = useAlertShow();

    const [loading, setLoading] = useState(false);


    const [searchtext, setSearchtext] = useState('');
    const [customer_searchtext, setCustomer_SearchText] = useState('');
    const [selectedSales, setSelectedSales] = useState(null);
    const [sortby, setSortBy] = useState('none');

    const [time, setTime] = useState('month')

    const { t } = useTranslation();

    const { customer_data, data } = useCustomerData();

    const [selectedRow, setSelectedRow] = useState(null);

    const inputRef = useRef();
    const otherincomeform = useRef();

    const productRowClick_Update = (item) => {
        otherincomeform.current.reset();
        setSelectedRow(item);
        inputRef.current.focus();
        //selectall text input
        inputRef.current.select();
    }



    const handleChange = (value, name) => {
        setSelectedRow({ ...selectedRow, [name]: value });
    }


    const computeOtherIncomePrice = useMemo(() => {
        let price = 0;
        if (data) {
            data.map(item => {
                price += parseInt(item.price);
            })
        }
        return price
    }, [data])


    const [showPayment, setShowPayment] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState([]);

    const DeleteCustomer = useMutation(deleteCustomer, {
        onSuccess: () => {
            customer_data.refetch();
            setSelectedSales(null);
            showNoti("Successfully Deleted Customer")
        },
        onError: () => {
            showNoti("Failed to Delete Customer", 'bi bi-x-circle-fill text-red-500')
        }
    });


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'Delete') {
                DeleteOtherIncomeButton();
            }

            // alt del to clear form
            if (e.altKey && e.key === 'Delete') {
                clearOtherIncomeForm();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [selectedRow])

    //Compute sales vouchers grandtotal
    const computeVouchersRemainingTotal = (sales=[]) => {
        let total = 0;
        sales?.map(item => {
            total += parseInt(item.grandtotal) - parseInt(item.customer_payment);
        })
        return total;
    }


    const AllVoucherRemaingTotal = useMemo(() => {
        let total = 0;
        if (customer_data) {
            customer_data?.data?.data.map(item => {
                item?.sales?.map(salesItem => {
                    total += parseInt(salesItem.grandtotal) - parseInt(salesItem.customer_payment);
                })
            })
        }
        return total;
    }, [customer_data])


    const filterCustomerData = useMemo(() => {
        if (customer_data) {
            return customer_data?.data?.data?.filter(item => {
                if (item.name.toLowerCase().includes(customer_searchtext.toLowerCase())) {
                    return item;
                }
            })
        }
    }, [customer_searchtext, data])

    const [showCustomer, setShowCustomer] = useState(false);

    const salesData = SalesByCustomerName(selectedSales?.id);
    const [showEditCustomer, setShowEditCustomer] = useState(false);

    const [showSelectedSales, setShowSelectedSales] = useState(false);

    const {isAdmin} = useUserType();

    // press f5 to refersh data from server

    const searchref = useRef();
    const searchref2 = useRef();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'F5') {
                customer_data.refetch();
            }
            if(e.altKey && e.key == 'c'){
                searchref.current.focus();
            }
            if(e.altKey && e.key == 'f'){
                searchref2.current.focus();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }
        , [])

    return (
        <div className='flex flex-row h-screen'>
            <Navigation />
            <Loading show={loading} />
            <div className="bg-white font-sans h-full w-full p-3 overflow-auto">
                <div className="flex flex-row items-center bg-white ">
                    <i className='bi bi-person text-2xl mr-2'></i>
                    <h1 className='text-2xl font-bold'>{t('Customer')}</h1>

                    <h1 className='text-lg font-bold text-right ml-auto' style={{ width: 180 }}>{numberWithCommas(AllVoucherRemaingTotal)} MMK</h1>


                </div>

                {/*Search Bar */}
                <div className='grid grid-cols-3 gap-3 mt-3'>
                    <div className="col-span-1 border p-2">
                        <div className='flex flex-row items-center'>
                            {/* Search Input */}
                            <div className="flex flex-row items-center w-full">
                                <icon className="bi bi-search text-2xl text-gray-400 mr-2"></icon>
                                <input type="text"
                                    ref={searchref}
                                    className="border border-gray-300 rounded-md w-full p-2 mr-3"
                                    placeholder={t('Search Customer')} onChange={(e) => setCustomer_SearchText(e.target.value)} />

                            </div>

                            <button
                                className='bg-primary hover:bg-blue-600 text-white rounded-md p-2 whitespace-nowrap'
                                onClick={() => {
                                    setShowCustomer(true);
                                }}
                            >
                                <label className="whitespace-nowrap">
                                    + Add Customer
                                </label>
                            </button>
                        </div>
                        <div className='overflow-auto mt-2' style={{
                            height: 'calc(100vh - 200px)'

                        }}>
                            {filterCustomerData?.map((item, index) =>
                            (
                                <div
                                    onClick={() => setSelectedSales(item)}
                                    className={`flex flex-row items-center border-b py-2 px-2 hover:bg-slate-300 cursor-pointer select-none ${selectedSales?.id == item.id ? 'bg-blue-200' : ''}`} key={index}>
                                    <div className="flex flex-col">
                                        <div className='flex flex-row items-center'>
                                            <h1 className='text-md font-bold'>{item?.name}</h1>
                                        </div>
                                        <p className='text-md '>{item?.description}</p>
                                    </div>
                                    <div className='flex flex-col items-center ml-auto'>
                                        <h1 className='text-md font-bold'>{numberWithCommas(computeVouchersRemainingTotal(item?.sales))} Ks</h1>
                                        <h1 className='text-md'>{item?.sales?.length} Voucher</h1>
                                    </div>
                                </div>
                            )
                            )}
                        </div>
                    </div>
                    <div className="col-span-2 border p-2">
                        <div className='flex flex-col items-center'>
                            <div className='flex flex-row items-center w-full justify-between'>
                                <div className="flex flex-col items-center">

                                    {selectedSales && <div><h1 className="text-md font-bold whitespace-nowrap mr-2">{selectedSales?.name}'s Voucher List</h1>
                                        <p>{selectedSales.description}</p></div>
                                    }

                                </div>
                                {/* Edit and Delete Button */}
                                <div className='flex flex-row items-center'>

                                    <button className='bg-primary hover:bg-blue-600 text-white rounded-md p-2 whitespace-nowrap mr-2'
                                        onClick={() => {
                                            setShowEditCustomer(true);

                                        }}
                                    >
                                        <i className='bi bi-pencil mr-1'></i>
                                        <label className="whitespace-nowrap">
                                            Edit
                                        </label>
                                    </button>
                                   {isAdmin &&  <button className='bg-red-500 hover:bg-red-600 text-white rounded-md p-2 whitespace-nowrap'
                                        onClick={() => {
                                            showConfirm("Delete Customer", "Are you sure to delete this customer?", () => {
                                                DeleteCustomer.mutate({ id: selectedSales?.id });
                                            }
                                            )
                                        }}
                                    >
                                        <i className="bi bi-trash mr-1"></i>
                                        <label className="whitespace-nowrap">
                                            Delete Customer
                                        </label>
                                    </button>}
                                </div>

                            </div>
                            <div className="flex flex-row items-center mt-3 w-full">
                                <icon className="bi bi-search text-2xl text-gray-400 mr-2"></icon>
                                <input ref={searchref2} type="text" className="border border-gray-300 rounded-md w-full p-2 mr-3" placeholder={t('Search Receipt Number')} onChange={(e) => setSearchtext(e.target.value)} />
                                <button className='bg-primary hover:bg-blue-600 text-white rounded-md p-2 whitespace-nowrap mr-2'
                                    onClick={() => {
                                        setShowSelectedSales(true);

                                    }}
                                >
                                    <i className='bi bi-receipt mr-1'></i>
                                    <label className="whitespace-nowrap">
                                        Add Recent Vouchers
                                    </label>
                                </button>
                            </div>
                        </div>
                        {selectedSales ?
                            <CustomerVoucherTable
                                data={salesData}
                                searchtext={searchtext}
                                sortby={sortby}
                                selectedRow={selectedRow}
                                setSelectedRow={setSelectedRow}
                                rowDoubleClick={productRowClick_Update}
                                setShowPayment={setShowPayment}
                                customerid={selectedSales?.id}
                            />
                            :
                            <div>
                                <h1 className='text-2xl text-center mt-10'>No Customer Selected</h1>
                            </div>
                        }
                    </div>


                </div>

            </div>
            <AddCustomer show={showCustomer} setShow={setShowCustomer} />
            <SetPaymentModal show={showPayment} setShow={setShowPayment} payment_data={selectedRow} />
            <CustomerEditModal show={showEditCustomer} setShow={setShowEditCustomer} oldcustomer={selectedSales}  />
            <SelectedSalesModal show={showSelectedSales} setShow={setShowSelectedSales} oldSalesData={salesData} customerid={selectedSales?.id} />  

        </div>
    )
}

export default Customer;