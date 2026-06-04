'use client'

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import {
  CHART_COLORS,
  formatChartNumber,
  formatChartPercent,
} from '@styleguide/lib/chart'

interface DonutChartItem {
  name: string
  value: number
}

interface DonutChartProps {
  data?: DonutChartItem[]
  percentage?: boolean
  height?: number
}

const DonutChart = ({
  data = [],
  percentage = false,
  height = 220,
}: DonutChartProps): React.JSX.Element => {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={false}
            innerRadius={60}
            outerRadius={100}
            stroke="var(--color-base-muted)"
            strokeWidth={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="w-full px-2 pt-2 text-foreground">
        {data.map((item, index) => (
          <div
            key={`legend-row-${item.name}`}
            className="flex w-full items-center justify-between py-1"
          >
            <div className="flex min-w-0 items-center">
              <span
                className="mr-2 inline-block rounded-full"
                style={{
                  backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                  width: 8,
                  height: 8,
                }}
              />
              <span className="truncate text-xs font-normal text-muted-foreground">
                {item.name}
              </span>
            </div>
            <span className="ml-4 text-xs font-semibold">
              {percentage
                ? `${formatChartPercent(item.value)}%`
                : formatChartNumber(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { DonutChart, type DonutChartItem, type DonutChartProps }
