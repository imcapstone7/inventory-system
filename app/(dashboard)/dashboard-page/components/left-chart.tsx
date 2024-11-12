import { useTheme } from 'next-themes';
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const LeftChart = () => {
    const { theme } = useTheme();

    const data = [
        { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
        { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
        { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
        { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
        { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
        { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
        { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
        { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
        { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
        { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
        { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
        { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
        { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
        { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
    ];

    const barColorsLight = ['#030d71', '#D3D3D3'];
    const barColorsDark = ['#3fab71', '#D3D3D3'];

    return (
        <ResponsiveContainer width="70%" height={50}>
            <BarChart data={data}>
                <Bar dataKey="uv">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`${theme === 'dark' ? barColorsDark[index % barColorsDark.length] : barColorsLight[index % barColorsLight.length]}`} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default LeftChart;
