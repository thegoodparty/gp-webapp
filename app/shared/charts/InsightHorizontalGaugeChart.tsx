'use client'
import { numberFormatter } from 'helpers/numberHelper'
import { formatPercentLabel } from './utils'
import { COLORS } from './constants'

interface DataItem {
  name: string
  value: number
}

interface InsightHorizontalGaugeChartProps {
  data?: DataItem[]
  percentage?: boolean
}

export const InsightHorizontalGaugeChart = ({
  data = [],
  percentage = false,
}: InsightHorizontalGaugeChartProps): React.JSX.Element => {
  const maxValue = Math.max(...(data?.map((d) => d.value) ?? [0]), 0) || 1

  return (
    <div className="w-full h-full flex flex-col gap-2 pt-4">
      {data.map((item, index) => {
        const valuePercent = Math.min(
          100,
          Math.round((item.value / (percentage ? 100 : maxValue)) * 100),
        )
        const barWidthPercent = `${valuePercent}%`

        return (
          <div
            key={`gauge-row-${item.name}`}
            className="flex items-center gap-3 w-full"
          >
            <span className="w-12 shrink-0 truncate text-xs text-muted-foreground font-normal">
              {item.name}
            </span>
            <div className="flex-1 h-4 bg-muted rounded-lg">
              <div
                className="h-4 rounded-lg"
                style={{
                  width: barWidthPercent,
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              />
            </div>
            <span className="w-12 shrink-0 text-right text-xs font-semibold text-foreground">
              {percentage
                ? `${formatPercentLabel(item.value)}%`
                : numberFormatter(item.value)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
