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
import { useSetting } from '../../context/SettingContextProvider';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useCustomVoucher } from '../../context/CustomVoucherProvider';

const exampleData = {
    voucherNumber: "123456",
    customerName: "John Doe",
    date: new Date(),
    sproduct: [
        { name: "Product 1", qty: 2, price: 10, total: 20 },
        { name: "Product 2", qty: 1, price: 15, total: 15 },
    ],
    totalAmount: 35,
    tax: '5',
    deliveryCharges: '10',
    discount: '5',
    isDiscountAmount: true,
    grandtotal: 40,
    customer_payment: 20,
    description: "Example description",
};

const CustomVoucherEditor = ({ show, setShow, data = exampleData, customerid }) => {

    const { showNoti, showInfo } = useAlertShow();
    const viewRef = useRef(null);

    const { user_data, profiledata: profile } = useAuth();

    const { settings, ChangeSettings } = useSetting();
    const { values, ChangeValue } = useCustomVoucher();

    const [paperWidth, setPaperWidth] = useState(settings?.paperwidth || 500);
    const [paper, setPaper] = useState(settings?.paper || '58');

    const [rootwidth, setRootWidth] = useState(0);

    useEffect(() => {
        setPaperWidth(settings?.paperwidth || 500);
        setPaper(settings?.paper || '58')

    }, [settings])

    const noWidth = 50;
    const nameWidth = 200;
    const qtyWidth = 50;
    const priceWidth = 100;
    const totalWidth = 100;



    const { t } = useTranslation();



    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {

            setShow(false);

        }
    })

    useEffect(() => {
        if (settings?.paper == 58) {
            ChangeSettings(500, 'paperWidth')
        } else if (settings?.paper == 80) {
            ChangeSettings(620, 'paperWidth')
        } else if (settings?.paper == 'A4') {
            ChangeSettings(800, 'paperWidth')
        } else if (settings?.paper == 'A5') {
            ChangeSettings(500, 'paperWidth')
        }

    }, [settings?.paperWidth, settings?.paper])

    const ref = useRef(null);


    useEffect(() => {
        if (ref.current) {
            setRootWidth(ref.current.offsetWidth);
            console.log('Width:', ref.current.offsetWidth);
            console.log('Height:', ref.current.offsetHeight);
        }
    }, []);

    const [shopFontSize, setShopFontSize] = useState(values?.shopfontsize || 10);
    const [shopDetailFontSize, setShopDetailFontSize] = useState(values?.shopdetailfontsize || 8);
    const [fontsize, setFontSize] = useState(values?.fontsize || 5);
    const [lineheight, setlineHeight] = useState(values?.lineheight || 0.1);
    const [lineMt, setlineMt] = useState(values?.linemt || 0.5);
    const [bodyPadding, setBodyPadding] = useState(values?.bodypadding || '20px 20px 20px 20px');
    const [padding, setPadding] = useState(values?.padding || '10px 10px 10px 10px');
    const [itemFontsize, setItemFontSize] = useState(values?.itemFontsize || 6);
    const [headerPadding, setHeaderPadding] = useState(values?.headerpadding || '20px 20px 0px 20px');

    const renderItem = (item , index) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginVertical: 5 }}>
                <p style={{ fontSize: parseFloat(itemFontsize), width: noWidth, fontWeight: 'bold', textAlign:'left' }}>{index + 1}</p>

                <p style={{ fontSize: parseFloat(itemFontsize), width: nameWidth, fontWeight: 'bold' }}>{item.name}</p>
                <p style={{ fontSize: parseFloat(itemFontsize), width: qtyWidth, textAlign: 'center' }}>{item.qty}</p>
                <p style={{ fontSize: parseFloat(itemFontsize), width: priceWidth, textAlign: 'right' }}>{numberWithCommas(item.price)}</p>
                <p style={{ fontSize: parseFloat(itemFontsize), width: totalWidth, textAlign: 'right' }}>{numberWithCommas(parseInt(item.price) * parseInt(item.qty))}</p>
            </div>
        )
    };
    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${show ? 'scale-100' : ''}`}>
            <div className="bg-white rounded-lg w-[95%] h-[95%] flex flex-col relative ">
                <div className="flex justify-between items-center p-2">
                    <div className='flex flex-row items-center'>
                        <i className='bi bi-receipt text-2xl mr-2'></i>
                        <h1 className="text-xl font-bold">Custom Voucher Editor</h1>
                    </div>
                    <button className="text-red-500 p-3" onClick={() => setShow(false)}>X</button>
                </div>

                <div className="grid grid-cols-4 w-full h-full p-1 rounded-md relative">
                    <div className='col-span-1 w-full  border rounded shadow-md flex flex-col overflow-auto' style={{
                        height:'calc(100vh - 110px)'
                    }}>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50'>
                            <label className='text-sm font-bold'>Logo Align : </label>
                            <select
                                className='border rounded p-1'
                                value={values?.logoalign}
                                onChange={(e) => ChangeValue(e.target.value, 'logoalign')}
                            >
                                <option value='left'>Left</option>
                                <option value='center'>Center</option>
                            </select>
                        </div>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Logo Size : </label>
                            <input type="number" min={0} value={values?.logosize} onChange={(e) => {
                                ChangeValue(e.target.value, 'logosize')
                            }} className='border rounded p-1 w-20 text-center' />
                        </div>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Shop Name's Font Size : </label>
                            <input type="number" min={0} value={values?.shopfontsize} onChange={(e) => {
                                setShopFontSize(e.target.value)
                                ChangeValue(e.target.value, 'shopfontsize')
                            }} className='border rounded p-1 w-20 text-center' />
                        </div>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Shop Details' Font Size : </label>
                            <input type="number" min={0} value={values?.shopdetailfontsize} onChange={(e) => {
                                setShopDetailFontSize(e.target.value)
                                ChangeValue(e.target.value, 'shopdetailfontsize')
                            }} className='border rounded p-1 w-20 text-center' />
                        </div>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Text Size : </label>
                            <input type="number" min={0} value={parseInt(values?.fontsize)} onChange={(e) => {
                                setFontSize(e.target.value)
                                ChangeValue(e.target.value, 'fontsize')
                            }} className='border rounded p-1 w-20 text-center' />
                        </div>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Seperator Height: </label>
                            <input type="number" min={0} value={parseFloat(values?.lineheight)} onChange={(e) => {
                                setlineHeight(e.target.value)
                                ChangeValue(e.target.value, 'lineheight')
                            }} className='border rounded p-1 w-20 text-center' />
                        </div>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Seperator Margin: </label>
                            <input type="number" min={0} value={parseFloat(values?.linemt)} onChange={(e) => {
                                setlineMt(e.target.value)
                                ChangeValue(e.target.value, 'linemt')
                            }} className='border rounded p-1 w-20 text-center' />
                        </div>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Item Text Size: </label>
                            <input type="number" min={0} value={parseFloat(values?.itemFontsize)} onChange={(e) => {
                                setItemFontSize(e.target.value)
                                ChangeValue(e.target.value, 'itemFontsize')
                            }} className='border rounded p-1 w-20 text-center' />
                        </div>
                        <div className='flex flex-col w-full p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Paper Margin: (top, right, bottom, left) </label>
                            <input type="teext" min={0} value={values?.padding || '10px 10px 10px 10px'} onChange={(e) => {
                                setPadding(e.target.value)
                                ChangeValue(e.target.value, 'padding')
                            }} className='border rounded p-2 w-full mt-1 text-center ' />
                        </div>
                        <div className='flex flex-col w-full p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Header Margin: (top, right, bottom, left) </label>
                            <input type="teext" min={0} value={values?.headerpadding || '20px 20px 0px 20px'} onChange={(e) => {
                                setHeaderPadding(e.target.value)
                                ChangeValue(e.target.value, 'headerpadding')
                            }} className='border rounded p-2 w-full mt-1 text-center ' />
                        </div>
                        <div className='flex flex-col w-full p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Table Margin: (top, right, bottom, left) </label>
                            <input type="teext" min={0} value={values?.bodypadding || '0px 20px 20px 20px'} onChange={(e) => {
                                setBodyPadding(e.target.value)
                                ChangeValue(e.target.value, 'bodypadding')
                            }} className='border rounded p-2 w-full mt-1 text-center ' />
                        </div>
                    </div>
                    <div className='col-span-2 border rounded bg-red-500 flex' ref={ref}>
                        <TransformWrapper>
                            <TransformComponent

                                wrapperStyle={{
                                    width: '100%',
                                    height: 'calc(100vh - 110px)',
                                    border: '1px solid red',
                                    backgroundColor: '#f5f5f5',

                                }
                                }
                                contentStyle={{
                                    width: rootwidth - 200,
                                    height: heightofA4(rootwidth - 200),
                                }}
                            >
                                <div ref={viewRef} style={{ backgroundColor: 'white', width: rootwidth - 200, height: heightofA4(rootwidth - 200), overflow: 'auto', padding: padding }}>
                                    {values?.logoalign == 'center' ?
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: headerPadding }} className='mb-2'>
                                            {values?.islogo && <img
                                                src={
                                                    profile.profileimage
                                                        ? axios.defaults.baseURL + profile.profileimage
                                                        : I.profile
                                                }
                                                style={{ width: parseInt(values?.logosize), height: parseInt(values?.logosize), alignSelf: 'center' }}
                                            />}
                                            <p style={{ fontWeight: 'bold', fontSize: parseInt(shopFontSize) }}>{profile.name}</p>
                                            <p style={{ textAlign: 'center', fontSize: parseInt(parseInt(shopDetailFontSize)) }}>{profile.email}</p>
                                            <p style={{ textAlign: 'center', fontSize: parseInt(shopDetailFontSize) }}>{profile.phoneno}</p>
                                            <p style={{ textAlign: 'center', fontSize: parseInt(shopDetailFontSize) }}>{profile.address}</p>
                                        </div>
                                        :
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: headerPadding }} className='mb-2'>
                                            <div className='flex flex-row items-center'>
                                                {values?.islogo && <img
                                                    src={
                                                        profile.profileimage
                                                            ? axios.defaults.baseURL + profile.profileimage
                                                            : I.profile
                                                    }
                                                    style={{ width: parseInt(values?.logosize), height: parseInt(values?.logosize), alignSelf: 'center' }}
                                                />}
                                                <p style={{ fontWeight: 'bold', fontSize: parseInt(shopFontSize), marginLeft: 5 }}>{profile.name}</p>
                                            </div>
                                            <div >
                                                <p style={{ textAlign: 'left', fontSize: parseInt(shopDetailFontSize) }}>{profile.email}</p>
                                                <p style={{ textAlign: 'left', fontSize: parseInt(shopDetailFontSize) }}>{profile.phoneno}</p>
                                                <p style={{ textAlign: 'left', fontSize: parseInt(shopDetailFontSize) }}>{profile.address}</p>
                                            </div>
                                        </div>

                                    }
                                    <div style={{ padding: bodyPadding }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>
                                                {values?.ReceiptNo}:{' '}
                                            </p>
                                            <p style={{ fontSize: parseInt(fontsize) }}>{data?.voucherNumber}</p>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>
                                                {values?.CustomerName}:{' '}
                                            </p>
                                            <p style={{ fontSize: parseInt(fontsize) }}>{data?.customerName}</p>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className='mb-'>
                                            <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>{values?.Date}:{' '}</p>
                                            <p style={{ fontSize: parseInt(fontsize) }}>{new Date(data?.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="border w-full  bg-black" style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginVertical: 5 }}>
                                            <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold', width: noWidth, textAlign: "left" }}>{values?.No || 'No'}</p>
                                            <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold', width: nameWidth, textAlign: "left" }}>{values?.ProductName}</p>
                                            <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold', width: qtyWidth, textAlign: 'center' }}>{values?.Qty}</p>
                                            <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold', width: priceWidth, textAlign: 'right' }}>{values?.Price}</p>
                                            <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold', width: totalWidth, textAlign: 'right' }}>{values?.Total}</p>
                                        </div>

                                        {data?.sproduct?.map((item, index) => renderItem(item, index))}
                                        <div className="border w-full  bg-black" style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }} />
                                        <div className='my-1' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>{values?.TotalAmount}:{' '}</p>
                                            <p style={{ fontSize: parseInt(fontsize) }}>{numberWithCommas(data?.totalAmount)} Ks</p>
                                        </div>
                                        {data?.tax === '0' ? null : (
                                            <div className="my-1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>{values?.Tax}:{' '}</p>
                                                <p style={{ fontSize: parseInt(fontsize) }}>{numberWithCommas(data?.tax)} %</p>
                                            </div>
                                        )}
                                        {data?.deliveryCharges === null || data?.deliveryCharges === '0' ? null : (
                                            <div className="my-1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>{values?.DeliveryCharges}:{' '}</p>
                                                <p style={{ fontSize: parseInt(fontsize) }}>{numberWithCommas(data?.deliveryCharges)} Ks</p>
                                            </div>
                                        )}
                                        {data?.discount === '0' ? null : (
                                            <>
                                                <div className="border w-full  bg-black" style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }} />
                                                <div className="my-1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>{values?.Discount}:{' '}</p>
                                                    <p style={{ fontSize: parseInt(fontsize) }}>{data?.discount} {data?.isDiscountAmount ? 'Ks' : '%'}</p>
                                                </div>
                                            </>
                                        )}
                                        <div className="border w-full  bg-black" style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }} />
                                        <div className="my-1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>{values?.GrandTotal}:{' '}</p>
                                            <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>{numberWithCommas(parseInt(data?.grandtotal))} Ks</p>
                                        </div>
                                        {parseInt(data?.customer_payment, 10) === parseInt(data?.grandtotal, 10) ? null : (
                                            <>
                                                <div className="border w-full  bg-black" style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }} />
                                                <div className="my-1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>{values?.PaymentAmount}:{' '}</p>
                                                    <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>{numberWithCommas(parseInt(data?.customer_payment))} Ks</p>
                                                </div>
                                                <div className="border w-full  bg-black" style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }} />


                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>{values?.RemainingAmount} : </p>
                                                    <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>
                                                        {numberWithCommas(parseInt(data?.grandtotal, 10) - parseInt(data?.customer_payment, 10))} Ks
                                                    </p>
                                                </div>
                                            </>
                                        )}


                                        {data?.description === '' || data?.description === '#cashier' ? null : (
                                            <>
                                                <div className="border w-full  bg-black" style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }} />


                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                                                    <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>{values?.Description}: </p>
                                                    <p style={{ fontSize: parseInt(fontsize) }}>{data?.description?.replace('#cashier', '')}</p>
                                                </div>
                                            </>
                                        )}
                                        <p style={{ textAlign: 'center', marginTop: '10px', fontSize: parseInt(fontsize) }}>{settings?.footertext}</p>
                                    </div>
                                </div>
                            </TransformComponent>
                        </TransformWrapper>

                    </div>
                    <div className='col-span-1 w-full  border rounded shadow-md flex flex-col overflow-auto' style={{
                        height:'calc(100vh - 110px)'
                    }}>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50'>
                            <label className='text-sm font-bold'>Logo Align : </label>
                            <select
                                className='border rounded p-1'
                                value={values?.logoalign}
                                onChange={(e) => ChangeValue(e.target.value, 'logoalign')}
                            >
                                <option value='left'>Left</option>
                                <option value='center'>Center</option>
                            </select>
                        </div>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Logo Size : </label>
                            <input type="number" min={0} value={values?.logosize} onChange={(e) => {
                                ChangeValue(e.target.value, 'logosize')
                            }} className='border rounded p-1 w-20 text-center' />
                        </div>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Shop Name's Font Size : </label>
                            <input type="number" min={0} value={values?.shopfontsize} onChange={(e) => {
                                setShopFontSize(e.target.value)
                                ChangeValue(e.target.value, 'shopfontsize')
                            }} className='border rounded p-1 w-20 text-center' />
                        </div>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Shop Details' Font Size : </label>
                            <input type="number" min={0} value={values?.shopdetailfontsize} onChange={(e) => {
                                setShopDetailFontSize(e.target.value)
                                ChangeValue(e.target.value, 'shopdetailfontsize')
                            }} className='border rounded p-1 w-20 text-center' />
                        </div>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Text Size : </label>
                            <input type="number" min={0} value={parseInt(values?.fontsize)} onChange={(e) => {
                                setFontSize(e.target.value)
                                ChangeValue(e.target.value, 'fontsize')
                            }} className='border rounded p-1 w-20 text-center' />
                        </div>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Seperator Height: </label>
                            <input type="number" min={0} value={parseFloat(values?.lineheight)} onChange={(e) => {
                                setlineHeight(e.target.value)
                                ChangeValue(e.target.value, 'lineheight')
                            }} className='border rounded p-1 w-20 text-center' />
                        </div>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Seperator Margin: </label>
                            <input type="number" min={0} value={parseFloat(values?.linemt)} onChange={(e) => {
                                setlineMt(e.target.value)
                                ChangeValue(e.target.value, 'linemt')
                            }} className='border rounded p-1 w-20 text-center' />
                        </div>
                        <div className='flex flex-row items-center justify-between p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Item Text Size: </label>
                            <input type="number" min={0} value={parseFloat(values?.itemFontsize)} onChange={(e) => {
                                setItemFontSize(e.target.value)
                                ChangeValue(e.target.value, 'itemFontsize')
                            }} className='border rounded p-1 w-20 text-center' />
                        </div>
                        <div className='flex flex-col w-full p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Paper Margin: (top, right, bottom, left) </label>
                            <input type="teext" min={0} value={values?.padding || '10px 10px 10px 10px'} onChange={(e) => {
                                setPadding(e.target.value)
                                ChangeValue(e.target.value, 'padding')
                            }} className='border rounded p-2 w-full mt-1 text-center ' />
                        </div>
                        <div className='flex flex-col w-full p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Header Margin: (top, right, bottom, left) </label>
                            <input type="teext" min={0} value={values?.headerpadding || '20px 20px 0px 20px'} onChange={(e) => {
                                setHeaderPadding(e.target.value)
                                ChangeValue(e.target.value, 'headerpadding')
                            }} className='border rounded p-2 w-full mt-1 text-center ' />
                        </div>
                        <div className='flex flex-col w-full p-3 bg-slate-50 mt-1'>
                            <label className='text-sm font-bold'>Table Margin: (top, right, bottom, left) </label>
                            <input type="teext" min={0} value={values?.bodypadding || '0px 20px 20px 20px'} onChange={(e) => {
                                setBodyPadding(e.target.value)
                                ChangeValue(e.target.value, 'bodypadding')
                            }} className='border rounded p-2 w-full mt-1 text-center ' />
                        </div>
                    </div>

                </div>


            </div>

        </div>
    )
}

export default CustomVoucherEditor;


const heightofA4 = (width = 2480) => {
    console.log(width * 1.414, "height of Aa44")
    return width * 1.414;
}

const heightofA5 = (width = 2480) => {
    return width * 1.414;
}