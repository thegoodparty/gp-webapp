'use client'
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Cell, LabelList, CartesianGrid } from 'recharts'
import { numberFormatter } from 'helpers/numberHelper'
import { formatPercentLabel } from './utils'
import { useTailwindBreakpoints } from '../hooks/useTailwindBreakpoints'
import { COLORS } from './constants'

interface DataItem {
    name: string
    value: number
}

interface InsightVerticalBarChartProps {
    data?: DataItem[]
    percentage?: boolean
}

interface CustomBarProps {
    fill?: string
    x?: number
    y?: number
    width?: number
    height?: number
}

export const InsightVerticalBarChart = ({ data = [], percentage = false }: InsightVerticalBarChartProps): React.JSX.Element => {

    const tailwindBreakpoint = useTailwindBreakpoints()
    const isMobile = tailwindBreakpoint === 'sm' || tailwindBreakpoint === 'xs'

    const renderCustomBar = (props: CustomBarProps) => {
        const { fill, x, y, width, height } = props
        const radius = 8
        const path = `M ${x} ${y! + height!} 
                     L ${x} ${y! + radius} 
                     Q ${x} ${y} ${x! + radius} ${y} 
                     L ${x! + width! - radius} ${y} 
                     Q ${x! + width!} ${y} ${x! + width!} ${y! + radius} 
                     L ${x! + width!} ${y! + height!} Z`
        
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
                    margin={{ top: 20, right: 0, left: 0, bottom: isMobile ? 0 : 20 }}
                    barCategoryGap={2}
                    barGap={0}
                >
                <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={ isMobile ? false : { fontSize: 12, dy: 10, dx: 50}}
                    domain={['dataMin', 'dataMax']}
                    type="category"
                    scale="band"
                    padding={{ left: 0, right: 0 }}
                    interval={0}
                />
                <YAxis 
                    dataKey="value" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 0, fill: 'transparent' }}
                    domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
                    tickCount={5}
                    width={0}
                />
                <CartesianGrid stroke="#e5e7eb" horizontal={true} vertical={false} />
                <Bar 
                    dataKey="value" 
                    fill="#8884d8" 
                    shape={renderCustomBar}
                    maxBarSize={105}
                >
                    {data.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    <LabelList 
                        dataKey="value" 
                        position="top" 
                        dy={-4}
                        formatter={(value: number) => (percentage ? `${formatPercentLabel(value)}%` : numberFormatter(value))}
                        style={{ fontSize: 12, fill: '#374151' }}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
        {isMobile && renderLegend()}
        </div>
    )
}

