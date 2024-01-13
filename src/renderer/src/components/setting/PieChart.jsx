import { PieChart } from "react-minimal-pie-chart";
import React from "react";

export default function CustomPieChart({ data }) {

    const defaultdata = [
        { title: 'One', value: 10, color: '#E38627' },
        { title: 'Two', value: 15, color: '#C13C37' },
        { title: 'Three', value: 20, color: '#6A2135' },
    ]

    return (
        <div className="w-full h-full">
            <PieChart
                label={({ dataEntry }) => `${dataEntry.title} - ${Math.round(dataEntry.percentage)} % `}
                labelStyle={(index) => ({
                    fill: '#fff',
                    fontSize: '5px',
                    fontFamily: 'sans-serif',
                })}

                data={data ? data : defaultdata}
                style={{ height: '250px' }}

            />
        </div>
    )
}