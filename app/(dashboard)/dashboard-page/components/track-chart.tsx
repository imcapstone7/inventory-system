import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';

interface RenderActiveShapeProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    fill: string;
    payload: { name: string };
    percent: number;
    value: number;
}

const data = [
    { name: 'Borrowed', value: 400, fill: '#A3A3A3' },
    { name: 'Returned', value: 200, fill: '#fb4c0a' },
];

const renderActiveShape = (props: RenderActiveShapeProps) => {
    const RADIAN = Math.PI / 180;
    const {
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        payload,
        percent,
        value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 20) * cos;
    const my = cy + (outerRadius + 20) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 10;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <text x={ex} y={ey} dy={10} textAnchor={textAnchor} fill={fill}>{`${value}`}</text>
        </g>
    );
};

interface ExampleState {
    activeIndex: number;
}

export default class Example extends PureComponent<{}, ExampleState> {
    state: ExampleState = {
        activeIndex: 0,
    };

    onPieEnter = (_: any, index: number) => {
        this.setState({
            activeIndex: index,
        });
    };

    render() {
        return (
            <ResponsiveContainer width="100%" height={170}>
                <PieChart width={200} height={200}>
                    <Pie
                        activeIndex={this.state.activeIndex}
                        activeShape={renderActiveShape as any}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        dataKey="value"
                        onMouseEnter={this.onPieEnter}
                    />
                </PieChart>
            </ResponsiveContainer>
        );
    }
}
