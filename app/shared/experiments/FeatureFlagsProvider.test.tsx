import { renderHook, act, waitFor } from '@testing-library/react'
import { User, UserRole } from 'helpers/types'

const mockFetch = vi.fn().mockResolvedValue(undefined)
const mockVariant = vi.fn((_key: string, fallback?: unknown) => fallback ?? { value: undefined })
const mockAll = vi.fn(() => ({}))
const mockExposure = vi.fn()
const mockClear = vi.fn()

const mockExperimentClient = {
  fetch: mockFetch,
  variant: mockVariant,
  all: mockAll,
  exposure: mockExposure,
  clear: mockClear,
}

const mockInitialize = vi.fn(() => mockExperimentClient)

vi.mock('@amplitude/experiment-js-client', () => ({
  Experiment: {
    initialize: (...args: unknown[]) => mockInitialize(...args),
  },
}))

vi.mock('@shared/utils/analytics', () => ({
  getReadyAnalytics: vi.fn().mockResolvedValue(null),
}))

const mockReportErrorToSentry = vi.fn()
vi.mock('@shared/sentry', () => ({
  reportErrorToSentry: (...args: unknown[]) => mockReportErrorToSentry(...args),
}))

const mockBuildUserTraits = vi.fn()
vi.mock('helpers/buildUserTraits', () => ({
  buildUserTraits: (...args: unknown[]) => mockBuildUserTraits(...args),
}))

let mockUser: User | null = null
const mockSetUser = vi.fn()

vi.mock('@shared/hooks/useUser', () => ({
  useUser: () => [mockUser, mockSetUser],
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
  mockFetch.mockReset().mockResolvedValue(undefined)
  mockVariant.mockReset().mockImplementation(
    (_key: string, fallback?: unknown) => fallback ?? { value: undefined },
  )
  mockAll.mockReset().mockReturnValue({})
  mockExposure.mockReset()
  mockClear.mockReset()
  mockInitialize.mockReset().mockReturnValue(mockExperimentClient)
  mockReportErrorToSentry.mockReset()
  mockBuildUserTraits.mockReset().mockReturnValue(fullUserTraits)
})

describe('FeatureFlagsProvider', () => {
  describe('ExperimentUser construction', () => {
    it('fetches with user_id and user_properties from buildUserTraits when user exists', async () => {
      mockUser = fullUser

      renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith({
          user_id: '42',
          user_properties: fullUserTraits,
        })
      })
      expect(mockBuildUserTraits).toHaveBeenCalledWith(fullUser)
    })

    it('fetches with empty ExperimentUser when no user is logged in', async () => {
      mockUser = null

      renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith({})
      })
      expect(mockBuildUserTraits).not.toHaveBeenCalled()
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
      mockFetch.mockRejectedValueOnce(new Error('network error'))

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
      expect(mockInitialize).not.toHaveBeenCalled()
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('refresh behavior', () => {
    it('returns early without fetching when client is null', async () => {
      mockApiKey.value = ''

      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })

      mockFetch.mockReset()

      await act(async () => {
        await result.current.refresh()
      })

      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('calls client.clear() when user identity changes', async () => {
      mockUser = null
      const { result, rerender } = renderHook(() => useFeatureFlags(), {
        wrapper,
      })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })
      mockClear.mockReset()

      mockUser = fullUser
      rerender()

      await waitFor(() => {
        expect(mockClear).toHaveBeenCalled()
      })
    })

    it('does not call client.clear() when user identity stays the same', async () => {
      mockUser = fullUser
      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })
      mockClear.mockReset()

      await act(async () => {
        await result.current.refresh()
      })

      expect(mockClear).not.toHaveBeenCalled()
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
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith({})

      mockUser = fullUser
      rerender()

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2)
      })
      expect(mockFetch).toHaveBeenLastCalledWith({
        user_id: '42',
        user_properties: fullUserTraits,
      })
    })
  })

  describe('error reporting', () => {
    it('reports fetch errors to Sentry', async () => {
      const error = new Error('network error')
      mockFetch.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })

      expect(mockReportErrorToSentry).toHaveBeenCalledWith(error, {
        context: 'FeatureFlagsProvider.refresh',
      })
    })

    it('wraps non-Error fetch failures in Error before reporting to Sentry', async () => {
      mockFetch.mockRejectedValueOnce('string-error')

      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })

      expect(mockReportErrorToSentry).toHaveBeenCalledWith(
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
        expect(mockFetch).toHaveBeenCalledTimes(2)
      })

      expect(mockInitialize).toHaveBeenCalledTimes(1)
    })
  })

  describe('context value delegation', () => {
    it('delegates variant() to the experiment client', async () => {
      mockVariant.mockReturnValue({ value: 'treatment' })

      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })

      const v = result.current.variant('my-flag')
      expect(mockVariant).toHaveBeenCalledWith('my-flag', undefined)
      expect(v).toEqual({ value: 'treatment' })
    })

    it('delegates all() to the experiment client', async () => {
      mockAll.mockReturnValue({ 'flag-a': { value: 'on' } })

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
      expect(mockExposure).toHaveBeenCalledWith('my-flag')
    })

    it('delegates clear() to the experiment client', async () => {
      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })

      result.current.clear()
      expect(mockClear).toHaveBeenCalled()
    })

    it('refresh() triggers a new fetch', async () => {
      const { result } = renderHook(() => useFeatureFlags(), { wrapper })

      await waitFor(() => {
        expect(result.current.ready).toBe(true)
      })
      expect(mockFetch).toHaveBeenCalledTimes(1)

      await act(async () => {
        await result.current.refresh()
      })

      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })
})

describe('useFlagOn', () => {
  it('returns on=true when variant value is "on" and provider is ready', async () => {
    mockVariant.mockReturnValue({ value: 'on' })

    const { result } = renderHook(() => useFlagOn('my-feature'), { wrapper })

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    expect(result.current.on).toBe(true)
  })

  it('returns on=false when variant value is "off"', async () => {
    mockVariant.mockReturnValue({ value: 'off' })

    const { result } = renderHook(() => useFlagOn('my-feature'), { wrapper })

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    expect(result.current.on).toBe(false)
  })

  it('returns on=false when variant value is undefined', async () => {
    mockVariant.mockReturnValue({ value: undefined })

    const { result } = renderHook(() => useFlagOn('my-feature'), { wrapper })

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })

    expect(result.current.on).toBe(false)
  })

  it('returns on=false when provider is not ready', () => {
    mockFetch.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useFlagOn('my-feature'), { wrapper })

    expect(result.current.ready).toBe(false)
    expect(result.current.on).toBe(false)
  })
})
