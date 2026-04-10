import { useEffect, useState } from 'react'
import { addWeeks, startOfWeek } from 'date-fns'
import type { Task } from './TaskItem'

const SESSION_KEY_PREFIX = 'campaign-plan-selected-week'

function sessionKey(campaignId: string): string {
  return `${SESSION_KEY_PREFIX}:${campaignId}`
}

function readSessionWeek(campaignId: string): number | null {
  if (typeof window === 'undefined') return null
  const stored = sessionStorage.getItem(sessionKey(campaignId))
  if (stored === null) return null
  const parsed = Number(stored)
  return Number.isFinite(parsed) ? parsed : null
}

function writeSessionWeek(campaignId: string, week: number | null): void {
  if (typeof window === 'undefined') return
  const key = sessionKey(campaignId)
  if (week === null) {
    sessionStorage.removeItem(key)
  } else {
    sessionStorage.setItem(key, String(week))
  }
}

interface WeekNavigationResult {
  selectedWeek: number
  weeksUntilElection: number
  previousWeekNumber: number | null
  nextWeekNumber: number | null
  currentWeekStart: Date
  filteredTasks: Task[]
  canGoPrevious: boolean
  canGoNext: boolean
  goToPrevious: () => void
  goToNext: () => void
}

export function useWeekNavigation(
  tasks: Task[],
  campaignId: string,
  electionDateObj: Date | null,
  daysUntilElection: number,
): WeekNavigationResult {
  const weeksUntilElection = Math.ceil(daysUntilElection / 7)
  const hasCurrentWeek = Number.isFinite(weeksUntilElection)
  const taskWeeks = tasks.map((task) => task.week)

  const weekNumbers = [
    ...new Set([...taskWeeks, ...(hasCurrentWeek ? [weeksUntilElection] : [])]),
  ].sort((a, b) => b - a)

  const defaultIndex =
    weekNumbers.length > 0
      ? hasCurrentWeek
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
      : 0

  const [savedWeek, setSavedWeek] = useState<number | null>(() =>
    readSessionWeek(campaignId),
  )

  useEffect(() => {
    setSavedWeek(readSessionWeek(campaignId))
  }, [campaignId])

  const savedIndex = savedWeek !== null ? weekNumbers.indexOf(savedWeek) : -1
  const activeIndex = savedIndex !== -1 ? savedIndex : defaultIndex
  const selectedWeek = weekNumbers[activeIndex] ?? 0
  const canGoPrevious = activeIndex > 0
  const canGoNext = activeIndex < weekNumbers.length - 1
  const previousWeekNumber = canGoPrevious
    ? weekNumbers[activeIndex - 1] ?? null
    : null
  const nextWeekNumber = canGoNext ? weekNumbers[activeIndex + 1] ?? null : null

  const navigateTo = (index: number) => {
    if (index < 0 || index >= weekNumbers.length) return
    const week = weekNumbers[index]
    if (week !== undefined) {
      writeSessionWeek(campaignId, week)
      setSavedWeek(week)
    }
  }

  const currentWeekStart = electionDateObj
    ? addWeeks(electionDateObj, -selectedWeek)
    : startOfWeek(new Date(), { weekStartsOn: 0 })

  const filteredTasks = tasks.filter((t) => t.week === selectedWeek)

  return {
    selectedWeek,
    weeksUntilElection,
    previousWeekNumber,
    nextWeekNumber,
    currentWeekStart,
    filteredTasks,
    canGoPrevious,
    canGoNext,
    goToPrevious: () => navigateTo(activeIndex - 1),
    goToNext: () => navigateTo(activeIndex + 1),
  }
}
