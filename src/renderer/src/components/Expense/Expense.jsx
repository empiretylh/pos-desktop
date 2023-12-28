import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useExpenseData } from '../../context/ExpenseDataProvider';
import { deleteExpense, postExpense, putExpense } from '../../server/api';
import { useAlertShow } from '../custom_components/AlertProvider';
import Loading from '../custom_components/Loading';
import Navigation from '../custom_components/Navigation';
import numberWithCommas from '../custom_components/NumberWithCommas';
import ExpenseTable from './ExpenseTable';
const { ipcRenderer } = window.electron

const Expense = () => {


    const { showConfirm, showInfo, showNoti } = useAlertShow();

    const [loading, setLoading] = useState(false);

    const [selected, setSelected] = useState('Products');

    const [searchtext, setSearchtext] = useState('');
    const [sortby, setSortBy] = useState('none');

    const [time, setTime] = useState('month')

    const { t } = useTranslation();

    const { expense_data, data, reload } = useExpenseData();

    const [selectedRow, setSelectedRow] = useState(null);

    const inputRef = useRef();
    const expenseform = useRef();

    const PostExpense = useMutation(postExpense, {
        onMutate: () => {
            setLoading(true);

        },
        onSuccess: () => {
            setLoading(false);
            showNoti("Expense Added Successfully");
            expense_data.refetch();
            clearExpenseForm();
        },
        onError: () => {
            setLoading(false);
            showNoti("Error Occured", 'bi bi-x-circle-fill text-red-500');


        }
    });

    const PutExpense = useMutation(putExpense, {
        onMutate: () => {
            setLoading(true);

        },
        onSuccess: () => {
            setLoading(false);
            showNoti("Expense Updated Successfully");
            expense_data.refetch();
            clearExpenseForm();
        },
        onError: () => {
            setLoading(false);
            showNoti("Error Occured", 'bi bi-x-circle-fill text-red-500');
        }
    })


    const DeleteExpense = useMutation(deleteExpense, {
        onMutate: () => {
            setLoading(true);

        },
        onSuccess: () => {
            setLoading(false);
            showNoti("Expense Deleted Successfully");
            expense_data.refetch();
            clearExpenseForm();
        },
        onError: () => {
            setLoading(false);
            showNoti("Error Occured", 'bi bi-x-circle-fill text-red-500');
        }

    })



    const ExpenseSubmit = (e) => {
        e.preventDefault();

        //if selectedRow is not null putproduct else postproduct
        if (selectedRow?.id) {
            //selectedRow remove pic 

            return PutExpense.mutate({
                id: selectedRow?.id,
                title: selectedRow?.title,
                price: selectedRow?.price,
                date: selectedRow?.date,
                description: selectedRow?.description,
            })
        }

        const form = e.target;



        PostExpense.mutate(
            {
                title: form.title.value,
                price: form.price.value,
                date: form.date.value,
                description: form.description.value,
            }
        );

        form.reset();
        clearExpenseForm();
    }




    const productRowClick_Update = (item) => {
        expenseform.current.reset();
        setSelectedRow(item);
        inputRef.current.focus();
        //selectall text input
        inputRef.current.select();
    }



    const handleChange = (value, name) => {
        setSelectedRow({ ...selectedRow, [name]: value });
    }

    const clearExpenseForm = () => {
        setSelectedRow(null);
        expenseform.current.reset();
    }

    const computeExpensePrice = useMemo(() => {
        let price = 0;
        if (data) {
            data.map(item => {
                price += parseInt(item.price);
            })
        }
        return price
    }, [data])



    const DeleteExpenseButton = () => {
        if (selectedRow?.id) {
            showConfirm("Delete Expense", "Are you sure to delete this item ? ", () => {
                DeleteExpense.mutate({
                    id: selectedRow?.id

                })

            });
        }
    }

    useEffect(() => {
        reload('', time)
        expense_data.refetch();
    }, [time])


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'Delete') {
                DeleteExpenseButton();
            }

            // alt del to clear form
            if (e.altKey && e.key === 'Delete') {
                clearExpenseForm();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [selectedRow])

    return (
        <div className='flex flex-row h-screen'>
            <Navigation />
            <Loading show={loading} />
            <div className="bg-white font-sans h-full w-full p-3 overflow-auto">
                <div className="flex flex-row items-center bg-white ">
                    <i className='bi bi-stack text-2xl mr-2'></i>
                    <h1 className='text-2xl font-bold'>{t('Expense')}</h1>

                    <h1 className='text-lg font-bold text-right ml-auto' style={{ width: 180 }}>{numberWithCommas(computeExpensePrice)} MMK</h1>


                </div>

                {/*Search Bar */}
                <div className='grid grid-cols-3 gap-3 mt-3'>
                    <div className="col-span-1 border p-2">

                        <form ref={expenseform} className="flex flex-col overflow-x-hidden overflow-y-auto" onSubmit={ExpenseSubmit} >
                            <div className="flex flex-row">
                                <label className="text-xl text-black font-bold ">{t('Expense')}</label>

                                {/* Clear icon */}
                                <div onClick={clearExpenseForm} className="select-none ml-auto cursor-pointer bg-red-500 rounded-md px-2 text-white flex flex-row items-center">
                                    <i onClick={clearExpenseForm} className="bi bi-x text-2xl text-white cursor-pointer"></i>
                                    <label>Clear</label>
                                </div>

                            </div>
                            <label className="text-sm text-black font-bold mt-3">{t('Title')}</label>
                            <input
                                value={selectedRow?.title}
                                onChange={e => handleChange(e.target.value, e.target.id)}
                                ref={inputRef} type="text"
                                className="border border-gray-300 rounded-md w-full p-2  my-1"
                                placeholder={t('Title')}
                                required
                                autoComplete="on"
                                id="title" />



                            <label className="text-sm text-black font-bold mt-1">{t('Price')}</label>
                            <input value={selectedRow?.price} required onChange={e => handleChange(e.target.value, e.target.id)} type="number" className="border border-gray-300 rounded-md w-full p-2 my-1" placeholder={t('Price')}  id="price" />


                            <label className="text-sm text-black font-bold mt-1">{t('Date')}</label>
                            <input type="date" value={selectedRow?.date} required onChange={e => handleChange(e.target.value, "date")} className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('Date')} id="date" />

                            {/* Description */}
                            <label className="text-sm text-black font-bold mt-1">{t('Description')}</label>
                            <input type="text" value={selectedRow?.description == 'undefined' ? '' : selectedRow?.description} onChange={e => handleChange(e.target.value, e.target.id)} className="border border-gray-300 rounded-md w-full p-2  my-1" placeholder={t('Description')} id="description" />

                            <button
                                type="submit"
                                className={`${selectedRow?.id ? "bg-green-800 hover:bg-green-900" : "bg-primary hover:bg-cyan-800   "} text-white font-bold rounded-md w-full p-2 mr-3 mt-1 flex flex-row items-center justify-center`}>
                                {/* add icon and edit icon  */}
                                <i className={`bi ${selectedRow?.id ? "bi-pencil-square" : "bi-plus-square"} text-white mr-2`}></i>


                                {t(selectedRow?.id ? "Update" : "Create_Receipt")}

                            </button>

                            {selectedRow?.id ?
                                <button
                                    type="button"
                                    onClick={() => {
                                        DeleteExpenseButton();
                                    }}

                                    className="bg-red-500  hover:bg-red-700 text-white font-bold rounded-md w-full p-2 mr-3 mt-1 flex flex-row items-center justify-center">
                                    {/* trash icon */}
                                    <i className="bi bi-trash text-white mr-2"></i>
                                    {t('Delete_Product')}

                                </button>
                                : null}
                        </form>


                    </div>
                    <div className="col-span-2 border p-2">
                        <div className='flex flex-row items-center'>
                            <div className="flex flex-row items-center mt-3 w-full">
                                <icon className="bi bi-search text-2xl text-gray-400 mr-2"></icon>
                                <input type="text" className="border border-gray-300 rounded-md w-full p-2 mr-3" placeholder={t('Search Expense')} onChange={(e) => setSearchtext(e.target.value)} />
                            </div>
                            {/* month, year, today toggle */}
                            <div className="flex flex-row items-center whitespace-nowarp w-[450px]">
                                <label className='whitespace-nowarp mr-3'>
                                    <input 
                                        type="radio" 
                                        name="timeFilter"
                                        value="today"
                                        checked={time=='today'}
                                        onChange={() => setTime('today')} 
                                    />
                                    {t('Today')}
                                </label>
                                <label className='whitespace-nowarp mr-3'>

                                    <input 
                                        type="radio" 
                                        name="timeFilter"
                                        value="month"
                                        checked={time=='month'}
                                        onChange={() => setTime('month')} 
                                    />
                                    {t('This_Month')}
                                </label>
                                <label className='whitespace-nowarp'>

                                    <input 
                                        type="radio" 
                                        name="timeFilter"
                                        checked={time=='year'}
                                        value="year"
                                        onChange={() => setTime('year')} 
                                    />
                                    {t('This_Year')}

                                </label>
                            </div>

                        </div>

                        <ExpenseTable
                            data={data}
                            searchtext={searchtext}
                            sortby={sortby}
                            selectedRow={selectedRow}
                            setSelectedRow={setSelectedRow}
                            rowDoubleClick={productRowClick_Update} />
                    </div>


                </div>

            </div>

        </div>
    )
}

export default Expense;