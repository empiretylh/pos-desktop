import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { useAlertShow } from '../custom_components/AlertProvider'
import {
    LessThanProduct,
    getBeforeExpireProduct,
    useProductsData
} from '../../context/ProductsDataProvider'
import { useMutation, useQuery } from 'react-query'
import {
    changePrice,
    getSales,
    postCustomer,
    profileupdate,
    putCustomer,
    putProducts,
    putSupplier
} from '../../server/api'
import { useCustomerData } from '../../context/CustomerProvider'
import numberWithCommas from '../custom_components/NumberWithCommas'
import { useSupplierData } from '../../context/SupplierProvider'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContextProvider'
import { useSetting } from '../../context/SettingContextProvider'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { useCustomVoucher } from '../../context/CustomVoucherProvider'

const exampleData = {
    voucherNumber: '123456',
    customerName: 'John Doe',
    date: new Date(),
    sproduct: [
        { name: 'Product 1', qty: 2, price: 10, total: 20 },
        { name: 'Product 2', qty: 1, price: 15, total: 15 }
    ],
    totalAmount: 35,
    tax: '5',
    deliveryCharges: '10',
    discount: '5',
    isDiscountAmount: true,
    grandtotal: 40,
    customer_payment: 20,
    description: 'Example description'
}

const CustomVoucherEditor = ({ show, setShow, data = exampleData, customerid }) => {
    const { showNoti, showInfo } = useAlertShow()
    const viewRef = useRef(null)

    const { user_data, profiledata: profile } = useAuth()

    const { settings, ChangeSettings } = useSetting()
    const { values, ChangeValue } = useCustomVoucher()

    const [paperWidth, setPaperWidth] = useState(settings?.paperwidth || 500)
    const [paper, setPaper] = useState(settings?.paper || '58')

    const [rootwidth, setRootWidth] = useState(0)

    useEffect(() => {
        setPaperWidth(settings?.paperwidth || 500)
        setPaper(settings?.paper || '58')
    }, [settings])

    const noWidth = 50
    const nameWidth = 200
    const qtyWidth = 50
    const priceWidth = 100
    const totalWidth = 100

    const { t } = useTranslation()

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setShow(false)
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
    }, [settings?.paper])

    const ref = useRef(null)

    useEffect(() => {
        if (ref.current && settings?.paper == 'A4' || settings?.paper == 'A5') {
            setRootWidth(ref.current.offsetWidth)
            ChangeSettings(ref.current.offsetWidth - 200, 'paperWidth')
            
            console.log('Width:', ref.current.offsetWidth)
            console.log('Height:', ref.current.offsetHeight)
        }
    }, [settings?.paper])

    const [shopFontSize, setShopFontSize] = useState(values?.shopfontsize || 10)
    const [shopDetailFontSize, setShopDetailFontSize] = useState(values?.shopdetailfontsize || 8)
    const [fontsize, setFontSize] = useState(values?.fontsize || 5)
    const [lineheight, setlineHeight] = useState(values?.lineheight || 0.1)
    const [lineMt, setlineMt] = useState(values?.linemt || 0.5)
    const [bodyPadding, setBodyPadding] = useState(values?.bodypadding || '20px 20px 20px 20px')
    const [padding, setPadding] = useState(values?.padding || '10px 10px 10px 10px')
    const [itemFontsize, setItemFontSize] = useState(values?.itemFontsize || 6)
    const [headerPadding, setHeaderPadding] = useState(values?.headerpadding || '20px 20px 0px 20px')

    const [isEdit, setIsEdit] = useState(false)
    const [edittitle, setEditTitle] = useState('')
    const [editname, setEditName] = useState('')
    const [editvalue, setEditValue] = useState('')
    const focusref = useRef(null);

    const onEdit = (name, value, title) => {

        setIsEdit(true)
        setEditName(name)
        setEditValue(value)
        setEditTitle(title)
        focusref.current.focus();
    }

    const renderItem = (item, index) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginVertical: 5 }}>
                {values?.isnocol && <p
                    style={{
                        fontSize: parseFloat(itemFontsize),
                        width: noWidth,
                        fontWeight: 'bold',
                        textAlign: 'left'
                    }}
                >
                    {index + 1}
                </p>}

                {values?.isproductcol && <p style={{ fontSize: parseFloat(itemFontsize), width: nameWidth, fontWeight: 'bold' }}>
                    {item.name}
                </p>}
                {values?.isqtycol && <p style={{ fontSize: parseFloat(itemFontsize), width: qtyWidth, textAlign: 'center' }}>
                    {item.qty}
                </p>}
                {values?.ispricecol && <p style={{ fontSize: parseFloat(itemFontsize), width: priceWidth, textAlign: 'right' }}>
                    {numberWithCommas(item.price)}
                </p>}
                {values?.istotalcol && <p style={{ fontSize: parseFloat(itemFontsize), width: totalWidth, textAlign: 'right' }}>
                    {numberWithCommas(parseInt(item.price) * parseInt(item.qty))}
                </p>}
            </div>
        )
    }
    return (
        <div
            className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${show ? 'scale-100' : ''
                }`}
        >
            <div className="bg-white rounded-lg w-[95%] h-[95%] flex flex-col relative ">
                <div className="flex justify-between items-center p-2">
                    <div className="flex flex-row items-center">
                        <i className="bi bi-receipt text-2xl mr-2"></i>
                        <h1 className="text-xl font-bold">Custom Voucher Editor</h1>
                    </div>
                    <button className="text-red-500 p-3" onClick={() => setShow(false)}>
                        X
                    </button>
                </div>

                <div className="grid grid-cols-4 w-full h-full p-1 rounded-md relative">
                    <div
                        className="col-span-1 w-full  border rounded shadow-md flex flex-col overflow-auto"
                        style={{
                            height: 'calc(100vh - 110px)'
                        }}
                    >
                        <div className="flex flex-row items-center justify-between p-3 bg-slate-50">
                            <label className="text-sm font-bold">Logo Align : </label>
                            <select
                                className="border rounded p-1"
                                value={values?.logoalign}
                                onChange={(e) => ChangeValue(e.target.value, 'logoalign')}
                            >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                            </select>
                        </div>
                        <div className="flex flex-row items-center justify-between p-3 bg-slate-50 mt-1">
                            <label className="text-sm font-bold">Logo Size : </label>
                            <input
                                type="number"
                                min={0}
                                value={values?.logosize}
                                onChange={(e) => {
                                    ChangeValue(e.target.value, 'logosize')
                                }}
                                className="border rounded p-1 w-20 text-center"
                            />
                        </div>
                        <div className="flex flex-row items-center justify-between p-3 bg-slate-50 mt-1">
                            <label className="text-sm font-bold">Shop Name's Font Size : </label>
                            <input
                                type="number"
                                min={0}
                                value={values?.shopfontsize}
                                onChange={(e) => {
                                    setShopFontSize(e.target.value)
                                    ChangeValue(e.target.value, 'shopfontsize')
                                }}
                                className="border rounded p-1 w-20 text-center"
                            />
                        </div>
                        <div className="flex flex-row items-center justify-between p-3 bg-slate-50 mt-1">
                            <label className="text-sm font-bold">Shop Details' Font Size : </label>
                            <input
                                type="number"
                                min={0}
                                value={values?.shopdetailfontsize}
                                onChange={(e) => {
                                    setShopDetailFontSize(e.target.value)
                                    ChangeValue(e.target.value, 'shopdetailfontsize')
                                }}
                                className="border rounded p-1 w-20 text-center"
                            />
                        </div>
                        <div className="flex flex-row items-center justify-between p-3 bg-slate-50 mt-1">
                            <label className="text-sm font-bold">Text Size : </label>
                            <input
                                type="number"
                                min={0}
                                value={parseInt(values?.fontsize)}
                                onChange={(e) => {
                                    setFontSize(e.target.value)
                                    ChangeValue(e.target.value, 'fontsize')
                                }}
                                className="border rounded p-1 w-20 text-center"
                            />
                        </div>
                        <div className="flex flex-row items-center justify-between p-3 bg-slate-50 mt-1">
                            <label className="text-sm font-bold">Seperator Height: </label>
                            <input
                                type="number"
                                min={0}
                                value={parseFloat(values?.lineheight)}
                                onChange={(e) => {
                                    setlineHeight(e.target.value)
                                    ChangeValue(e.target.value, 'lineheight')
                                }}
                                className="border rounded p-1 w-20 text-center"
                            />
                        </div>
                        <div className="flex flex-row items-center justify-between p-3 bg-slate-50 mt-1">
                            <label className="text-sm font-bold">Seperator Margin: </label>
                            <input
                                type="number"
                                min={0}
                                value={parseFloat(values?.linemt)}
                                onChange={(e) => {
                                    setlineMt(e.target.value)
                                    ChangeValue(e.target.value, 'linemt')
                                }}
                                className="border rounded p-1 w-20 text-center"
                            />
                        </div>
                        <div className="flex flex-row items-center justify-between p-3 bg-slate-50 mt-1">
                            <label className="text-sm font-bold">Item Text Size: </label>
                            <input
                                type="number"
                                min={0}
                                value={parseFloat(values?.itemFontsize)}
                                onChange={(e) => {
                                    setItemFontSize(e.target.value)
                                    ChangeValue(e.target.value, 'itemFontsize')
                                }}
                                className="border rounded p-1 w-20 text-center"
                            />
                        </div>
                        <div className="flex flex-col w-full p-3 bg-slate-50 mt-1">
                            <label className="text-sm font-bold">Paper Margin: (top, right, bottom, left) </label>
                            <input
                                type="teext"
                                min={0}
                                value={values?.padding || '10px 10px 10px 10px'}
                                onChange={(e) => {
                                    setPadding(e.target.value)
                                    ChangeValue(e.target.value, 'padding')
                                }}
                                className="border rounded p-2 w-full mt-1 text-center "
                            />
                        </div>
                        <div className="flex flex-col w-full p-3 bg-slate-50 mt-1">
                            <label className="text-sm font-bold">
                                Header Margin: (top, right, bottom, left){' '}
                            </label>
                            <input
                                type="teext"
                                min={0}
                                value={values?.headerpadding || '20px 20px 0px 20px'}
                                onChange={(e) => {
                                    setHeaderPadding(e.target.value)
                                    ChangeValue(e.target.value, 'headerpadding')
                                }}
                                className="border rounded p-2 w-full mt-1 text-center "
                            />
                        </div>
                        <div className="flex flex-col w-full p-3 bg-slate-50 mt-1">
                            <label className="text-sm font-bold">Table Margin: (top, right, bottom, left) </label>
                            <input
                                type="teext"
                                min={0}
                                value={values?.bodypadding || '0px 20px 20px 20px'}
                                onChange={(e) => {
                                    setBodyPadding(e.target.value)
                                    ChangeValue(e.target.value, 'bodypadding')
                                }}
                                className="border rounded p-2 w-full mt-1 text-center "
                            />
                        </div>
                    </div>
                    <div className="col-span-2 border rounded bg-red-500 flex" ref={ref}>
                        <TransformWrapper>
                            <TransformComponent
                                wrapperStyle={{
                                    width: '100%',
                                    height: 'calc(100vh - 110px)',
                                    border: '1px solid red',
                                    backgroundColor: '#f5f5f5'
                                }}
                                contentStyle={{
                                    width: rootwidth - 200,
                                    height: settings?.paper == 'A4' ? heightofA4(rootwidth - 200) : heightofA5(rootwidth - 200),
                                }}
                            >
                                <div
                                    ref={viewRef}
                                    style={{
                                        backgroundColor: 'white',
                                        width: rootwidth - 200,
                                        height: settings?.paper == 'A4' ? heightofA4(rootwidth - 200) : heightofA5(rootwidth - 200),
                                        overflow: 'auto',
                                        padding: padding
                                    }}
                                >
                                    {values?.logoalign == 'center' ? (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                padding: headerPadding
                                            }}
                                            className="mb-2"
                                        >
                                            {values?.islogo && (
                                                <img
                                                    src={
                                                        profile.profileimage
                                                            ? axios.defaults.baseURL + profile.profileimage
                                                            : I.profile
                                                    }
                                                    style={{
                                                        width: parseInt(values?.logosize),
                                                        height: parseInt(values?.logosize),
                                                    }}
                                                />
                                            )}
                                            <p
                                                className="hover:bg-blue-100 cursor-pointer min-h-[10px] min-w-[100px] border"
                                                style={{ fontWeight: 'bold', fontSize: parseInt(shopFontSize) }}
                                                onClick={() => {
                                                    onEdit('shopname', values?.shopname || profile.name, 'Shop Name')
                                                }}
                                            >
                                                {values?.shopname}
                                            </p>
                                            <p
                                                onClick={() => {
                                                    onEdit('email', values?.email || profile.email, 'Email')
                                                }}
                                                className="hover:bg-blue-100 cursor-pointer min-h-[10px] min-w-[100px] border"
                                                style={{ textAlign: 'center', fontSize: parseInt(shopDetailFontSize) }}
                                            >
                                                {values?.email}
                                            </p>
                                            <p
                                                onClick={() => {
                                                    onEdit('phoneno', values?.phoneno || profile.phoneno, 'Phone No')
                                                }}
                                                className="hover:bg-blue-100 cursor-pointer min-h-[10px] min-w-[100px] border"
                                                style={{ textAlign: 'center', fontSize: parseInt(shopDetailFontSize) }}
                                            >
                                                {values?.phoneno}
                                            </p>
                                            <p
                                                onClick={() => {
                                                    onEdit('address', values?.address || profile.address, 'Address')
                                                }}
                                                className="hover:bg-blue-100 cursor-pointer min-h-[10px] min-w-[100px] border"
                                                style={{ textAlign: 'center', fontSize: parseInt(shopDetailFontSize) }}
                                            >
                                                {values?.address}
                                            </p>
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: headerPadding
                                            }}
                                            className="mb-2"
                                        >
                                            <div className="flex flex-row items-center">
                                                {values?.islogo && (
                                                    <img
                                                        src={
                                                            profile.profileimage
                                                                ? axios.defaults.baseURL + profile.profileimage
                                                                : I.profile
                                                        }
                                                        style={{
                                                            width: parseInt(values?.logosize),
                                                            height: parseInt(values?.logosize),
                                                        }}
                                                    />
                                                )}
                                                <p
                                                    className="hover:bg-blue-100 cursor-pointer min-h-[10px] min-w-[100px] border"
                                                    onClick={() => {
                                                        onEdit('shopname', values?.shopname || profile.shopname, 'Shop Name')
                                                    }}
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: parseInt(shopFontSize),
                                                        marginLeft: 5
                                                    }}
                                                >
                                                    {values?.shopname}
                                                </p>
                                            </div>
                                            <div>
                                                <p
                                                    className="hover:bg-blue-100 cursor-pointer min-h-[10px] min-w-[100px] border"
                                                    onClick={() => {
                                                        onEdit('email', values?.email || profile.email, 'Email')
                                                    }}
                                                    style={{ textAlign: 'left', fontSize: parseInt(shopDetailFontSize) }}
                                                >
                                                    {values?.email}
                                                </p>
                                                <p
                                                    className="hover:bg-blue-100 cursor-pointer min-h-[10px] border"
                                                    onClick={() => {
                                                        onEdit('phoneno', values?.phoneno || profile.phoneno, 'Phone No')
                                                    }}
                                                    style={{ textAlign: 'left', fontSize: parseInt(shopDetailFontSize) }}
                                                >
                                                    {values?.phoneno}
                                                </p>
                                                <p
                                                    className="hover:bg-blue-100 cursor-pointer min-h-[10px] border"
                                                    onClick={() => {
                                                        onEdit('address', values?.address || profile.address, 'Address')
                                                    }}
                                                    style={{ textAlign: 'left', fontSize: parseInt(shopDetailFontSize) }}
                                                >
                                                    {values?.address}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ padding: bodyPadding }}>
                                      {values?.isvoucherow &&   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <p
                                                className="hover:bg-blue-100 cursor-pointer min-h-[10px] border"
                                                onClick={() => {
                                                    onEdit('ReceiptNo', values?.ReceiptNo, 'Receipt No')
                                                }}
                                                style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}
                                            >
                                                {values?.ReceiptNo}:{' '}
                                            </p>
                                            <p style={{ fontSize: parseInt(fontsize) }}>{data?.voucherNumber}</p>
                                        </div>}
                                        {values?.iscustomerrow &&  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <p
                                                className="hover:bg-blue-100 cursor-pointer min-h-[10px] border"
                                                onClick={() => {
                                                    onEdit('CustomerName', values?.CustomerName, 'Customer Name')
                                                }}
                                                style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}
                                            >
                                                {values?.CustomerName}:{' '}
                                            </p>
                                            <p style={{ fontSize: parseInt(fontsize) }}>{data?.customerName}</p>
                                        </div>}
                                       {values?.isdaterow && <div
                                            style={{ display: 'flex', justifyContent: 'space-between' }}
                                            className="mb-"
                                        >
                                            <p
                                                className="hover:bg-blue-100 cursor-pointer min-h-[10px] border"
                                                onClick={() => {
                                                    onEdit('Date', values?.Date, 'Date')
                                                }}
                                                style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}
                                            >
                                                {values?.Date}:{' '}
                                            </p>
                                            <p style={{ fontSize: parseInt(fontsize) }}>
                                                {new Date(data?.date).toLocaleDateString()}
                                            </p>
                                        </div>}
                                        <div
                                            className="border w-full  bg-black"
                                            style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }}
                                        />
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginVertical: 5
                                            }}
                                        >
                                            {values?.isnocol && (
                                                <p
                                                    onClick={() => {
                                                        onEdit('No', values?.No, 'Number')
                                                    }}
                                                    className="hover:bg-blue-100 cursor-pointer min-h-[10px] border"
                                                    style={{
                                                        fontSize: parseInt(fontsize),
                                                        fontWeight: 'bold',
                                                        width: noWidth,
                                                        textAlign: 'left'
                                                    }}
                                                >
                                                    {values?.No || 'No'}
                                                </p>
                                            )}
                                            {values?.isproductcol && (
                                                <p
                                                    onClick={() => {
                                                        onEdit('ProductName', values?.ProductName, 'Product Name')
                                                    }}
                                                    className="hover:bg-blue-100 cursor-pointer min-h-[10px] border"
                                                    style={{
                                                        fontSize: parseInt(fontsize),
                                                        fontWeight: 'bold',
                                                        width: nameWidth,
                                                        textAlign: 'left'
                                                    }}
                                                >
                                                    {values?.ProductName}
                                                </p>
                                            )}
                                            {values?.isqtycol && (
                                                <p
                                                    onClick={() => {
                                                        onEdit('Qty', values?.Qty, 'Qty')
                                                    }}
                                                    className="hover:bg-blue-100 cursor-pointer min-h-[10px] border"
                                                    style={{
                                                        fontSize: parseInt(fontsize),
                                                        fontWeight: 'bold',
                                                        width: qtyWidth,
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {values?.Qty}
                                                </p>
                                            )}

                                            {values?.ispricecol && (
                                                <p
                                                    onClick={() => {
                                                        onEdit('Price', values?.Price, 'Price')
                                                    }}
                                                    className="hover:bg-blue-100 cursor-pointer min-h-[10px] border"
                                                    style={{
                                                        fontSize: parseInt(fontsize),
                                                        fontWeight: 'bold',
                                                        width: priceWidth,
                                                        textAlign: 'right'
                                                    }}
                                                >
                                                    {values?.Price}
                                                </p>
                                            )}
                                            {values?.istotalcol && <p
                                                onClick={() => {
                                                    onEdit('Total', values?.Total, 'Total')
                                                }}
                                                className="hover:bg-blue-100 cursor-pointer min-h-[10px] border"
                                                style={{
                                                    fontSize: parseInt(fontsize),
                                                    fontWeight: 'bold',
                                                    width: totalWidth,
                                                    textAlign: 'right'
                                                }}
                                            >
                                                {values?.Total}
                                            </p>}
                                        </div>

                                        {data?.sproduct?.map((item, index) => renderItem(item, index))}
                                        <div
                                            className="border w-full  bg-black"
                                            style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }}
                                        />
                                     {values?.istotalamountrow &&   <div
                                            className="my-1"
                                            style={{ display: 'flex', justifyContent: 'space-between' }}
                                        >
                                            <p
                                                onClick={() => {
                                                    onEdit('TotalAmount', values?.TotalAmount, 'Total Amount')
                                                }}
                                                className="hover:bg-blue-100 cursor-pointer min-h-[10px] border min-w-[30px]"
                                                style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}
                                            >
                                                {values?.TotalAmount}:{' '}
                                            </p>
                                            <p style={{ fontSize: parseInt(fontsize) }}>
                                                {numberWithCommas(data?.totalAmount)} Ks
                                            </p>
                                        </div>}
                                        {values?.istaxrow == false || data?.tax === '0' ? null : (
                                            <div
                                                className="my-1"
                                                style={{ display: 'flex', justifyContent: 'space-between' }}
                                            >
                                                <p
                                                    onClick={() => {
                                                        onEdit('Tax', values?.Tax, 'Tax')
                                                    }}
                                                    className="hover:bg-blue-100 cursor-pointer min-h-[10px] border min-w-[30px]"
                                                    style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}
                                                >
                                                    {values?.Tax}:{' '}
                                                </p>
                                                <p style={{ fontSize: parseInt(fontsize) }}>
                                                    {numberWithCommas(data?.tax)} %
                                                </p>
                                            </div>
                                        )}
                                        {values?.isdeliverychargesrow == false || data?.deliveryCharges === null || data?.deliveryCharges === '0' ? null : (
                                            <div
                                                className="my-1"
                                                style={{ display: 'flex', justifyContent: 'space-between' }}
                                            >
                                                <p
                                                    onClick={() => {
                                                        onEdit('DeliveryCharges', values?.DeliveryCharges, 'Delivery Charges')
                                                    }}
                                                    className="hover:bg-blue-100 cursor-pointer min-h-[10px] border min-w-[30px]"
                                                    style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}
                                                >
                                                    {values?.DeliveryCharges}:{' '}
                                                </p>
                                                <p style={{ fontSize: parseInt(fontsize) }}>
                                                    {numberWithCommas(data?.deliveryCharges)} Ks
                                                </p>
                                            </div>
                                        )}
                                        {values?.isdiscountrow == false|| data?.discount === '0' ? null : (
                                            <>
                                                <div
                                                    className="border w-full  bg-black"
                                                    style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }}
                                                />
                                                <div
                                                    className="my-1"
                                                    style={{ display: 'flex', justifyContent: 'space-between' }}
                                                >
                                                    <p
                                                        onClick={() => {
                                                            onEdit('Discount', values?.Discount, 'Discount')
                                                        }}
                                                        className="hover:bg-blue-100 cursor-pointer min-h-[10px] border min-w-[30px]"
                                                        style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}
                                                    >
                                                        {values?.Discount}:{' '}
                                                    </p>
                                                    <p style={{ fontSize: parseInt(fontsize) }}>
                                                        {data?.discount} {data?.isDiscountAmount ? 'Ks' : '%'}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                        <div
                                            className="border w-full  bg-black"
                                            style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }}
                                        />
                                     {values?.isgrandtotalrow &&   <div
                                            className="my-1"
                                            style={{ display: 'flex', justifyContent: 'space-between' }}
                                        >
                                            <p
                                                onClick={() => {
                                                    onEdit('GrandTotal', values?.GrandTotal, 'GrandTotal')
                                                }}
                                                className="hover:bg-blue-100 cursor-pointer min-h-[10px] border min-w-[30px]"
                                                style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}
                                            >
                                                {values?.GrandTotal}:{' '}
                                            </p>
                                            <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>
                                                {numberWithCommas(parseInt(data?.grandtotal))} Ks
                                            </p>
                                        </div>}
                                        {parseInt(data?.customer_payment, 10) ===
                                            parseInt(data?.grandtotal, 10) ? null : (
                                            <>
                                                <div
                                                    className="border w-full  bg-black"
                                                    style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }}
                                                />
                                                {values?.ispaymentamountrow && <div
                                                    className="my-1"
                                                    style={{ display: 'flex', justifyContent: 'space-between' }}
                                                >
                                                    <p
                                                        onClick={() => {
                                                            onEdit('PaymentAmount', values?.PaymentAmount, 'Payment Amount')
                                                        }}
                                                        className="hover:bg-blue-100 cursor-pointer min-h-[10px] border min-w-[30px]"
                                                        style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}
                                                    >
                                                        {values?.PaymentAmount}:{' '}
                                                    </p>
                                                    <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>
                                                        {numberWithCommas(parseInt(data?.customer_payment))} Ks
                                                    </p>
                                                </div>}
                                                <div
                                                    className="border w-full  bg-black"
                                                    style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }}
                                                />

                                               {values?.isremainingamountrow && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <p
                                                        onClick={() => {
                                                            onEdit('RemainingAmount', values?.RemainingAmount, 'Remaining Amount')
                                                        }}
                                                        className="hover:bg-blue-100 cursor-pointer min-h-[10px] border min-w-[30px]"
                                                        style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}
                                                    >
                                                        {values?.RemainingAmount} :{' '}
                                                    </p>
                                                    <p style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}>
                                                        {numberWithCommas(
                                                            parseInt(data?.grandtotal, 10) - parseInt(data?.customer_payment, 10)
                                                        )}{' '}
                                                        Ks
                                                    </p>
                                                </div>}
                                            </>
                                        )}

                                        {values?.isdescriptionrow == false || data?.description === '' || data?.description === '#cashier' ? null : (
                                            <>
                                                <div
                                                    className="border w-full  bg-black"
                                                    style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }}
                                                />

                                                <div
                                                    style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}
                                                >
                                                    <p
                                                        onClick={() => {
                                                            onEdit('Description', values?.Description, 'Description')
                                                        }}
                                                        className="hover:bg-blue-100 cursor-pointer min-h-[10px] border min-w-[30px]"
                                                        style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}
                                                    >
                                                        {values?.Description}:{' '}
                                                    </p>
                                                    <p style={{ fontSize: parseInt(fontsize) }}>
                                                        {data?.description?.replace('#cashier', '')}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                     {values?.isfootertextrow &&   <p
                                            onClick={() => {
                                                onEdit('FooterText', values?.FooterText, 'Footer Text')
                                            }}
                                            className="hover:bg-blue-100 cursor-pointer min-h-[10px] border min-w-[30px]"
                                            style={{
                                                textAlign: 'center',
                                                marginTop: '10px',
                                                fontSize: parseInt(fontsize)
                                            }}
                                        >
                                            {values?.FooterText}
                                        </p>}
                                    </div>
                                </div>
                            </TransformComponent>
                        </TransformWrapper>
                    </div>
                    <div
                        className="col-span-1 w-full  border rounded shadow-md flex flex-col overflow-auto select-none"
                        style={{
                            height: 'calc(100vh - 110px)'
                        }}
                    >
                        {isEdit && (
                            <div className="flex flex-col p-2 bg-slate-100">
                                <h1 className="text-md font-bold">Properties</h1>
                                <h1 className="text-sm mt-3">{edittitle}</h1>
                                <input
                                    placeholder={edittitle}
                                    ref={focusref}
                                    type="text"
                                    value={values?.[`${editname}`]}
                                    onChange={(e) => ChangeValue(e.target.value, editname)}
                                    className="border rounded p-1 mt-1"
                                />
                            </div>
                        )}
                        <hr />
                        <div className="flex flex-col p-2 bg-slate-100 mt-2">
                            <h1 className="text-md font-bold">Table Columns</h1>
                            <hr />
                            {/* checkbox of No, ProductName, Qty, Price, Total */}
                            <div className="flex flex-row items-center mt-2">
                                <input
                                    type="checkbox"
                                    id="chkno"
                                    checked={values?.isnocol}
                                    onChange={(e) => ChangeValue(e.target.checked, 'isnocol')}
                                    className="border rounded p-1 mr-2"
                                />
                                <label className="text-sm" htmlFor="chkno">
                                    No
                                </label>

                                <input
                                    type="checkbox"
                                    id="chkpdname"
                                    checked={values?.isproductcol}
                                    onChange={(e) => ChangeValue(e.target.checked, 'isproductcol')}
                                    className="border rounded p-1 mr-2 ml-2"
                                />
                                <label className="text-sm" htmlFor="chkpdname">
                                    Product Name
                                </label>
                            </div>

                            <div className="flex flex-row items-center mt-2">
                                <input
                                    type="checkbox"
                                    id="chkqty"
                                    checked={values?.isqtycol}
                                    onChange={(e) => ChangeValue(e.target.checked, 'isqtycol')}
                                    className="border rounded p-1 mr-2 "
                                />
                                <label className="text-sm" htmlFor="chkqty">
                                    Qty
                                </label>

                                <input
                                    type="checkbox"
                                    id="chkprice"
                                    checked={values?.ispricecol}
                                    onChange={(e) => ChangeValue(e.target.checked, 'ispricecol')}
                                    className="border rounded p-1 mr-2 ml-2"
                                />
                                <label className="text-sm" htmlFor="chkprice">
                                    Price
                                </label>

                                <input
                                    type="checkbox"
                                    id="chktotal"
                                    checked={values?.istotalcol}
                                    onChange={(e) => ChangeValue(e.target.checked, 'istotalcol')}
                                    className="border rounded p-1 mr-2 ml-2"
                                />
                                <label className="text-sm" htmlFor="chktotal">
                                    Total
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col p-2 bg-slate-100 mt-2">
                            <h1 className="text-md font-bold">Table Rows</h1>
                            <hr />
                            {/* checkbox of No, ProductName, Qty, Price, Total */}
                            <div className=" items-center mt-2">
                                <input
                                    type="checkbox"
                                    id="chkvoucherno"
                                    checked={values?.isvoucherow}
                                    onChange={(e) => ChangeValue(e.target.checked, 'isvoucherow')}
                                    className="border rounded p-1 mr-2 ml-2"
                                />
                                <label className="text-sm" htmlFor="chkvoucherno">
                                    Voucher No
                                </label>

                                <input
                                    type="checkbox"
                                    id="chkcustomername"
                                    checked={values?.iscustomerrow}
                                    onChange={(e) => ChangeValue(e.target.checked, 'iscustomerrow')}
                                    className="border rounded p-1 mr-2 ml-2"
                                />
                                <label className="text-sm" htmlFor="chkcustomername">
                                    Customer Name
                                </label>


                            </div>
                            <div className='flex flex-row items-center mt-2'>
                                <input
                                    type="checkbox"
                                    id="chkdate"
                                    checked={values?.isdaterow}
                                    onChange={(e) => ChangeValue(e.target.checked, 'isdaterow')}
                                    className="border rounded p-1 mr-2 ml-2"
                                />
                                <label className="text-sm" htmlFor="chkdate">
                                    Date
                                </label>

                                <input
                                    type="checkbox"
                                    id="chktotalamount"
                                    checked={values?.istotalamountrow}
                                    onChange={(e) => ChangeValue(e.target.checked, 'istotalamountrow')}
                                    className="border rounded p-1 mr-2 ml-2"
                                />
                                <label className="text-sm" htmlFor="chktotalamount">
                                    Total Amount
                                </label>


                            </div>
                            <div className='flex flex-row items-center mt-2'>
                                <input
                                    type="checkbox"
                                    id="chktax"
                                    checked={values?.istaxrow}
                                    onChange={(e) => ChangeValue(e.target.checked, 'istaxrow')}
                                    className="border rounded p-1 mr-2 ml-2"
                                />
                                <label className="text-sm" htmlFor="chktax">
                                    Tax
                                </label>

                                <input
                                    type="checkbox"
                                    id="chkdeliverycharges"
                                    checked={values?.isdeliverychargesrow}
                                    onChange={(e) => ChangeValue(e.target.checked, 'isdeliverychargesrow')}
                                    className="border rounded p-1 mr-2 ml-2"
                                />
                                <label className="text-sm" htmlFor="chkdeliverycharges">
                                    Delivery Charges
                                </label>

                            </div>
                            <div className='flex flex-row items-center mt-2'>

                                <input
                                    type="checkbox"
                                    id="chkdiscount"
                                    checked={values?.isdiscountrow}
                                    onChange={(e) => ChangeValue(e.target.checked, 'isdiscountrow')}
                                    className="border rounded p-1 mr-2 ml-2"
                                />
                                <label className="text-sm" htmlFor="chkdiscount">
                                    Discount
                                </label>

                                <input
                                    type="checkbox"
                                    id="chkgrandtotal"
                                    checked={values?.isgrandtotalrow}
                                    onChange={(e) => ChangeValue(e.target.checked, 'isgrandtotalrow')}
                                    className="border rounded p-1 mr-2 ml-2"
                                />
                                <label className="text-sm" htmlFor="chkgrandtotal">
                                    Grand Total
                                </label>

                            </div>
                            <div className='flex flex-row items-center mt-2'>

                                <input
                                    type="checkbox"
                                    id="chkpaymentamount"
                                    checked={values?.ispaymentamountrow}
                                    onChange={(e) => ChangeValue(e.target.checked, 'ispaymentamountrow')}
                                    className="border rounded p-1 mr-2 ml-2"
                                />
                                <label className="text-sm" htmlFor="chkpaymentamount">
                                    Payment Amount
                                </label>

                                <input
                                    type="checkbox"
                                    id="chkremainingamount"
                                    checked={values?.isremainingamountrow}
                                    onChange={(e) => ChangeValue(e.target.checked, 'isremainingamountrow')}
                                    className="border rounded p-1 mr-2 ml-2"
                                />
                                <label className="text-sm" htmlFor="chkremainingamount">
                                    Remaining Amount
                                </label>

                            </div>
                            <div className='flex flex-row items-center mt-2'>
                                <input
                                    type="checkbox"
                                    id="chkdescription"
                                    checked={values?.isdescriptionrow}
                                    onChange={(e) => ChangeValue(e.target.checked, 'isdescriptionrow')}
                                    className="border rounded p-1 mr-2 ml-2"
                                />
                                <label className="text-sm" htmlFor="chkdescription">
                                    Description
                                </label>

                                <input
                                    type="checkbox"
                                    id="chkfootertext"
                                    checked={values?.isfootertextrow}
                                    onChange={(e) => ChangeValue(e.target.checked, 'isfootertextrow')}
                                    className="border rounded p-1 mr-2 ml-2"
                                />
                                <label className="text-sm" htmlFor="chkfootertext">
                                    Footer Text
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomVoucherEditor

const heightofA4 = (width = 2480) => {
    console.log(width * 1.414, 'height of Aa44')
    return width * 1.414
}

const heightofA5 = (width = 2480) => {
    console.log(width * 1.414, 'height of A5')
    return width * 1.414
}
