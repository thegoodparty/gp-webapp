import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { User, UserRole } from 'helpers/types'
import { Experiment } from '@amplitude/experiment-js-client'
import { reportErrorToSentry } from '@shared/sentry'
import { buildUserTraits } from 'helpers/buildUserTraits'

const mockExperimentClient = {
  fetch: vi.fn().mockResolvedValue(undefined),
  variant: vi.fn((_key: string, fallback?: unknown) => fallback ?? { value: undefined }),
  all: vi.fn(() => ({})),
  exposure: vi.fn(),
  clear: vi.fn(),
}

vi.mock('@amplitude/experiment-js-client', () => ({
  Experiment: {
    initialize: vi.fn(() => mockExperimentClient),
  },
}))

vi.mock('@shared/utils/analytics', () => ({
  getReadyAnalytics: vi.fn().mockResolvedValue(null),
}))

vi.mock('@shared/sentry', () => ({
  reportErrorToSentry: vi.fn(),
}))

vi.mock('helpers/buildUserTraits', () => ({
  buildUserTraits: vi.fn(),
}))

let mockUser: User | null = null

vi.mock('@shared/hooks/useUser', () => ({
  useUser: () => [mockUser, vi.fn()],
}))

const mockApiKey = vi.hoisted(() => ({ value: 'test-amplitude-key' }))

vi.mock('appEnv', () => ({
  get NEXT_PUBLIC_AMPLITUDE_API_KEY() {
    return mockApiKey.value
  },
}))

import React from 'react'
import {
  FeatureFlagsProvider,
  useFeatureFlags,
  useFlagOn,
} from './FeatureFlagsProvider'

const fullUser: User = {
  id: 42,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  phone: '555-1234',
  zip: '90210',
  roles: [UserRole.candidate],
  hasPassword: true,
}

const fullUserTraits = {
  email: 'jane@example.com',
  name: 'Jane Doe',
  phone: '555-1234',
  zip: '90210',
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
)

beforeEach(() => {
  mockUser = null
  mockApiKey.value = 'test-amplitude-key'
  mockExperimentClient.fetch.mockReset().mockResolvedValue(undefined)
  mockExperimentClient.variant.mockReset().mockImplementation(
    (_key: string, fallback?: unknown) => fallback ?? { value: undefined },
  )
  mockExperimentClient.all.mockReset().mockReturnValue({})
  mockExperimentClient.exposure.mockReset()
  mockExperimentClient.clear.mockReset()
  vi.mocked(Experiment.initialize).mockReset().mockReturnValue(mockExperimentClient as never)
  vi.mocked(reportErrorToSentry).mockReset()
  vi.mocked(buildUserTraits).mockReset().mockReturnValue(fullUserTraits)
})

describe('FeatureFlagsProvider', () => {
  describe('ExperimentUser construction', () => {
    it('fetches with user_id and user_properties from buildUserTraits when user exists', async () => {
      mockUser = fullUser

      renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(mockExperimentClient.fetch).toHaveBeenCalledWith({
          user_id: '42',
          user_properties: fullUserTraits,
        })
      })
      expect(buildUserTraits).toHaveBeenCalledWith(fullUser)
    })

    it('fetches with empty ExperimentUser when no user is logged in', async () => {
      mockUser = null

      renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(mockExperimentClient.fetch).toHaveBeenCalledWith({})
      })
      expect(buildUserTraits).not.toHaveBeenCalled()
    })
  })

  describe('ready state', () => {
    it('becomes ready after successful fetch', async () => {
      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })
    })

    it('becomes ready even when fetch fails', async () => {
      mockExperimentClient.fetch.mockRejectedValueOnce(new Error('network error'))

      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })
    })

    it('becomes ready immediately when no API key is configured', async () => {
      mockApiKey.value = ''

      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })
      expect(Experiment.initialize).not.toHaveBeenCalled()
      expect(mockExperimentClient.fetch).not.toHaveBeenCalled()
    })
  })

  describe('refresh behavior', () => {
    it('returns early without fetching when client is null', async () => {
      mockApiKey.value = ''

      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })

      mockExperimentClient.fetch.mockReset()

      await act(async () => {
        await result.current.refresh()
      })

      expect(mockExperimentClient.fetch).not.toHaveBeenCalled()
    })

    it('calls client.clear() when user identity changes', async () => {
      mockUser = null
      const { result, rerender } = renderHook(() => useFeatureFlags(), {
        wrapper,
      })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })
      mockExperimentClient.clear.mockReset()

      mockUser = fullUser
      rerender()

      await waitFor(() => {
        expect(mockExperimentClient.clear).toHaveBeenCalled()
      })
    })

    it('does not call client.clear() when user identity stays the same', async () => {
      mockUser = fullUser
      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })
      mockExperimentClient.clear.mockReset()

      await act(async () => {
        await result.current.refresh()
      })

      expect(mockExperimentClient.clear).not.toHaveBeenCalled()
    })
  })

  describe('re-fetching on user change', () => {
    it('re-fetches when user changes', async () => {
      mockUser = null
      const { result, rerender } = renderHook(() => useFeatureFlags(), {
        wrapper,
      })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })
      expect(mockExperimentClient.fetch).toHaveBeenCalledTimes(1)
      expect(mockExperimentClient.fetch).toHaveBeenCalledWith({})

      mockUser = fullUser
      rerender()

      await waitFor(() => {
        expect(mockExperimentClient.fetch).toHaveBeenCalledTimes(2)
      })
      expect(mockExperimentClient.fetch).toHaveBeenLastCalledWith({
        user_id: '42',
        user_properties: fullUserTraits,
      })
    })
  })

  describe('error reporting', () => {
    it('reports fetch errors to Sentry', async () => {
      const error = new Error('network error')
      mockExperimentClient.fetch.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })

      expect(reportErrorToSentry).toHaveBeenCalledWith(error, {
        context: 'FeatureFlagsProvider.refresh',
      })
    })

    it('wraps non-Error fetch failures in Error before reporting to Sentry', async () => {
      mockExperimentClient.fetch.mockRejectedValueOnce('string-error')

      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })

      expect(reportErrorToSentry).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'string-error' }),
        { context: 'FeatureFlagsProvider.refresh' },
      )
    })
  })

  describe('client initialization', () => {
    it('initializes the Experiment client only once across re-renders', async () => {
      mockUser = null
      const { result, rerender } = renderHook(() => useFeatureFlags(), {
        wrapper,
      })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })

      mockUser = fullUser
      rerender()

      await waitFor(() => {
        expect(mockExperimentClient.fetch).toHaveBeenCalledTimes(2)
      })

      expect(Experiment.initialize).toHaveBeenCalledTimes(1)
    })
  })

  describe('context value delegation', () => {
    it('delegates variant() to the experiment client', async () => {
      mockExperimentClient.variant.mockReturnValue({ value: 'treatment' })

      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })

      const v = result.current.variant('my-flag')
      expect(mockExperimentClient.variant).toHaveBeenCalledWith('my-flag', undefined)
      expect(v).toEqual({ value: 'treatment' })
    })

    it('delegates all() to the experiment client', async () => {
      mockExperimentClient.all.mockReturnValue({ 'flag-a': { value: 'on' } })

      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })

      const flags = result.current.all()
      expect(flags).toEqual({ 'flag-a': { value: 'on' } })
    })

    it('delegates exposure() to the experiment client', async () => {
      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })

      result.current.exposure('my-flag')
      expect(mockExperimentClient.exposure).toHaveBeenCalledWith('my-flag')
    })

    it('delegates clear() to the experiment client', async () => {
      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })

      result.current.clear()
      expect(mockExperimentClient.clear).toHaveBeenCalled()
    })

    it('refresh() triggers a new fetch', async () => {
      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })
      expect(mockExperimentClient.fetch).toHaveBeenCalledTimes(1)

      await act(async () => {
        await result.current.refresh()
      })

      expect(mockExperimentClient.fetch).toHaveBeenCalledTimes(2)
    })
  })
})

describe('useFlagOn', () => {
  it('returns on=true when variant value is "on" and provider is ready', async () => {
    mockExperimentClient.variant.mockReturnValue({ value: 'on' })

    const { result } = renderHook(() => useFlagOn('my-feature'), { wrapper })

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    expect(result.current.on).toBe(true)
  })

  it('returns on=false when variant value is "off"', async () => {
    mockExperimentClient.variant.mockReturnValue({ value: 'off' })

    const { result } = renderHook(() => useFlagOn('my-feature'), { wrapper })

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    expect(result.current.on).toBe(false)
  })

  it('returns on=false when variant value is undefined', async () => {
    mockExperimentClient.variant.mockReturnValue({ value: undefined })

    const { result } = renderHook(() => useFlagOn('my-feature'), { wrapper })

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    expect(result.current.on).toBe(false)
  })

  it('returns on=false when provider is not ready', () => {
    mockExperimentClient.fetch.mockReturnValue(new Promise(() => { /* never resolves */ }))

    const { result } = renderHook(() => useFlagOn('my-feature'), { wrapper })

    expect(result.current.ready).toBe(false)
    expect(result.current.on).toBe(false)
  })
})
