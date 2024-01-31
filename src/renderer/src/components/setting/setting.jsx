import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { APPNAME } from '../../config/config'
import { IMAGE } from '../../config/image'
import { useAuth } from '../../context/AuthContextProvider'
import { useSetting } from '../../context/SettingContextProvider'
import { profileimageupload } from '../../server/api'
import { useAlertShow } from '../custom_components/AlertProvider'
import Loading from '../custom_components/Loading'
import Navigation from '../custom_components/Navigation'
import EditProfileModal from './EditProfileModal'
import VoucherProperties from './VoucherProperties'
import { useUserType } from '../../context/UserTypeProvider'
const { ipcRenderer } = window.electron

const Setting = () => {
  const [loading, setLoading] = useState(false)

  const {isAdmin} = useUserType();

  const { user_data, profiledata, LOGOUT } = useAuth()

  const { showNoti, showConfirm } = useAlertShow()

  const [editshow, setEditShow] = useState(false)
  const { settings, ChangeSettings } = useSetting()

  const { t, i18n } = useTranslation()

  const filechoseref = useRef()

  const ImageUpload = useMutation(profileimageupload, {
    onSuccess: (data) => {
      user_data.refetch()
      setLoading(false)
      showNoti('Profile Image Updated Successfully')
    },
    onError: (error) => {
      setLoading(false)
      showNoti('Something went wrong', 'bi bi-exclamation-triangle')
    }
  })

  const saveProfileImage = async (dataUrl) => {
    const result = await ipcRenderer.invoke('save-profile-img', { imageurl: dataUrl })
    console.log(result)
  }

  useEffect(() => {
    if (profiledata?.profileimage) {
      saveProfileImage(axios.defaults.baseURL + profiledata?.profileimage)
    }
  }, [profiledata?.profileimage])

  const [showVP, setShowVP] = useState(false)

  const [avaliablePrinters, setAvaliablePrinters] = useState([])

  const printerelectron = async () => {
    const result = await ipcRenderer.invoke('getAllPrinters')
    setAvaliablePrinters(result)
  }

  useEffect(() => {
    printerelectron()
  }, [])

  // useEffect(() => {
  //     user_data.refetch();
  // }
  //     , []);

  return (
    <div className="flex flex-row h-screen">
      <Navigation />
      <Loading show={loading} />
      <div className="bg-white font-sans h-full w-full px-3 overflow-auto">
        <div className="flex justify-center flex-col items-center w-full">
          <div className="flex flex-row items-center mt-10">
            <i className="bi bi-person-circle text-xl" />
            <h1 className="text-xl font-bold ml-4 ">Profile</h1>
          </div>
          <div className="card rounded-lg border mt-3 shadow-lg p-3 w-1/2">
            <div className="flex flex-row items-center">
              <div className="relative">
                <img
                  src={
                    profiledata?.profileimage
                      ? axios.defaults.baseURL + profiledata?.profileimage
                      : IMAGE.app_icon
                  }
                  className="w-[100px] h-[100px] rounded-full"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = IMAGE.app_icon
                  }}
                />
             {isAdmin &&   <button
                  className="bg-slate-200 hover:bg-slate-300 p-2 rounded-full absolute"
                  style={{
                    bottom: -10,
                    right: -10
                  }}
                  onClick={() => {
                    filechoseref.current.click()
                  }}
                >
                  <i className="bi bi-camera text-black" />
                </button>}
                <input
                  type="file"
                  className="hidden"
                  ref={filechoseref}
                  onChange={(e) => {
                    setLoading(true)
                    if (e.target.files[0]) {
                      ImageUpload.mutate({
                        image: e.target.files[0]
                      })
                    }
                  }}
                />
              </div>

              <div className="flex flex-col ml-5">
                <h1 className="text-xl font-bold">{profiledata?.name}</h1>
                <h1 className="text-md text-gray-800">{profiledata?.username}</h1>
                <h1 className="text-md text-gray-800">{profiledata?.email}</h1>
                <h1 className="text-md text-gray-800">{profiledata?.phoneno}</h1>
                <h1 className="text-md text-gray-800">{profiledata?.address}</h1>
              </div>
             {isAdmin && <div className="ml-auto">
                <button
                  className="bg-primary hover:bg-blue-900 p-2 rounded-md"
                  onClick={() => setEditShow(true)}
                >
                  <i className="bi bi-pencil text-white" />
                </button>
              </div>}
            </div>
          </div>
          <div className="flex flex-row items-center mt-10">
            <i className="bi bi-gear text-xl" />
            <h1 className="text-xl font-bold ml-4 ">Settings</h1>
          </div>
          <div className="card rounded-lg border mt-3 shadow-lg p-3 w-1/2">
            {/* language */}
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row">
                <i className="bi bi-translate text-xl" />
                <h1 className="text-xl font-bold ml-4 ">{t('Language')}</h1>
              </div>
              <div>
                <select
                  className="border rounded-md p-2"
                  value={i18n.language}
                  onChange={(e) => {
                    i18n
                      .changeLanguage(e.target.value)
                      .then((res) => console.log(res))
                      .catch((err) => console.log(err))
                  }}
                >
                  <option value="en">English</option>
                  <option value="mm">Burmese</option>
                </select>
              </div>
            </div>
            {/* discount */}
            <div className="flex flex-row justify-between items-center mt-3">
              <div className="flex flex-row items-center">
                <i className="bi bi-arrow-down text-xl" />
                <h1 className="text-md ml-4 ">{'Discount'}</h1>
              </div>
              <div>
                {/* radio button discount is perctange or amount */}
                <input
                  type="radio"
                  id="percentage"
                  name="discount"
                  value="percentage"
                  checked={settings?.discount == 'percent'}
                  onChange={(e) => {
                    if (e.target.value) ChangeSettings('percent', 'discount')
                  }}
                />
                <label className="ml-2" htmlFor="percentage">
                  {t('Percentage')}
                </label>
                <input
                  type="radio"
                  id="amount"
                  name="discount"
                  value="amount"
                  className="ml-2"
                  checked={settings?.discount == 'amount'}
                  onChange={(e) => {
                    if (e.target.value) ChangeSettings('amount', 'discount')
                  }}
                />
                <label className="ml-2" htmlFor="amount">
                  {'Amount'}
                </label>
              </div>
            </div>
            {/* less than qty value */}
           {isAdmin && <div className="flex flex-row justify-between items-center mt-2">
              <div className="flex flex-row items-center">
                <h1 className="text-xl font-bold">{t('<')}</h1>
                <h1 className="text-md ml-4">{t('Less Than')}</h1>
              </div>
              <div>
                <input
                  type="number"
                  className="border rounded-md p-2 w-[100px] mr-2 text-center"
                  value={settings?.lessthan}
                  onChange={(e) => {
                    ChangeSettings(e.target.value, 'lessthan')
                  }}
                />
                Qty
              </div>
            </div>}

            {/* Expire in day */}
            {isAdmin && <div className="flex flex-row justify-between items-center mt-2">
              <div className="flex flex-row items-center">
                <i className="bi bi-calendar text-xl" />
                <h1 className="text-md ml-4">{t('Expire Show Products in')}</h1>
              </div>
              <div>
                <input
                  type="number"
                  className="border rounded-md p-2 w-[100px] mr-2 text-center"
                  value={settings?.expireshow}
                  onChange={(e) => {
                    ChangeSettings(e.target.value, 'expireshow')
                  }}
                />
                days
              </div>
            </div>}

            <div className="flex flex-row justify-between items-center mt-2">
              <div className="flex flex-row items-center">
                <i className="bi bi-image text-xl" />
                <h1 className="text-md ml-4">{t('Product Show Image')}</h1>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="showimage"
                  className="border rounded-md p-2 mr-2 text-center"
                  checked={settings?.showimage}
                  onChange={(e) => {
                    ChangeSettings(!settings?.showimage, 'showimage')
                    console.log(e.target.value)
                  }}
                />
                <label className="ml-2" htmlFor="showimage">
                  {'Show Image'}
                </label>
              </div>
            </div>

            <div className="flex flex-row justify-between items-center mt-2">
              <div className="flex flex-row items-center">
                <i className="bi bi-printer text-xl" />
                <h1 className="text-md  ml-4 ">{'Printer'}</h1>
              </div>
              <div className="flex flex-row items-center ml-3">
                <input
                  type="checkbox"
                  id="printsilent"
                  className="border rounded-md p-2 mr-2 text-center"
                  checked={settings?.printSilent}
                  onChange={(e) => {
                    ChangeSettings(!settings?.printSilent, 'printSilent')
                  }}
                />
                <label className="ml-1 mr-2 whitespace-nowrap" htmlFor="printsilent">
                  {'Print Silent'}
                </label>
                <select
                  className="border rounded-md p-2 max-w-[300px]"
                  value={settings?.printerName}
                  onChange={(e) => {
                    ChangeSettings(e.target.value, 'printerName')
                  }}
                >
                  {avaliablePrinters?.map((item) => (
                    <option value={item.name}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center mt-2">
              <div className="flex flex-row items-center">
                <i className="bi bi-receipt text-xl" />
                <h1 className="text-md ml-4">{t('Voucher')}</h1>
              </div>
              <div>
                <button
                  className="bg-white-500 border hover:bg-slate-100 p-2 rounded-md"
                  onClick={() => {
                    setShowVP(true)
                  }}
                >
                  <i className="bi bi-gear text-black mr-2" />
                  Properties
                </button>
              </div>
            </div>
            <div className="flex flex-col mt-2">
              <div className="flex flex-row items-center">
                <i className="bi bi-grip-horizontal text-xl" />
                <h1 className="text-md ml-4">{t('Voucher Footer Text')}</h1>
              </div>
              <div>
                <textarea
                  type="textarea"
                  multiple
                  className="border rounded-md p-2 w-full mr-2 mt-2"
                  value={settings?.footertext}
                  onChange={(e) => {
                    ChangeSettings(e.target.value, 'footertext')
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center mt-10">
            <i className="bi bi-shield-check text-xl" />
            <h1 className="text-xl font-bold ml-4 ">Account</h1>
          </div>
          <div className="card rounded-lg border mt-3 shadow-lg p-3 w-1/2">
            <div className="flex flex-row justify-between items-center mt-2">
              <div className="flex flex-row items-center">Logout from {APPNAME}</div>
              <div>
                <button
                  onClick={() => {
                    showConfirm('', 'Are you sure to logout?', () => {
                      LOGOUT()
                    })
                  }}
                  className="text-md font-bold p-2 bg-red-500 text-white rounded cursor-pointer flex flex-row items-center"
                >
                  <i className="bi bi-box-arrow-right text-xl mr-2" />
                  {t('Logout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditProfileModal show={editshow} setShow={setEditShow} data={profiledata} />
      <VoucherProperties show={showVP} setShow={setShowVP} data={settings} />
    </div>
  )
}

const kFormatter = (num) => {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1)
    : Math.sign(num) * Math.abs(num)
}

export default Setting
