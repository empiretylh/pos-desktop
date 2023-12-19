import React from 'react';

export default function (props) {

    return (
        <div className="mb-4">
            <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-xl leading-tight focus:outline-none focus:shadow-outline"
                {...props}
            />
        </div>
    );
}