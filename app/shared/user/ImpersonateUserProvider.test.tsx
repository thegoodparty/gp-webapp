import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import {
  ImpersonateUserProvider,
  ImpersonateUserContext,
} from './ImpersonateUserProvider'
import { useContext } from 'react'

// Mock dependencies
const mockClientFetch = vi.fn()
const mockGetCookie = vi.fn()
const mockSetCookie = vi.fn()
const mockDeleteCookie = vi.fn()

vi.mock('gpApi/clientFetch', () => ({
  clientFetch: (...args: unknown[]) => mockClientFetch(...args),
}))

vi.mock('helpers/cookieHelper', () => ({
  getCookie: (name: string) => mockGetCookie(name),
  setCookie: (name: string, value: string) => mockSetCookie(name, value),
  deleteCookie: (name: string) => mockDeleteCookie(name),
}))

vi.mock('gpApi/routes', () => ({
  apiRoutes: {
    admin: {
      user: {
        impersonate: {
          path: '/admin/users/impersonate',
          method: 'POST',
        },
      },
    },
  },
}))

const useImpersonateUser = () => useContext(ImpersonateUserContext)

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ImpersonateUserProvider>{children}</ImpersonateUserProvider>
)

beforeEach(() => {
  mockClientFetch.mockReset()
  mockGetCookie.mockReset()
  mockSetCookie.mockReset()
  mockDeleteCookie.mockReset()

  // Default: no existing cookies
  mockGetCookie.mockReturnValue(null)
})

describe('ImpersonateUserProvider', () => {
  describe('initial state', () => {
    it('initializes with null user and token when no cookies exist', () => {
      mockGetCookie.mockReturnValue(null)

      const { result } = renderHook(() => useImpersonateUser(), { wrapper })

      expect(result.current.user).toBeNull()
      expect(result.current.token).toBeNull()
    })

    it('loads user and token from cookies on mount', async () => {
      mockGetCookie.mockImplementation((name: string) => {
        if (name === 'impersonateToken') return 'stored_token'
        if (name === 'impersonateUser')
          return JSON.stringify({ id: '123', email: 'user@test.com' })
        return null
      })

      const { result } = renderHook(() => useImpersonateUser(), { wrapper })

      await waitFor(() => {
        expect(result.current.token).toBe('stored_token')
        expect(result.current.user).toEqual({ id: '123', email: 'user@test.com' })
      })
    })
  })

  describe('impersonate function', () => {
    it('returns the actor token on success', async () => {
      mockClientFetch.mockResolvedValue({
        data: {
          token: 'actor_token_123',
          user: { id: '456', email: 'impersonated@test.com' },
        },
      })

      const { result } = renderHook(() => useImpersonateUser(), { wrapper })

      let token: string | null = null
      await act(async () => {
        token = await result.current.impersonate('impersonated@test.com')
      })

      expect(token).toBe('actor_token_123')
    })

    it('stores token and user in cookies on success', async () => {
      mockClientFetch.mockResolvedValue({
        data: {
          token: 'actor_token_123',
          user: { id: '456', email: 'impersonated@test.com' },
        },
      })

      const { result } = renderHook(() => useImpersonateUser(), { wrapper })

      await act(async () => {
        await result.current.impersonate('impersonated@test.com')
      })

      expect(mockSetCookie).toHaveBeenCalledWith(
        'impersonateToken',
        'actor_token_123',
      )
      expect(mockSetCookie).toHaveBeenCalledWith(
        'impersonateUser',
        JSON.stringify({ id: '456', email: 'impersonated@test.com' }),
      )
    })

    it('updates state on success', async () => {
      mockClientFetch.mockResolvedValue({
        data: {
          token: 'actor_token_123',
          user: { id: '456', email: 'impersonated@test.com' },
        },
      })

      const { result } = renderHook(() => useImpersonateUser(), { wrapper })

      await act(async () => {
        await result.current.impersonate('impersonated@test.com')
      })

      expect(result.current.token).toBe('actor_token_123')
      expect(result.current.user).toEqual({
        id: '456',
        email: 'impersonated@test.com',
      })
    })

    it('returns null when API returns no token', async () => {
      mockClientFetch.mockResolvedValue({
        data: { user: { id: '456', email: 'test@test.com' } },
      })

      const { result } = renderHook(() => useImpersonateUser(), { wrapper })

      let token: string | null = 'initial'
      await act(async () => {
        token = await result.current.impersonate('test@test.com')
      })

      expect(token).toBeNull()
    })

    it('returns null when API returns no user', async () => {
      mockClientFetch.mockResolvedValue({
        data: { token: 'some_token' },
      })

      const { result } = renderHook(() => useImpersonateUser(), { wrapper })

      let token: string | null = 'initial'
      await act(async () => {
        token = await result.current.impersonate('test@test.com')
      })

      expect(token).toBeNull()
    })

    it('returns null when API call fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockClientFetch.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useImpersonateUser(), { wrapper })

      let token: string | null = 'initial'
      await act(async () => {
        token = await result.current.impersonate('test@test.com')
      })

      expect(token).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('error', expect.any(Error))
      consoleSpy.mockRestore()
    })

    it('calls the correct API endpoint with email', async () => {
      mockClientFetch.mockResolvedValue({
        data: {
          token: 'token',
          user: { id: '1', email: 'test@test.com' },
        },
      })

      const { result } = renderHook(() => useImpersonateUser(), { wrapper })

      await act(async () => {
        await result.current.impersonate('target@example.com')
      })

      expect(mockClientFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/admin/users/impersonate',
          method: 'POST',
        }),
        { email: 'target@example.com' },
      )
    })
  })

  describe('clear function', () => {
    it('clears user and token state', async () => {
      mockGetCookie.mockImplementation((name: string) => {
        if (name === 'impersonateToken') return 'stored_token'
        if (name === 'impersonateUser')
          return JSON.stringify({ id: '123', email: 'user@test.com' })
        return null
      })

      const { result } = renderHook(() => useImpersonateUser(), { wrapper })

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.token).toBe('stored_token')
      })

      act(() => {
        result.current.clear()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.token).toBeNull()
    })

    it('deletes cookies when clearing', async () => {
      const { result } = renderHook(() => useImpersonateUser(), { wrapper })

      act(() => {
        result.current.clear()
      })

      expect(mockDeleteCookie).toHaveBeenCalledWith('impersonateToken')
      expect(mockDeleteCookie).toHaveBeenCalledWith('impersonateUser')
    })
  })
})
