'use client'

import { format, endOfWeek, isSameWeek } from 'date-fns'
import { ArrowLeftIcon, ArrowRightIcon, IconButton } from '@styleguide'

interface WeeklyTaskNavigatorProps {
  currentWeekStart: Date
  onPrevious: () => void
  onNext: () => void
  canGoPrevious: boolean
  canGoNext: boolean
}

function formatWeekLabel(weekStart: Date): string {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 })
  const startMonth = format(weekStart, 'MMM')
  const endMonth = format(weekEnd, 'MMM')

  if (startMonth === endMonth) {
    return `${startMonth} ${format(weekStart, 'd')}-${format(weekEnd, 'd')}`
  }
  return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`
}

function isCurrentWeek(weekStart: Date): boolean {
  return isSameWeek(new Date(), weekStart, { weekStartsOn: 0 })
}

export default function WeeklyTaskNavigator({
  currentWeekStart,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: WeeklyTaskNavigatorProps) {
  const isThisWeek = isCurrentWeek(currentWeekStart)
  const dateRange = formatWeekLabel(currentWeekStart)

  return (
    <div className="flex items-center gap-3 px-6 py-3">
      <IconButton
        variant="outline"
        size="small"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-label="Previous week"
      >
        <ArrowLeftIcon className="size-4" />
      </IconButton>
      <IconButton
        variant="outline"
        size="small"
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Next week"
      >
        <ArrowRightIcon className="size-4" />
      </IconButton>
      <div className="flex flex-col">
        <span className="text-base font-semibold">
          {isThisWeek ? 'This week' : dateRange}
        </span>
      </div>
    </div>
  )
}
