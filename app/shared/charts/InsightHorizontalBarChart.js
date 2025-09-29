'use client'
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Cell, LabelList, CartesianGrid } from 'recharts'
import { numberFormatter } from 'helpers/numberHelper'
import { useTailwindBreakpoints } from '../hooks/useTailwindBreakpoints'
import { COLORS } from './constants'

export const InsightHorizontalBarChart = ({ data = [], percentage = false }) => {

    const tailwindBreakpoint = useTailwindBreakpoints()
    const isMobile = tailwindBreakpoint === 'sm' || tailwindBreakpoint === 'xs'

    const renderCustomBar = (props) => {
        const { fill, x, y, width, height } = props
        const radius = 6
        const path = `M ${x} ${y} 
                     L ${x + width - radius} ${y} 
                     Q ${x + width} ${y} ${x + width} ${y + radius} 
                     L ${x + width} ${y + height - radius} 
                     Q ${x + width} ${y + height} ${x + width - radius} ${y + height} 
                     L ${x} ${y + height} Z`
        
        return (
            <path
                d={path}
                fill={fill}
            />
        )
    }

    const renderLegend = () => {
        return (
            <div className="w-full px-2 text-black pb-4">
                <div className="flex items-center justify-center flex-wrap gap-4">
                    {data.map((item, index) => (
                        <div key={`legend-item-${item.name}`} className="flex items-center">
                            <span
                                className="inline-block mr-2 rounded-sm"
                                style={{ backgroundColor: COLORS[index % COLORS.length], width: 8, height: 8 }}
                            />
                            <span className="text-xs text-muted-foreground font-normal">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={350}>
                <BarChart 
                    data={data} 
                    height={350}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                    barCategoryGap={2}
                    barGap={0}
                    layout="vertical"
                >
                    <XAxis 
                        dataKey="value" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 0, fill: 'transparent' }}
                        domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
                        tickCount={5}
                        width={0}
                        type="number"
                    />
                    <YAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={isMobile ? false : { fontSize: 12, fill: '#6b7280', dy: 19, style: { whiteSpace: 'nowrap' } }}
                        tickMargin={10}
                        domain={['dataMin', 'dataMax']}
                        type="category"
                        scale="band"
                        width={isMobile ? 0 : 150}
                        padding={{ left: 0, right: 0 }}
                    />
                    <CartesianGrid stroke="#e5e7eb" horizontal={false} vertical={true} />
                    <Bar 
                        dataKey="value" 
                        fill="#8884d8" 
                        shape={renderCustomBar}
                        maxBarSize={105}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        <LabelList 
                            dataKey="value" 
                            position="right" 
                            dx={4}
                            formatter={(value) => (numberFormatter(value) + (percentage ? '%' : ''))}
                            style={{ fontSize: 12, fill: '#374151' }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            {isMobile && renderLegend()}
        </div>
    )
}
