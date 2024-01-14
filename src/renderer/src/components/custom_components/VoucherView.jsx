import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContextProvider';
import axios from 'axios';
import numberWithCommas from './NumberWithCommas';
import {toPng} from 'html-to-image';
const { ipcRenderer } = window.electron

const VoucherView = ({ data }) => {
    const { t } = useTranslation();
    const viewRef = useRef(null);

    const { user_data, profiledata: profile } = useAuth();

    const nameWidth = 200;
    const qtyWidth = 50;
    const priceWidth = 100;
    const totalWidth = 100;

    const renderItem = (item) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginVertical: 5 }}>
                <p style={{ fontSize: 18, width: nameWidth, fontWeight: 'bold' }}>{item.name}</p>
                <p style={{ fontSize: 18, width: qtyWidth, textAlign:'center' }}>{item.qty}</p>
                <p style={{ fontSize: 18, width: priceWidth, textAlign: 'right' }}>{numberWithCommas(item.price)}</p>
                <p style={{ fontSize: 18, width: totalWidth, textAlign: 'right' }}>{numberWithCommas(parseInt(item.price) * parseInt(item.qty))}</p>
            </div>
        )
    };

    
    const options = {
        margin: '0 0 0 0',
        copies: 1,
        printerName: 'POS-58-Series',
        timeOutPerLine: 400,
        pageSize: { height: 301000, width: 71000 } // page size
      }
  

    const snapshot = () => {
       toPng(viewRef.current,{pixelRatio:10}).then(
        (dataurl)=>{
            // const link = document.createElement('a');
            // link.download = 'my-image-name.jpeg';
            // link.href = dataurl;
            // link.click();
            ipcRenderer.invoke('print-image', { image: dataurl, options : options, width_img:'200px', height_img:'auto' });
        }
       )
    }


    return (
        <>

       
        <div ref={viewRef} style={{ backgroundColor: 'white', padding:0, width:'300px'}}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className='mb-2'>
                <img
                    src={
                        profile.profileimage
                            ? axios.defaults.baseURL + profile.profileimage
                            : I.profile
                    }
                    style={{ width: 90, height: 90, alignSelf: 'center' }}
                />
                <p style={{ fontWeight: 'bold' }}>{profile.name}</p>
                <p>{profile.email}</p>
                <p style={{ textAlign: 'center' }}>{profile.phoneno}</p>
                <p style={{ textAlign: 'center' }}>{profile.address}</p>
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
            {/* You need to convert the FlatList to a map function */}
            {data?.sproduct.map(item => renderItem(item))}
            <div className="border w-full h-[3px] bg-black mt-2"  />
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
                <div className="border w-full h-[3px] bg-black"/>
                    <div className="my-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 16, fontWeight: 'bold' }}>Payment Amount:{' '}</p>
                        <p style={{ fontSize: 16, fontWeight: 'bold' }}>{numberWithCommas(parseInt(data?.customer_payment))} Ks</p>
                    </div>
                    <div className="border w-full h-[3px] bg-black" />
                </>
            )}
        </div>
        <button onClick={()=>{
            snapshot();
        }}>
            Print
        </button>
        </>
    )
}

export default VoucherView;