'use client'

import { Fragment } from 'react'
import {
  CHART_COLORS,
  formatChartNumber,
  formatChartPercent,
} from '@styleguide/lib/chart'
import { cn } from '@styleguide/lib/utils'

interface BarListItem {
  name: string
  value: number
}

interface BarListProps {
  data?: BarListItem[]
  percentage?: boolean
  className?: string
}

const BarList = ({
  data = [],
  percentage = false,
  className,
}: BarListProps): React.JSX.Element => {
  const maxValue = Math.max(...(data.map((d) => d.value) ?? [0]), 0) || 1

  return (
    <div
      className={cn(
        'grid w-full grid-cols-[auto_minmax(80px,1fr)_auto] items-center gap-x-3 gap-y-2 pt-4',
        className,
      )}
    >
      {data.map((item, index) => {
        const valuePercent = Math.min(
          100,
          Math.round((item.value / (percentage ? 100 : maxValue)) * 100),
        )

        return (
          <Fragment key={`bar-list-row-${item.name}`}>
            <span className="max-w-36 truncate text-xs font-normal text-muted-foreground">
              {item.name}
            </span>
            <div className="h-4 rounded-lg bg-muted">
              <div
                className="h-4 rounded-lg"
                style={{
                  width: `${valuePercent}%`,
                  backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                }}
              />
            </div>
            <span className="text-right text-xs font-semibold text-foreground">
              {percentage
                ? `${formatChartPercent(item.value)}%`
                : formatChartNumber(item.value)}
            </span>
          </Fragment>
        )
      })}
    </div>
  )
}

export { BarList, type BarListItem, type BarListProps }
