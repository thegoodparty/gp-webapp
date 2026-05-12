import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePostElectionState } from './usePostElectionState'

const mockUseCampaign = vi.fn()

vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: () => mockUseCampaign(),
}))

const daysFromNow = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const setCampaign = (overrides: {
  electionDate?: string
  primaryElectionDate?: string
  primaryResult?: 'won' | 'lost' | null
  goalsElectionDate?: string
}) => {
  mockUseCampaign.mockReturnValue([
    {
      id: 'campaign-1',
      details: {
        electionDate: overrides.electionDate,
        primaryElectionDate: overrides.primaryElectionDate,
        primaryResult: overrides.primaryResult ?? null,
      },
      goals: overrides.goalsElectionDate
        ? { electionDate: overrides.goalsElectionDate }
        : undefined,
    },
  ])
}

describe('usePostElectionState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns electionInPast=false when the general election is in the future', () => {
    setCampaign({ electionDate: daysFromNow(60) })

    const { result } = renderHook(() => usePostElectionState())

    expect(result.current.electionInPast).toBe(false)
    expect(result.current.primaryLost).toBe(false)
    expect(result.current.primaryResultModalOpen).toBe(false)
  })

  it('returns electionInPast=true when the general election is in the past', () => {
    setCampaign({ electionDate: daysFromNow(-30) })

    const { result } = renderHook(() => usePostElectionState())

    expect(result.current.electionInPast).toBe(true)
  })

  it('falls back to goals.electionDate when details.electionDate is missing', () => {
    setCampaign({ goalsElectionDate: daysFromNow(-30) })

    const { result } = renderHook(() => usePostElectionState())

    expect(result.current.electionInPast).toBe(true)
  })

  it('opens the primary result modal when the primary date is past and no result is recorded', () => {
    setCampaign({
      electionDate: daysFromNow(60),
      primaryElectionDate: daysFromNow(-10),
    })

    const { result } = renderHook(() => usePostElectionState())

    expect(result.current.primaryResultModalOpen).toBe(true)
    expect(result.current.electionInPast).toBe(false)
  })

  it('does not open the modal when the primary date is in the future', () => {
    setCampaign({
      electionDate: daysFromNow(120),
      primaryElectionDate: daysFromNow(30),
    })

    const { result } = renderHook(() => usePostElectionState())

    expect(result.current.primaryResultModalOpen).toBe(false)
  })

  it('marks electionInPast=true when general and primary dates are the same and both have passed', () => {
    const sameDate = daysFromNow(-5)
    setCampaign({
      electionDate: sameDate,
      primaryElectionDate: sameDate,
    })

    const { result } = renderHook(() => usePostElectionState())

    expect(result.current.electionInPast).toBe(true)
  })

  it('does not open the modal when the general election is also in the past', () => {
    setCampaign({
      electionDate: daysFromNow(-5),
      primaryElectionDate: daysFromNow(-30),
    })

    const { result } = renderHook(() => usePostElectionState())

    expect(result.current.electionInPast).toBe(true)
    expect(result.current.primaryResultModalOpen).toBe(false)
  })

  it('does not open the modal when a primary result is already recorded', () => {
    setCampaign({
      electionDate: daysFromNow(60),
      primaryElectionDate: daysFromNow(-10),
      primaryResult: 'won',
    })

    const { result } = renderHook(() => usePostElectionState())

    expect(result.current.primaryResultModalOpen).toBe(false)
  })

  it("closePrimaryResultModal('lost') sets primaryLost and closes the modal", () => {
    setCampaign({
      electionDate: daysFromNow(60),
      primaryElectionDate: daysFromNow(-10),
    })

    const { result } = renderHook(() => usePostElectionState())
    expect(result.current.primaryResultModalOpen).toBe(true)

    act(() => {
      result.current.closePrimaryResultModal('lost')
    })

    expect(result.current.primaryResultModalOpen).toBe(false)
    expect(result.current.primaryLost).toBe(true)
  })

  it("closePrimaryResultModal('won') closes the modal without marking lost", () => {
    setCampaign({
      electionDate: daysFromNow(60),
      primaryElectionDate: daysFromNow(-10),
    })

    const { result } = renderHook(() => usePostElectionState())

    act(() => {
      result.current.closePrimaryResultModal('won')
    })

    expect(result.current.primaryResultModalOpen).toBe(false)
    expect(result.current.primaryLost).toBe(false)
  })

  it('cancelling closePrimaryResultModal dismisses the modal without recording a result', () => {
    setCampaign({
      electionDate: daysFromNow(60),
      primaryElectionDate: daysFromNow(-10),
    })

    const { result } = renderHook(() => usePostElectionState())
    expect(result.current.primaryResultModalOpen).toBe(true)

    act(() => {
      result.current.closePrimaryResultModal()
    })

    expect(result.current.primaryResultModalOpen).toBe(false)
    expect(result.current.primaryLost).toBe(false)
  })

  it('respects a persisted primaryResult that arrives after the hook mounts', () => {
    // Simulate CampaignProvider returning [null] before the campaign loads
    mockUseCampaign.mockReturnValue([null])

    const { result, rerender } = renderHook(() => usePostElectionState())
    expect(result.current.primaryResultModalOpen).toBe(false)

    // Campaign resolves with a persisted result for a past primary
    setCampaign({
      electionDate: daysFromNow(60),
      primaryElectionDate: daysFromNow(-10),
      primaryResult: 'won',
    })
    rerender()

    expect(result.current.primaryResultModalOpen).toBe(false)
    expect(result.current.primaryLost).toBe(false)
  })

  it('returns safe defaults when campaign is null', () => {
    mockUseCampaign.mockReturnValue([null])

    const { result } = renderHook(() => usePostElectionState())

    expect(result.current.electionInPast).toBe(false)
    expect(result.current.primaryLost).toBe(false)
    expect(result.current.primaryResultModalOpen).toBe(false)
    expect(result.current.electionDate).toBeUndefined()
    expect(result.current.primaryElectionDate).toBeUndefined()
  })
})
