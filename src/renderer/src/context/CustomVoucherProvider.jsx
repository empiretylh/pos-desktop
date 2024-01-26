import react, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContextProvider'
import { useQuery } from 'react-query'
import { getCategorys } from '../server/api'

const CustomVoucherDataContext = createContext()

const CustomVoucherDataProvider = ({ children }) => {
  const [values, setValues] = useState({
    logoalign: 'center', // left, center
    logosize: 100,
    islogo: true,
    shopname: 'Shop Name',
    address: 'Address',
    phone: 'Phone',
    email: 'email',

    No: 'No',
    ReceiptNo: 'Receipt No',
    CustomerName: 'Customer Name',
    Date: 'Date',
    ProductName: 'Product Name',
    Qty: 'Qty',
    Price: 'Price',
    Total: 'Total',
    TotalAmount: 'Total Amount',
    Tax: 'Tax',
    DeliveryCharges: 'Delivery Charges',
    Discount: 'Discount',
    GrandTotal: 'Grand Total',
    PaymentAmount: 'Payment Amount',
    RemainingAmount: 'Remaining Amount',
    Description: 'Description',
    FooterText: 'Thank For You Shopping',

    shopfontsize: 10,
    shopdetailfontsize: 8,
    fontsize: 5,
    lineheight: 0.1,
    linemt: 0.5,
    bodypadding: '0px 20px 20px 20px',
    padding: '0px 0px 0px 0px',
    itemFontsize: 6,
    headerpadding: '0px 0px 0px 0px',

    isnocol: true,
    isprodcutcol: true,
    isqtycol: true,
    ispricecol: true,
    istotalcol: true,

    isvoucherrow: true,
    iscustomerrow: true,
    isdaterow: true,
    istotalamountrow: true,
    istaxrow: true,
    isdeliverychargesrow: true,
    isdiscountrow: true,
    isgrandtotalrow: true,
    ispaymentamountrow: true,
    isremainingamountrow: true,
    isdescriptionrow: true,
    isfootertextrow: true
  })

  //get settings data from localstorage

  useEffect(() => {
    const values_old = localStorage.getItem('customvouchervalue')

    if (values_old == 'null' || values_old == null || values_old == undefined) {
      localStorage.setItem('customvouchervalue', JSON.stringify(values))
    }

    if (
      values_old !== 'null' ||
      values_old !== null ||
      values_old !== undefined ||
      values_old !== 'undefined' ||
      values_old !== '' ||
      values_old?.length >= 0
    ) {
      try {
        setValues(JSON.parse(values_old))
      } catch (error) {
        console.error('Error parsing JSON from localStorage:', error)
      }
    } else {
      localStorage.setItem('customvouchervalue', JSON.stringify(values))
    }
  }, [])

  const ChangeValue = (value, name) => {
    localStorage.setItem('customvouchervalue', JSON.stringify({ ...values, [name]: value }))
    setValues({ ...values, [name]: value })
  }

  return (
    <CustomVoucherDataContext.Provider value={{ values, ChangeValue }}>
      {children}
    </CustomVoucherDataContext.Provider>
  )
}

export const useCustomVoucher = () => useContext(CustomVoucherDataContext)

export default CustomVoucherDataProvider
