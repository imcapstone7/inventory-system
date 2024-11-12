import { useTheme } from 'next-themes';
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const MiddleChart = () => {
    const { theme } =  useTheme();

    const data = [
        { name: 'Page A', uv: 4000, pv: 3500, iv: 2000 },
    ];

    return (
        <ResponsiveContainer width="100%" height={80}>
            <BarChart className='-translate-x-16' data={data} layout="vertical">
                <XAxis className='hidden' type="number" />
                <YAxis className='hidden'  type="category" />
                <Bar dataKey="uv" stackId="a" fill={`${theme === 'dark' ? '#3fab71' : '#030d71'}`} />
                <Bar dataKey="pv" stackId="a" fill="#D3D3D3" />
                <Bar dataKey="iv" stackId="a" fill="#A3A3A3" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default MiddleChart;
