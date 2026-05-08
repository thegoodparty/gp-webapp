import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useState } from 'react'
import { act, screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import AudienceStep from './AudienceStep'
import type { AudienceFiltersState } from 'app/dashboard/voter-records/components/CustomVoterAudienceFilters'

const mockCountVoterFile = vi.fn()

vi.mock('app/dashboard/voter-records/[type]/components/RecordCount', () => ({
  countVoterFile: (...args: unknown[]) => mockCountVoterFile(...args),
}))

vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: () => [{ id: 1, hasFreeTextsOffer: false }],
}))

vi.mock(
  'app/dashboard/components/tasks/flows/hooks/P2pUxEnabledProvider',
  () => ({
    useP2pUxEnabled: () => ({ p2pUxEnabled: false }),
  }),
)

vi.mock(
  'app/dashboard/voter-records/components/CustomVoterAudienceFilters',
  () => ({
    default: () => null,
    TRACKING_KEYS: { scheduleCampaign: 'scheduleCampaign' },
  }),
)

const deferred = <T,>() => {
  let resolve!: (v: T) => void
  let reject!: (e?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('AudienceStep voter-count race', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockCountVoterFile.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("ignores a stale earlier response that arrives after a newer one", async () => {
    const onChangeCallback = vi.fn()
    const warn = vi.spyOn(console, 'warn').mockImplementation(vi.fn())

    const callA = deferred<number>()
    const callB = deferred<number>()
    mockCountVoterFile
      .mockImplementationOnce(() => callA.promise)
      .mockImplementationOnce(() => callB.promise)

    let setAudience!: (value: AudienceFiltersState) => void
    const Wrapper = () => {
      const [audience, setState] = useState<AudienceFiltersState>({
        party_independent: true,
      })
      setAudience = setState
      return (
        <AudienceStep
          type="text"
          audience={audience}
          onChangeCallback={onChangeCallback}
          nextCallback={vi.fn()}
          backCallback={vi.fn()}
        />
      )
    }

    render(<Wrapper />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })
    expect(mockCountVoterFile).toHaveBeenCalledTimes(1)

    act(() => {
      setAudience({ party_independent: true, gender_unknown: true })
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })
    expect(mockCountVoterFile).toHaveBeenCalledTimes(2)

    await act(async () => {
      callB.resolve(200)
      await vi.advanceTimersByTimeAsync(0)
    })

    expect(screen.getByText('200')).toBeInTheDocument()
    expect(onChangeCallback).toHaveBeenLastCalledWith('voterCount', 200)

    await act(async () => {
      callA.resolve(500)
      await vi.advanceTimersByTimeAsync(0)
    })

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Dropping stale voter-count response'),
    )
    expect(screen.getByText('200')).toBeInTheDocument()
    const voterCountCalls = onChangeCallback.mock.calls.filter(
      ([key]) => key === 'voterCount',
    )
    expect(voterCountCalls.at(-1)).toEqual(['voterCount', 200])

    warn.mockRestore()
  })
})
