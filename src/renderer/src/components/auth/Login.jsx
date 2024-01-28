import react, { useState, useEffect } from 'react'
import { useMutation } from 'react-query'
import { APPNAME, domainURL } from '../../config/config'
import { IMAGE } from '../../config/image'
import TextInput from '../custom_components/TextInput'
import { login } from '../../server/api'
import { useAuth } from '../../context/AuthContextProvider'
const { ipcRenderer } = window.electron
import axios from 'axios'
import Loading from '../custom_components/Loading'
import { Navigate } from 'react-router-dom'
import { useUserType } from '../../context/UserTypeProvider'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [showSetting, setShowSetting] = useState(false)



  const [loading, setLoading] = useState(false)

  const { setToken, user_data } = useAuth()

  const post_server = useMutation(login, {
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (res) => {
      setLoading(false)

      localStorage.setItem('token', res.data.token)

      setToken(res.data.token)
      axios.defaults.headers.common = {
        Authorization: `Token ${res.data.token}`
      }

      user_data.refetch()

      window.location.href = '/'
      ipcRenderer.invoke('restart-app')
    },
    onError: (err) => {
      console.log(err)
      setLoading(false)
      alert(err)
    }
  })

  //device-info

  const onSubmit = async (e) => {
    e.preventDefault()
    const result = await ipcRenderer.invoke('device-info')

    post_server.mutate({
      username: username,
      password: password,
      unique_id: result.uniqueId,
      device_name: result.username,
      acc_type: localStorage.getItem('usertype') || 'Admin'
    })
  }

  return (
    <div className="w-full h-screen grid grid-cols-3 font-mono">
      <Loading show={loading} />
      <SettingModal show={showSetting} setShow={setShowSetting} />
      <div className="bg-primary h-full col-span-2 text-white flex justify-center items-center">
        <div className="flex flex-col items-center justify-center">
          <img src={IMAGE.app_icon} style={{ width: 200, height: 200 }} />
          <h1 className="text-4xl font-semibold">{APPNAME}</h1>
        </div>
      </div>
      <div className="bg-white h-full col-span-1">
        <button className="absolute top-2 right-2 border p-2 rounded-lg border-gray-400" onClick={() => setShowSetting(true)}>
            <i className="bi bi-gear text-2xl"></i>
        </button>
        <div className="flex flex-col  w-full h-full justify-center items-center">
          <h1 className="text-3xl">Login</h1>
          <form style={{ width: '80%', marginTop: 30 }} onSubmit={onSubmit}>
            <label className="block text-gray-700 text-xl font-bold mb-2">Username</label>
            <TextInput
              placeholder={'Username'}
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label className="block text-gray-700 text-xl font-bold mb-2">Password</label>
            <TextInput
              placeholder={'Password'}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="bg-primary py-2 rounded-md w-full text-white font-bold hover:bg-cyan-600"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = '/register'
              }}
              className="bg-primary py-2 mt-2 rounded-md w-full text-white font-bold hover:bg-cyan-600"
            >
              Register
            </button>
          </form>

          <div style={{ position: 'absolute', bottom: 2 }}>
            Copyright © 2022-{new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  )
}

const SettingModal = ({ show, setShow }) => {
  const [usertype, setUsertype] = useState(localStorage.getItem('usertype') || 'Admin')
  const [domain, setDomain] = useState(localStorage.getItem('domain') || domainURL)
  const [isCustom, setIsCustom] = useState(false)
  const {ChangeUserType} = useUserType();
  
    useEffect(() => {
        ChangeUserType(usertype)
    }, [usertype])
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${
        show ? 'scale-100' : ''
      }`}
    >
      <div className="bg-white rounded-lg w-1/2 shadow-lg">
        <div className="flex justify-between items-center p-2">
          <div className="flex flex-row items-center">
            <i className="bi bi-gear text-2xl mr-2"></i>
            <h1 className="text-xl font-bold">Configuration</h1>
          </div>
          <button className="text-red-500 p-3" onClick={() => setShow(false)}>
            X
          </button>
        </div>
        <div className="flex flex-col p-5">
          <div className="flex flex-row items-center justify-between border-b-2 p-2">
            <h1 className="text-md font-bold">User</h1>
            <select
              value={usertype || 'Admin'}
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              onChange={(e) => {
                localStorage.setItem('usertype', e.target.value)
                setUsertype(e.target.value)
              }}
            >
              <option value="Admin">Admin</option>
              <option value="Cashier">Cashier</option>
            </select>
          </div>
          <div className="flex flex-row items-center justify-between mt-2 border-b-2 p-2">
            <h1 className="text-md font-bold">Server Domain</h1>
            <select
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={domain == domainURL ? domainURL : 'custom'}
              onChange={(e) => {
                if (e.target.value == 'custom') {
                  setIsCustom(true)
                  setDomain('http://')
                  localStorage.setItem('domain', domain)
                } else {
                  localStorage.setItem('domain', e.target.value)
                  setDomain(e.target.value)
                  setIsCustom(false)
                  axios.defaults.baseURL = domainURL;
                }
              }}
            >
              <option value={domainURL}>Default</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {isCustom || domain !== domainURL ? (
            <div className="flex flex-row items-center justify-between mt-2 border-b-2 p-2">
              <h1 className="text-md font-bold">Custom Domain</h1>
              <input
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value)
                  localStorage.setItem('domain', e.target.value)
                  axios.defaults.baseURL = e.target.value;
                }}
                disabled={!isCustom}
              />
            </div>
          ):null}
        </div>
      </div>
    </div>
  )
}

export default Login
