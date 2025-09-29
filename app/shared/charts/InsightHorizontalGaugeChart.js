'use client'
import { numberFormatter } from 'helpers/numberHelper'
import { COLORS } from './constants'

export const InsightHorizontalGaugeChart = ({ data = [], percentage = false }) => {
    const maxValue = Math.max(...(data?.map((d) => d.value) ?? [0]), 0) || 1

    return (
        <div className="w-full h-full flex flex-col gap-2 pt-4">
            {data.map((item, index) => {
                const valuePercent = Math.min(100, Math.round((item.value / (percentage ? 100 : maxValue)) * 100))
                const barWidthPercent = `${valuePercent}%`

                return (
                    <div key={`gauge-row-${item.name}`} className="w-full mb-3">
                        <div className="flex items-center justify-between w-full mb-1.5">
                            <span className="truncate text-xs text-muted-foreground font-normal">{item.name}</span>
                            <span className="text-xs font-semibold ml-4">{numberFormatter(item.value)}{percentage ? '%' : ''}</span>
                        </div>
                        <div className="w-full h-4 bg-muted rounded-lg">
                            <div
                                className="h-4 rounded-lg"
                                style={{ width: barWidthPercent, backgroundColor: COLORS[index % COLORS.length] }}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
