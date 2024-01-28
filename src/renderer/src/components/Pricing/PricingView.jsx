import React, { useContext, useMemo, useState } from 'react'
import { IMAGE } from '../../config/image'
import { APPNAME } from '../../config/config'
import { useAuth } from '../../context/AuthContextProvider'
import { useMutation, useQuery } from 'react-query'
import { deletePricingRequest, getPricing, postPricingRequest } from '../../server/api'
import Loading from '../custom_components/Loading'
const PricingView = ({ show, setShow }) => {
  const { token, LOGOUT, user_data, profiledata, isplan } = useAuth()

  const pricing_data = useQuery('pricing', getPricing, {
    enabled: true
  })

  const [loading, setLoading] = useState(false)

  const post_pricing = useMutation(postPricingRequest, {
    onMutate: (data) => {
      setLoading(true)
    },
    onSuccess: (data) => {
      setLoading(false)
      console.log(data)
      pricing_data.refetch()
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
    }
  })

  const delete_pricing = useMutation(deletePricingRequest, {
    onMutate: (data) => {
      setLoading(true)
    },
    onSuccess: (data) => {
      setLoading(false)
      console.log(data)
      pricing_data.refetch()
    },
    onError: (error) => {
      console.log(error)

      setLoading(false)
    }
  })

  const pricing = useMemo(() => {
    if (pricing_data.data) {
      return pricing_data?.data?.data?.pricing
    } else {
      return []
    }
  }, [pricing_data.data])

  const reqpricing = useMemo(() => {
    if (pricing_data.data) {
      return pricing_data?.data?.data?.pr_request[0]
    } else {
      return []
    }
  }, [pricing_data.data])

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${
        show ? 'scale-100' : ''
      }`}
      style={{ zIndex: 999999 }}
    >
      <div className="bg-white rounded-lg w-8/12 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-row justify-center text-2xl font-semibold  ">
            <img
              src={IMAGE.app_icon}
              style={{
                width: 50,
                height: 50,
                backgroundColor: '#004BAB',
                borderRadius: 9999,
                marginRight: 10
              }}
            />
            <span className="font-mono">{APPNAME}</span>
          </div>
          <Loading show={loading} setShow={setLoading} />
          <div className="flex items-center flex-row space-x-2">
            <button
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              onClick={() => {
                LOGOUT()
                window.location = '/login'
              }}
            >
              Logout
            </button>
            {/* close button */}
            <button
              className="text-red-500 p-3"
              onClick={() => {
                if (isplan) {
                  setShow(false)
                }
              }}
            >
              X
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center mt-5">
          <h1 className="text-xl font-bold">Pricing Plans</h1>
        </div>
        {reqpricing?.rq_price?.id && (
          <div className="flex items-center justify-center mt-2 text-red-500">
            <h1 className="text-xl font-bold">
              You have requested for {reqpricing?.rq_price?.title} Package
            </h1>
          </div>
        )}

        {isplan && (
          <div className="flex items-center justify-center mt-2 bg-red-800 text-white">
            Your plan will be expire in `{new Date(profiledata?.end_d).toDateString()}`
          </div>
        )}
        <div className="grid grid-cols-4 gap-4 p-5">
          {pricing.map((item, index) => (
            <div
              className={`rounded-lg shadow p-4 ${
                reqpricing?.rq_price?.id == item.id ? 'bg-blue-200 text-black' : 'bg-white'
              }`}
            >
              <h2 className="text-xl font-bold ">{item.title}</h2>
              <h2 className="text-md font-mono mb-2">{item.days} Days</h2>
              <p className="text-red-600 font-bold mb-2">Discount: {item.discount}</p>
              <p className="text-gray-600  font-bold">Fee: {item.price} Ks</p>
              {reqpricing?.rq_price?.id == item.id && (
                <p className="text-green-600 mb-2 font-bold text-sm"> Requested</p>
              )}
              {reqpricing?.rq_price?.id == item.id ? (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    delete_pricing.mutate({ id: item.id })
                  }}
                >
                  Cancel Request
                </button>
              ) : (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    if (reqpricing?.rq_price?.id) {
                      delete_pricing.mutate({ id: reqpricing?.rq_price?.id })
                    }

                    post_pricing.mutate({ type: item.id })
                  }}
                >
                  Buy {item.title} Package
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PricingView
