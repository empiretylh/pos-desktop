import React from 'react';
import { IMAGE } from '../../config/image';


const Loading = ({ show, setShow, message ="Loading"}) => {
    if (show) {
        return (
            <div className={`fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center ${show ? 'block' : 'hidden'}`}>
                <div className='flex flex-col justify-center items-center'>
                    <div className="bg-white rounded-lg p-3 flex justify-center items-center flex-col">
                        <img src={IMAGE.loading} className='w-12 h-12 animate-spin'/>
                        <label className='text-md'>{message}</label>
                    </div>
                </div>
            </div>
        )
    }
}

export default Loading;