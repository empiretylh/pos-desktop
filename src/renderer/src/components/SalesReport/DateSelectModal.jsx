import React from 'react';

const DateSelectModal = ({show, setShow,  startDate, setStartDate, endDate, setEndDate}) => {
    console.log(startDate)
    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ${show ? 'block' : 'hidden'} select-none`}>
            <div className="w-[350px] bg-white mx-auto my-20 rounded-lg">
                <div className="flex flex-row justify-between items-center px-3 py-2">
                    <div className="text-2xl font-bold">
                        Select Date
                    </div>
                    <div className="text-2xl font-bold cursor-pointer" onClick={() => setShow(false)}>
                        X
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center px-3 py-2">
                    <div className="text-xl font-bold">
                        Start Date
                    </div>
                    <div className="text-xl font-bold">
                        <input type="date" className="border border-gray-300 rounded-md w-full p-2  my-1" value={startDate.toISOString().substring(0, 10)} onChange={(e) => setStartDate(new Date(e.target.value))} />
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center px-3 py-2">
                    <div className="text-xl font-bold">
                        End Date
                    </div>
                    <div className="text-xl font-bold">
                        <input 
                            type="date" 
                            className="border border-gray-300 rounded-md w-full p-2 my-1" 
                            min={startDate.toISOString().substring(0, 10)}
                            value={endDate.toISOString().substring(0, 10)} 
                            onChange={(e) => setEndDate(new Date(e.target.value))} 
                        /> </div>
                </div>
                <div className="flex flex-row justify-center items-center px-3 py-2">
                    <div className="text-xl font-bold cursor-pointer bg-blue-500 text-white rounded-lg p-3 w-full text-center" onClick={() => setShow(false)}>
                        Apply
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default DateSelectModal;