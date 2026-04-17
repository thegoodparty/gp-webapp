import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import ImpersonatePageContent from './ImpersonatePageContent'

// Mock the Clerk hooks
const mockSignOut = vi.fn()
const mockSetActive = vi.fn()
const mockSignInCreate = vi.fn()
const mockRouterPush = vi.fn()
const mockRouterRefresh = vi.fn()
const mockGet = vi.fn()

vi.mock('@clerk/nextjs', () => ({
  useClerk: () => ({
    client: {
      signIn: {
        create: mockSignInCreate,
      },
    },
    setActive: mockSetActive,
    signOut: mockSignOut,
    loaded: true,
  }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    refresh: mockRouterRefresh,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}))

beforeEach(() => {
  mockSignOut.mockReset()
  mockSetActive.mockReset()
  mockSignInCreate.mockReset()
  mockRouterPush.mockReset()
  mockRouterRefresh.mockReset()
  mockGet.mockReset()

  // Default mock implementations
  mockSignOut.mockResolvedValue(undefined)
  mockSetActive.mockResolvedValue(undefined)
})

describe('ImpersonatePageContent', () => {
  it('shows error when no ticket is provided', async () => {
    mockGet.mockReturnValue(null)

    render(<ImpersonatePageContent />)

    await waitFor(() => {
      expect(screen.getByText('Impersonation failed')).toBeInTheDocument()
      expect(screen.getByText('No ticket provided in URL')).toBeInTheDocument()
    })
  })

  it('shows loading message when processing', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === '__clerk_ticket') return 'test_ticket'
      if (key === 'redirect') return '/dashboard'
      return null
    })

    // Make signInCreate pending
    mockSignInCreate.mockReturnValue(new Promise(() => {}))

    render(<ImpersonatePageContent />)

    expect(
      screen.getByText('Setting up impersonation session…'),
    ).toBeInTheDocument()
  })

  it('creates Clerk session with ticket and redirects to dashboard by default', async () => {
    mockGet.mockImplementation((key: string) => {
      if (key === '__clerk_ticket') return 'test_ticket_123'
      if (key === 'redirect') return null // No redirect param, should default to /dashboard
      return null
    })

    mockSignInCreate.mockResolvedValue({
      status: 'complete',
      createdSessionId: 'session_123',
    })

    render(<ImpersonatePageContent />)

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(mockSignInCreate).toHaveBeenCalledWith({
        strategy: 'ticket',
        ticket: 'test_ticket_123',
      })
    })

    await waitFor(() => {
      expect(mockSetActive).toHaveBeenCalledWith({ session: 'session_123' })
    })

    await waitFor(() => {
      expect(mockRouterRefresh).toHaveBeenCalled()
      expect(mockRouterPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('redirects to custom path when redirect param is provided', async () => {
    mockGet.mockImplementation((key: string) => {
      if (key === '__clerk_ticket') return 'test_ticket_456'
      if (key === 'redirect') return '/'
      return null
    })

    mockSignInCreate.mockResolvedValue({
      status: 'complete',
      createdSessionId: 'session_456',
    })

    render(<ImpersonatePageContent />)

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/')
    })
  })

  it('shows error when sign-in status is not complete', async () => {
    mockGet.mockImplementation((key: string) => {
      if (key === '__clerk_ticket') return 'test_ticket'
      return null
    })

    mockSignInCreate.mockResolvedValue({
      status: 'needs_verification',
      createdSessionId: null,
    })

    render(<ImpersonatePageContent />)

    await waitFor(() => {
      expect(screen.getByText('Impersonation failed')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Impersonation sign-in not complete (status: needs_verification)',
        ),
      ).toBeInTheDocument()
    })
  })

  it('shows error when no session is created', async () => {
    mockGet.mockImplementation((key: string) => {
      if (key === '__clerk_ticket') return 'test_ticket'
      return null
    })

    mockSignInCreate.mockResolvedValue({
      status: 'complete',
      createdSessionId: null,
    })

    render(<ImpersonatePageContent />)

    await waitFor(() => {
      expect(screen.getByText('Impersonation failed')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Impersonation did not create a session (status: complete)',
        ),
      ).toBeInTheDocument()
    })
  })

  it('shows error when sign-in throws', async () => {
    mockGet.mockImplementation((key: string) => {
      if (key === '__clerk_ticket') return 'invalid_ticket'
      return null
    })

    mockSignInCreate.mockRejectedValue(new Error('Invalid ticket'))

    render(<ImpersonatePageContent />)

    await waitFor(() => {
      expect(screen.getByText('Impersonation failed')).toBeInTheDocument()
      expect(screen.getByText('Invalid ticket')).toBeInTheDocument()
    })
  })

  it('signs out existing session before creating impersonation session', async () => {
    mockGet.mockImplementation((key: string) => {
      if (key === '__clerk_ticket') return 'test_ticket'
      return null
    })

    mockSignInCreate.mockResolvedValue({
      status: 'complete',
      createdSessionId: 'session_new',
    })

    render(<ImpersonatePageContent />)

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
    })

    // Verify signInCreate is called after signOut
    expect(mockSignOut.mock.invocationCallOrder[0]).toBeLessThan(
      mockSignInCreate.mock.invocationCallOrder[0],
    )
  })
})
