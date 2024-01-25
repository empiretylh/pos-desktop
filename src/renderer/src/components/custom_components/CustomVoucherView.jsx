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
const { ipcRenderer } = window.electron
import { toPng } from 'html-to-image';

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

const CustomVoucher = ({  print,  setPrint, data = exampleData, customerid }) => {
    const { showNoti, showInfo } = useAlertShow()
    const viewRef = useRef(null)

    const { user_data, profiledata: profile } = useAuth()

    const { settings, ChangeSettings } = useSetting()
    const { values, ChangeValue } = useCustomVoucher()

    const [paperWidth, setPaperWidth] = useState(settings?.paperwidth || 500)
    const [paper, setPaper] = useState(settings?.paper || '58')


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
            setPrint(false)
        }
    })

    const printOptions = {
        printerName : settings?.printerName,
    }
    const snapshot = () => {
        toPng(viewRef.current, { pixelRatio: 5 }).then(
            (dataurl) => {

                const img = new Image();
                img.onload = function () {
                    const aspectRatio = this.width / this.height;
                    const printableWidth = 790;
                    const printableHeight = printableWidth / aspectRatio;
                    ipcRenderer.invoke('print-image', {
                        image: dataurl,
                        options : printOptions,
                        width_img: printableWidth,
                        height_img: printableHeight,
                        paper : paper,
                    });
                }
                img.src = dataurl;

            }
        )
    }

    useEffect(() => {
        if (print) {
            snapshot();
            setPrint(false);
        }
        console.log('Printing')

    }, [print])





    const [shopFontSize, setShopFontSize] = useState(values?.shopfontsize || 10)
    const [shopDetailFontSize, setShopDetailFontSize] = useState(values?.shopdetailfontsize || 8)
    const [fontsize, setFontSize] = useState(values?.fontsize || 5)
    const [lineheight, setlineHeight] = useState(values?.lineheight || 0.1)
    const [lineMt, setlineMt] = useState(values?.linemt || 0.5)
    const [bodyPadding, setBodyPadding] = useState(values?.bodypadding || '20px 20px 20px 20px')
    const [padding, setPadding] = useState(values?.padding || '10px 10px 10px 10px')
    const [itemFontsize, setItemFontSize] = useState(values?.itemFontsize || 6)
    const [headerPadding, setHeaderPadding] = useState(values?.headerpadding || '20px 20px 0px 20px')

   
    const onEdit = (name, value, title) => {

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
            className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${print ? 'scale-100' : ''
                }`}
        >
            <div className="bg-white rounded-lg flex flex-col relative ">
                <div
                    ref={viewRef}
                    style={{
                        backgroundColor: 'white',
                        width: settings?.paperWidth,
                        height: settings?.paper == 'A4' ? heightofA4(settings?.paperWidth) : heightofA5(settings?.paperWidth),
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
                                        alignSelf: 'center'
                                    }}
                                />
                            )}
                            <p
                               
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
                               
                                style={{ textAlign: 'center', fontSize: parseInt(shopDetailFontSize) }}
                            >
                                {values?.email}
                            </p>
                            <p
                                onClick={() => {
                                    onEdit('phoneno', values?.phoneno || profile.phoneno, 'Phone No')
                                }}
                               
                                style={{ textAlign: 'center', fontSize: parseInt(shopDetailFontSize) }}
                            >
                                {values?.phoneno}
                            </p>
                            <p
                                onClick={() => {
                                    onEdit('address', values?.address || profile.address, 'Address')
                                }}
                               
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
                                            alignSelf: 'center'
                                        }}
                                    />
                                )}
                                <p
                                   
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
                                   
                                    onClick={() => {
                                        onEdit('email', values?.email || profile.email, 'Email')
                                    }}
                                    style={{ textAlign: 'left', fontSize: parseInt(shopDetailFontSize) }}
                                >
                                    {values?.email}
                                </p>
                                <p
                                   
                                    onClick={() => {
                                        onEdit('phoneno', values?.phoneno || profile.phoneno, 'Phone No')
                                    }}
                                    style={{ textAlign: 'left', fontSize: parseInt(shopDetailFontSize) }}
                                >
                                    {values?.phoneno}
                                </p>
                                <p
                                   
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
                        {values?.isvoucherow && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p
                               
                                onClick={() => {
                                    onEdit('ReceiptNo', values?.ReceiptNo, 'Receipt No')
                                }}
                                style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}
                            >
                                {values?.ReceiptNo}:{' '}
                            </p>
                            <p style={{ fontSize: parseInt(fontsize) }}>{data?.voucherNumber}</p>
                        </div>}
                        {values?.iscustomerrow && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p
                               
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
                        <div
                            className="border w-full  bg-black mb-1"
                            style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }}
                        />

                        {data?.sproduct?.map((item, index) => renderItem(item, index))}
                        <div
                            className="border w-full  bg-black"
                            style={{ height: parseFloat(lineheight), marginTop: parseFloat(lineMt) }}
                        />
                        {values?.istotalamountrow && <div
                            className="my-1"
                            style={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                            <p
                                onClick={() => {
                                    onEdit('TotalAmount', values?.TotalAmount, 'Total Amount')
                                }}
                               
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
                                   
                                    style={{ fontSize: parseInt(fontsize), fontWeight: 'bold' }}
                                >
                                    {values?.DeliveryCharges}:{' '}
                                </p>
                                <p style={{ fontSize: parseInt(fontsize) }}>
                                    {numberWithCommas(data?.deliveryCharges)} Ks
                                </p>
                            </div>
                        )}
                        {values?.isdiscountrow == false || data?.discount === '0' ? null : (
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
                        {values?.isgrandtotalrow && <div
                            className="my-1"
                            style={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                            <p
                                onClick={() => {
                                    onEdit('GrandTotal', values?.GrandTotal, 'GrandTotal')
                                }}
                               
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
                        {values?.isfootertextrow && <p
                            onClick={() => {
                                onEdit('FooterText', values?.FooterText, 'Footer Text')
                            }}
                           
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
            </div>
        </div >
    )
}

export default CustomVoucher

const heightofA4 = (width = 2480) => {
    console.log(width * 1.414, 'height of Aa44')
    return width * 1.414
}

const heightofA5 = (width = 2480) => {
    console.log(width * 1.414, 'height of A5')
    return width * 1.414
}
