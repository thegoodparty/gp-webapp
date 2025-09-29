'use client'
import { PieChart, Pie, Legend, ResponsiveContainer, Cell } from 'recharts'
import { numberFormatter } from 'helpers/numberHelper'
import { COLORS } from './constants'

export const InsightDonutChart = ({ data = [], percentage = false }) => {

    const renderLegend = () => {
        return (
            <div className="w-full px-2 text-black" style={{width: '100%'}}>
                {data.map((item, index) => (
                    <div key={`legend-row-${item.name}`} className="flex items-center justify-between w-full py-1">
                        <div className="flex items-center min-w-0">
                            <span
                                className="inline-block mr-2 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length], width: 8, height: 8 }}
                            />
                            <span className="truncate text-xs text-muted-foreground font-normal">{item.name}</span>
                        </div>
                        <span className="text-xs font-semibold ml-4">{numberFormatter(item.value)}{percentage ? '%' : ''}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart width={400} height={350} margin={{ top: 0, right: 0, bottom: 24, left: 0 }}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    label={null}
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    stroke="#F5F5F5"
                    strokeWidth={4}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend width="100%" verticalAlign="bottom" align="center" layout="vertical" content={renderLegend} />
            </PieChart>
        </ResponsiveContainer>
    );
}
