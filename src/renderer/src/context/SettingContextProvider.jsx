import react, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContextProvider'
import { useQuery } from 'react-query'
import { getCategorys } from '../server/api'

const SettingDataContext = createContext()

const SettingDataProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    language: 'mm',
    discount: 'percent',
    lessthan: 10,
    expireshow: 7,
    showimage: false,
    printerName: 'POS-58-Series',
    paperWidth: 500,
    paper: '58',
    footertext: 'Thank For You Shopping',
    printSilent: false,
    enableCustomVoucher: false
  })

  //get settings data from localstorage
  useEffect(() => {
    const values_old = localStorage.getItem('settings')
    if (values_old == 'null' || values_old == null || values_old == undefined || values_old == 'undefined' || values_old == '' || values_old?.length < 0) {
      localStorage.setItem('settings', JSON.stringify(settings))
    }
    if (
      values_old !== 'null' ||
      values_old !== null ||
      values_old !== undefined ||
      values_old !== 'undefined' ||
      values_old !== '' ||
      values_old?.length >= 0
    ) {
      setSettings(JSON.parse(values_old))
      console.log('old settings', values_old)
    } else {
      localStorage.setItem('settings', JSON.stringify(settings))
    }
  }, [])

  const ChangeSettings = (value, name) => {
    localStorage.setItem('settings', JSON.stringify({ ...settings, [name]: value }))
    console.log('new settings', settings, value, name)
    setSettings({ ...settings, [name]: value })
  }

  return (
    <SettingDataContext.Provider value={{ settings, ChangeSettings }}>
      {children}
    </SettingDataContext.Provider>
  )
}

export const useSetting = () => useContext(SettingDataContext)

export default SettingDataProvider
