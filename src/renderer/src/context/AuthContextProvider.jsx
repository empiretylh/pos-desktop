import axios from 'axios'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { getUser } from '../server/api'
import { APPNAME } from '../config/config'
import { IMAGE } from '../config/image'
import PricingView from '../components/Pricing/PricingView'

const { ipcRenderer } = window.electron

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem('token'))
  const [isplan, setisplan] = useState(true)
  const [show, setShow] = useState(false)


  const setToken = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken_(newToken)
  }

  const LOGOUT = () => {
    setToken(null)
    localStorage.removeItem('token')
    axios.defaults.headers.common = { Authorization: null }
  }

  useEffect(() => {
    const getToken = async () => {
      const result = await localStorage.getItem('token')
      if (result) {
        setToken(result)
      }
    }

    getToken()
  }, [])

  const saveProfileImage = async (dataUrl) => {
    const result = await ipcRenderer.invoke('save-profile-img', { imageurl: dataUrl })
    console.log(result)
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common = { Authorization: `Token ${token}` }
      localStorage.setItem('token', token)
    } else {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
    }
  }, [token])

  const user_data = useQuery('profile', getUser, {
    enabled: false
  })

  useEffect(() => {
    if (token) {
      user_data.refetch()
    }
  }, [token])

  useEffect(() => {
    if (user_data.error?.response?.status === 401) {
      LOGOUT()
      window.location.href = '/login'
    }
  }, [user_data.data])

  useEffect(() => {
    if (user_data.data?.data) {
      let startdate = new Date(user_data.data?.data?.start_d)
      let enddate = new Date(user_data.data?.data?.end_d)
      let today = new Date()
      if (today < startdate || today > enddate) {
        console.log('Plan has been activated')

        setisplan(false)
      } else {
        console.log('Plan has been activated')
        setisplan(true)
      }
    }
  }, [user_data.data])

  useEffect(() => { 
    if(!isplan){
      setShow(true)
    }
  }, [isplan])

  const profiledata = useMemo(() => {
    return user_data.data?.data
  }, [user_data.data])

 
  useEffect(() => {
    if (profiledata?.profileimage) {
      saveProfileImage(axios.defaults.baseURL + profiledata?.profileimage)
    }
  }, [profiledata?.profileimage])
  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      LOGOUT,
      user_data,
      profiledata,
      isplan
    }),
    [token, profiledata, user_data, isplan]
  )

  if (user_data.isFetching) {
    return (
      <div className="flex items-center justify-center h-screen bg-primary text-white">
        <div className="flex items-center flex-col justify-cente text-2xl font-semibold  ">
          <img
            src={IMAGE.app_icon}
            style={{
              width: 100,
              height: 100
            }}
          />
          <span className="font-mono">{APPNAME}</span>
          <div className="flex items-center flex-row space-x-2 mt-3">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    )
  }


 
  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>
      {!isplan && <PricingView show={show} setShow={setShow}/>}
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export default AuthProvider
