import { useEffect, useState } from 'react'
import { startOfWeek, addWeeks } from 'date-fns'
import type { Task } from './TaskItem'

interface WeekNavigationResult {
  selectedWeek: number
  currentWeekStart: Date
  filteredTasks: Task[]
  canGoPrevious: boolean
  canGoNext: boolean
  goToPrevious: () => void
  goToNext: () => void
}

export function useWeekNavigation(
  tasks: Task[],
  tasksProp: Task[],
  electionDateObj: Date | null,
  daysUntilElection: number,
): WeekNavigationResult {
  const weeksUntilElection = Math.ceil(daysUntilElection / 7)

  const weekNumbers = [...new Set(tasks.map((t) => t.week))].sort(
    (a, b) => b - a,
  )

  const defaultIndex =
    weekNumbers.length > 0
      ? weekNumbers.reduce((bestIdx, w, idx) => {
          const bestW = weekNumbers[bestIdx]
          if (bestW === undefined) return idx
          const bestDiff = Math.abs(bestW - weeksUntilElection)
          const currDiff = Math.abs(w - weeksUntilElection)
          if (currDiff < bestDiff) return idx
          if (currDiff === bestDiff && w < bestW) return idx
          return bestIdx
        }, 0)
      : 0

  const [selectedWeekIndex, setSelectedWeekIndex] = useState(-1)

  useEffect(() => {
    setSelectedWeekIndex(-1)
  }, [tasksProp])

  const clampedIndex =
    selectedWeekIndex === -1
      ? defaultIndex
      : Math.max(0, Math.min(selectedWeekIndex, weekNumbers.length - 1))
  const selectedWeek = weekNumbers[clampedIndex] ?? 0
  const canGoPrevious = clampedIndex > 0
  const canGoNext = clampedIndex < weekNumbers.length - 1

  const currentWeekStart = electionDateObj
    ? startOfWeek(addWeeks(electionDateObj, -selectedWeek), {
        weekStartsOn: 0,
      })
    : startOfWeek(new Date(), { weekStartsOn: 0 })

  const filteredTasks = tasks.filter((t) => t.week === selectedWeek)

  return {
    selectedWeek,
    currentWeekStart,
    filteredTasks,
    canGoPrevious,
    canGoNext,
    goToPrevious: () => setSelectedWeekIndex(clampedIndex - 1),
    goToNext: () => setSelectedWeekIndex(clampedIndex + 1),
  }
}
