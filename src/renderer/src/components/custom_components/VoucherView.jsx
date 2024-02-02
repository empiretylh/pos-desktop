import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContextProvider';
import axios from 'axios';
import numberWithCommas from './NumberWithCommas';
import { toPng } from 'html-to-image';
import { useSetting } from '../../context/SettingContextProvider';
const { ipcRenderer } = window.electron
import {IMAGE} from '../../config/image'

const VoucherView = ({ data, print, setPrint }) => {
    const { t } = useTranslation();
    const viewRef = useRef(null);

    const { user_data, profiledata: profile } = useAuth();

    const { settings } = useSetting();

    const [paperWidth, setPaperWidth] = useState(settings?.paperwidth || 500);
    const [paper, setPaper] = useState(settings?.paper || '58');

    useEffect(() => {
        setPaperWidth(settings?.paperwidth || 500);
        setPaper(settings?.paper || '58')
        
    }, [settings])

    const nameWidth = 200;
    const qtyWidth = 50;
    const priceWidth = 100;
    const totalWidth = 100;

    const renderItem = (item) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginVertical: 5 }}>
                <p style={{ fontSize: 18, width: nameWidth, fontWeight: 'bold' }}>{item.name}</p>
                <p style={{ fontSize: 18, width: qtyWidth, textAlign: 'center' }}>{item.qty}</p>
                <p style={{ fontSize: 18, width: priceWidth, textAlign: 'right' }}>{numberWithCommas(item.price)}</p>
                <p style={{ fontSize: 18, width: totalWidth, textAlign: 'right' }}>{numberWithCommas(parseInt(item.price) * parseInt(item.qty))}</p>
            </div>
        )
    };

    const printOptions = {
        printerName : settings?.printerName,
    }
    const snapshot = () => {
        toPng(viewRef.current, { pixelRatio: 5 }).then(
            (dataurl) => {

                const img = new Image();
                img.onload = function () {
                    const aspectRatio = this.width / this.height;
                    const printableWidth = paperWidth;
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

    const micronsToPixel = (microns, dpi) => {
        return microns * (dpi / 25.4) / 1000;
    };
    
    useEffect(() => {
        if (print) {
            snapshot();
            setPrint(false);
        }
        console.log('Printing')

    }, [print])

    //if user press esc setPrint to false

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                setPrint(false);
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
        
    }, []);



    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${print ? 'scale-100' : ''}`}
            style={{
                zIndex: 999999
            }}
        >
            <div className="bg-white rounded-lg">
                <div ref={viewRef} style={{ backgroundColor: 'white', padding: 0, width: '300px', height: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className='mb-2'>
                        <img
                            src={
                                profile?.profileimage
                                    ? axios.defaults.baseURL + profile.profileimage
                                    : IMAGE.app_icon
                            }
                            style={{ width: 90, height: 90, alignSelf: 'center' }}
                        />
                        <p style={{ fontWeight: 'bold' }}>{profile?.name}</p>
                        <p>{profile?.email}</p>
                        <p style={{ textAlign: 'center' }}>{profile?.phoneno}</p>
                        <p style={{ textAlign: 'center' }}>{profile?.address}</p>
                    </div>
                    <div className="border w-full h-[3px] bg-black" />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 16, fontWeight: 'bold' }}>
                            {t('Receipt Number')}:{' '}
                        </p>
                        <p style={{ fontSize: 16 }}>{data?.voucherNumber}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 16, fontWeight: 'bold' }}>
                            {t('Customer Name')}:{' '}
                        </p>
                        <p style={{ fontSize: 16 }}>{data?.customerName}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }} className='mb-2'>
                        <p style={{ fontSize: 16, fontWeight: 'bold' }}>{t('Date')}:{' '}</p>
                        <p style={{ fontSize: 16 }}>{new Date(data?.date).toLocaleDateString()}</p>
                    </div>
                    <div className="border w-full h-[3px] bg-black" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginVertical: 5 }}>
                        <p style={{ fontSize: 16, fontWeight: 'bold', width: nameWidth }}>{t('Product Name')}</p>
                        <p style={{ fontSize: 16, fontWeight: 'bold', width: qtyWidth }}>Qty</p>
                        <p style={{ fontSize: 16, fontWeight: 'bold', width: priceWidth, textAlign: 'right' }}>Price</p>
                        <p style={{ fontSize: 16, fontWeight: 'bold', width: totalWidth, textAlign: 'right' }}>Total</p>
                    </div>
                   
                    {data?.sproduct?.map(item => renderItem(item))}
                    <div className="border w-full h-[3px] bg-black mt-2" />
                    <div className='my-2' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 16, fontWeight: 'bold' }}>{t('Total Amount')}:{' '}</p>
                        <p style={{ fontSize: 16 }}>{numberWithCommas(data?.totalAmount)} Ks</p>
                    </div> 
                    {data?.tax === '0' ? null : (
                        <div className="my-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={{ fontSize: 16, fontWeight: 'bold' }}>{t('Tax')}:{' '}</p>
                            <p style={{ fontSize: 16 }}>{numberWithCommas(data?.tax)} %</p>
                        </div>
                    )}
                    {data?.deliveryCharges === null || data?.deliveryCharges === '0' ? null : (
                        <div className="my-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={{ fontSize: 16, fontWeight: 'bold' }}>{t('Delivery Charges')}:{' '}</p>
                            <p style={{ fontSize: 16 }}>{numberWithCommas(data?.deliveryCharges)} Ks</p>
                        </div>
                    )}
                    {data?.discount === '0' ? null : (
                        <>
                            <div className="border w-full h-[3px] bg-black" />
                            <div className="my-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <p style={{ fontSize: 16, fontWeight: 'bold' }}>{t('Discount')}:{' '}</p>
                                <p style={{ fontSize: 16 }}>{data?.discount} {data?.isDiscountAmount ? 'Ks' : '%'}</p>
                            </div>
                        </>
                    )}
                    <div className="border w-full h-[3px] bg-black" />
                    <div className="my-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 16, fontWeight: 'bold' }}>{t('Grand Total')}:{' '}</p>
                        <p style={{ fontSize: 16, fontWeight: 'bold' }}>{numberWithCommas(parseInt(data?.grandtotal))} Ks</p>
                    </div>
                    {parseInt(data?.customer_payment, 10) === parseInt(data?.grandtotal, 10) ? null : (
                        <>
                            <div className="border w-full h-[3px] bg-black" />
                            <div className="my-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <p style={{ fontSize: 16, fontWeight: 'bold' }}>Payment Amount:{' '}</p>
                                <p style={{ fontSize: 16, fontWeight: 'bold' }}>{numberWithCommas(parseInt(data?.customer_payment))} Ks</p>
                            </div>
                            <div className="border w-full h-[3px] bg-black" />


                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Remaining Amount: </p>
                                <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                    {numberWithCommas(parseInt(data?.grandtotal, 10) - parseInt(data?.customer_payment, 10))} Ks
                                </p>
                            </div>
                        </>
                    )}


                    {data?.description === '' || data?.description === '#cashier' ? null : (
                        <>
                            <hr />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{t('Description')}: </p>
                                <p style={{ fontSize: '16px' }}>{data?.description?.replace('#cashier', '')}</p>
                            </div>
                        </>
                    )}
                    <p style={{ textAlign: 'center', marginTop: '10px' }}>{settings?.footertext}</p>
               
                </div>
            </div>
        </div>
    )
}

export default VoucherView;


// const data = [
//     {
//         type: 'image',
//         url: 'https://randomuser.me/api/portraits/men/43.jpg',     // file path
//         position: 'center',                                  // position of image: 'left' | 'center' | 'right'
//         width: '160px',                                           // width of image in px; default: auto
//         height: '60px',                                          // width of image in px; default: 50 or '50px'
//     },{
//         type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
//         value: 'SAMPLE HEADING',
//         style: {fontWeight: "700", textAlign: 'center', fontSize: "24px"}
//     },{
//         type: 'text',                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
//         value: 'Secondary text',
//         style: {textDecoration: "underline", fontSize: "10px", textAlign: "center", color: "red"}
//     },{
//         type: 'barCode',
//         value: '023456789010',
//         height: 40,                     // height of barcode, applicable only to bar and QR codes
//         width: 2,                       // width of barcode, applicable only to bar and QR codes
//         displayValue: true,             // Display value below barcode
//         fontsize: 12,
//     },{
//         type: 'qrCode',
//         value: 'https://github.com/Hubertformin/electron-pos-printer',
//         height: 55,
//         width: 55,
//         style: { margin: '10 20px 20 20px' }
//     },{
//         type: 'table',
//         // style the table
//         style: {border: '1px solid #ddd'},
//         // list of the columns to be rendered in the table header
//         tableHeader: ['Animal', 'Age'],
//         // multi dimensional array depicting the rows and columns of the table body
//         tableBody: [
//             ['Cat', 2],
//             ['Dog', 4],
//             ['Horse', 12],
//             ['Pig', 4],
//         ],
//         // list of columns to be rendered in the table footer
//         tableFooter: ['Animal', 'Age'],
//         // custom style for the table header
//         tableHeaderStyle: { backgroundColor: '#000', color: 'white'},
//         // custom style for the table body
//         tableBodyStyle: {'border': '0.5px solid #ddd'},
//         // custom style for the table footer
//         tableFooterStyle: {backgroundColor: '#000', color: 'white'},
//     },{
//         type: 'table',
//         style: {border: '1px solid #ddd'},             // style the table
//         // list of the columns to be rendered in the table header
//         tableHeader: [{type: 'text', value: 'People'}, {type: 'image', path: path.join(__dirname, 'icons/animal.png')}],
//         // multi-dimensional array depicting the rows and columns of the table body
//         tableBody: [
//             [{type: 'text', value: 'Marcus'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/43.jpg'}],
//             [{type: 'text', value: 'Boris'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/41.jpg'}],
//             [{type: 'text', value: 'Andrew'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/23.jpg'}],
//             [{type: 'text', value: 'Tyresse'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/53.jpg'}],
//         ],
//         // list of columns to be rendered in the table footer
//         tableFooter: [{type: 'text', value: 'People'}, 'Image'],
//         // custom style for the table header
//         tableHeaderStyle: { backgroundColor: 'red', color: 'white'},
//         // custom style for the table body
//         tableBodyStyle: {'border': '0.5px solid #ddd'},
//         // custom style for the table footer
//         tableFooterStyle: {backgroundColor: '#000', color: 'white'},
//     },
// ]