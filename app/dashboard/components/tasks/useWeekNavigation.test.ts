import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  addWeeks,
  addDays,
  differenceInWeeks,
  format,
  startOfWeek,
} from 'date-fns'
import { useWeekNavigation } from './useWeekNavigation'
import type { Task } from './TaskItem'
import { TASK_TYPES } from '../../shared/constants/tasks.const'

function makeTask(overrides: Partial<Task> & { week: number }): Task {
  return {
    id: `task-${overrides.week}`,
    title: `Task week ${overrides.week}`,
    description: '',
    flowType: TASK_TYPES.education,
    completed: false,
    ...overrides,
  }
}

describe('useWeekNavigation', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('computes currentWeekStart as election-relative, not calendar-snapped', () => {
    const election = new Date('2026/11/03')
    const week = 30
    const tasks = [makeTask({ week })]
    const daysUntilElection = 200
    const weeksUntilElection = Math.ceil(daysUntilElection / 7)

    const { result } = renderHook(() =>
      useWeekNavigation(tasks, 'campaign-1', election, daysUntilElection),
    )

    const expected = addWeeks(election, -weeksUntilElection)
    expect(result.current.currentWeekStart.getTime()).toBe(expected.getTime())
  })

  it('task dates assigned via ceil fall within the week header range', () => {
    const election = new Date('2026/11/03')
    const taskDate = new Date('2026/04/14')
    const weekNumber = differenceInWeeks(election, taskDate, {
      roundingMethod: 'ceil',
    })
    const tasks = [
      makeTask({ week: weekNumber, date: format(taskDate, 'yyyy-MM-dd') }),
    ]
    const daysUntilElection = 200

    const { result } = renderHook(() =>
      useWeekNavigation(tasks, 'campaign-1', election, daysUntilElection),
    )

    const weekStart = result.current.currentWeekStart
    const weekEnd = addDays(weekStart, 6)
    expect(taskDate.getTime()).toBeGreaterThanOrEqual(weekStart.getTime())
    expect(taskDate.getTime()).toBeLessThanOrEqual(weekEnd.getTime())
  })

  it('selects the week closest to current weeksUntilElection', () => {
    const election = new Date('2026/11/03')
    const daysUntilElection = 77
    const weeksUntilElection = Math.ceil(daysUntilElection / 7)
    const tasks = [makeTask({ week: 10 }), makeTask({ week: 20 })]

    const { result } = renderHook(() =>
      useWeekNavigation(tasks, 'campaign-1', election, daysUntilElection),
    )

    expect(result.current.selectedWeek).toBe(weeksUntilElection)
  })

  it('filters tasks to only the selected week', () => {
    const election = new Date('2026/11/03')
    const tasks = [
      makeTask({ id: 'a', week: 10 }),
      makeTask({ id: 'b', week: 10 }),
      makeTask({ id: 'c', week: 20 }),
    ]

    const { result } = renderHook(() =>
      useWeekNavigation(tasks, 'campaign-1', election, 70),
    )

    expect(result.current.filteredTasks).toHaveLength(2)
    expect(result.current.filteredTasks.map((t) => t.id)).toEqual(['a', 'b'])
  })

  it('navigates between weeks', () => {
    const election = new Date('2026/11/03')
    const tasks = [
      makeTask({ week: 30 }),
      makeTask({ week: 20 }),
      makeTask({ week: 10 }),
    ]

    const { result } = renderHook(() =>
      useWeekNavigation(tasks, 'campaign-1', election, 140),
    )

    expect(result.current.selectedWeek).toBe(20)
    expect(result.current.canGoPrevious).toBe(true)
    expect(result.current.canGoNext).toBe(true)

    act(() => result.current.goToNext())
    expect(result.current.selectedWeek).toBe(10)

    act(() => result.current.goToPrevious())
    expect(result.current.selectedWeek).toBe(20)
  })

  it('persists selected week in sessionStorage', () => {
    const election = new Date('2026/11/03')
    const tasks = [makeTask({ week: 30 }), makeTask({ week: 20 })]

    const { result, unmount } = renderHook(() =>
      useWeekNavigation(tasks, 'campaign-1', election, 196),
    )

    act(() => result.current.goToNext())
    expect(result.current.selectedWeek).toBe(20)
    unmount()

    const { result: result2 } = renderHook(() =>
      useWeekNavigation(tasks, 'campaign-1', election, 175),
    )
    expect(result2.current.selectedWeek).toBe(20)
  })

  it('returns fallback date when electionDateObj is null', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026/06/10 12:00:00'))

    try {
      const tasks = [makeTask({ week: 5 })]

      const { result } = renderHook(() =>
        useWeekNavigation(tasks, 'campaign-1', null, Infinity),
      )

      expect(result.current.selectedWeek).toBe(5)
      expect(result.current.filteredTasks).toHaveLength(1)
      expect(result.current.currentWeekStart.getTime()).toBe(
        startOfWeek(new Date(), { weekStartsOn: 0 }).getTime(),
      )
    } finally {
      vi.useRealTimers()
    }
  })

  it('includes current week even when no tasks exist for it', () => {
    const election = new Date('2026/11/03')
    const daysUntilElection = 49
    const weeksUntilElection = Math.ceil(daysUntilElection / 7)
    const nextWeek = weeksUntilElection - 1
    const tasks = [makeTask({ week: nextWeek })]

    const { result } = renderHook(() =>
      useWeekNavigation(tasks, 'campaign-1', election, daysUntilElection),
    )

    expect(result.current.selectedWeek).toBe(weeksUntilElection)
    expect(result.current.filteredTasks).toHaveLength(0)
    expect(result.current.canGoNext).toBe(true)
  })
})
