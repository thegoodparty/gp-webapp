import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import ImpersonationBanner from './ImpersonationBanner'

const mockClientRequest = vi.fn()
vi.mock('gpApi/typed-request', () => ({
  clientRequest: (...args: unknown[]) => mockClientRequest(...args),
}))

const mockSignOut = vi.fn()
const mockSetActive = vi.fn()
const mockSignInCreate = vi.fn()
const mockErrorSnackbar = vi.fn()

vi.mock('@shared/hooks/useIsImpersonating', () => ({
  useIsImpersonating: vi.fn(),
}))

vi.mock('@shared/hooks/useUser', () => ({
  useUser: vi.fn(),
}))

vi.mock('@clerk/nextjs', () => ({
  useClerk: vi.fn(),
  useAuth: vi.fn(),
}))

vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: vi.fn(),
}))

import { useIsImpersonating } from '@shared/hooks/useIsImpersonating'
import { useUser } from '@shared/hooks/useUser'
import { useClerk, useAuth } from '@clerk/nextjs'
import { useSnackbar } from 'helpers/useSnackbar'

beforeEach(() => {
  mockClientRequest.mockReset()
  mockSignOut.mockReset().mockResolvedValue(undefined)
  mockSetActive.mockReset().mockResolvedValue(undefined)
  mockSignInCreate.mockReset().mockResolvedValue({
    status: 'complete',
    createdSessionId: 'session-123',
  })
  mockErrorSnackbar.mockReset()

  vi.mocked(useIsImpersonating).mockReturnValue(false)
  vi.mocked(useClerk).mockReturnValue({
    signOut: mockSignOut,
    client: { signIn: { create: mockSignInCreate } },
    setActive: mockSetActive,
    loaded: true,
  } as any)
  vi.mocked(useAuth).mockReturnValue({
    actor: { sub: 'admin-clerk-id' },
  } as any)
  vi.mocked(useUser).mockReturnValue([
    { email: 'target@example.com' } as any,
    vi.fn(),
    false,
  ])
  vi.mocked(useSnackbar).mockReturnValue({
    errorSnackbar: mockErrorSnackbar,
    successSnackbar: vi.fn(),
  } as any)
})

describe('ImpersonationBanner', () => {
  it('renders nothing when not impersonating', () => {
    render(<ImpersonationBanner />)
    expect(screen.queryByText(/impersonating/i)).not.toBeInTheDocument()
  })

  it('shows the impersonated user email', () => {
    vi.mocked(useIsImpersonating).mockReturnValue(true)
    render(<ImpersonationBanner />)
    expect(screen.getByText('target@example.com')).toBeInTheDocument()
  })

  it('falls back to "this user" when email is unavailable', () => {
    vi.mocked(useIsImpersonating).mockReturnValue(true)
    vi.mocked(useUser).mockReturnValue([null, vi.fn(), false])
    render(<ImpersonationBanner />)
    expect(screen.getByText('this user')).toBeInTheDocument()
  })

  it('opens search popover when email is clicked', async () => {
    vi.mocked(useIsImpersonating).mockReturnValue(true)
    const user = userEvent.setup()
    render(<ImpersonationBanner />)

    await user.click(screen.getByText('target@example.com'))

    expect(screen.getByPlaceholderText(/search by email/i)).toBeInTheDocument()
  })

  it('closes popover when Escape is pressed', async () => {
    vi.mocked(useIsImpersonating).mockReturnValue(true)
    const user = userEvent.setup()
    render(<ImpersonationBanner />)

    await user.click(screen.getByText('target@example.com'))
    expect(screen.getByPlaceholderText(/search by email/i)).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(
      screen.queryByPlaceholderText(/search by email/i),
    ).not.toBeInTheDocument()
  })

  it('shows search results after typing', async () => {
    vi.mocked(useIsImpersonating).mockReturnValue(true)
    const user = userEvent.setup()

    mockClientRequest.mockResolvedValue({
      ok: true,
      status: 200,
      data: { id: 5, email: 'found@example.com', name: 'Found User' },
    })

    render(<ImpersonationBanner />)
    await user.click(screen.getByText('target@example.com'))
    await user.type(screen.getByPlaceholderText(/search by email/i), 'found')

    await waitFor(
      () => {
        expect(screen.getByText('found@example.com')).toBeInTheDocument()
      },
      { timeout: 2000 },
    )
  })

  it('shows "No user found" when search returns null', async () => {
    vi.mocked(useIsImpersonating).mockReturnValue(true)
    const user = userEvent.setup()

    mockClientRequest.mockResolvedValue({ ok: true, status: 200, data: null })

    render(<ImpersonationBanner />)
    await user.click(screen.getByText('target@example.com'))
    await user.type(screen.getByPlaceholderText(/search by email/i), 'nobody')

    await waitFor(
      () => {
        expect(screen.getByText(/no user found/i)).toBeInTheDocument()
      },
      { timeout: 2000 },
    )
  })

  it('swaps impersonation when a result is clicked', async () => {
    vi.mocked(useIsImpersonating).mockReturnValue(true)
    const user = userEvent.setup()

    mockClientRequest.mockImplementation((route: string) => {
      if (route === 'GET /v1/admin/users/search') {
        return Promise.resolve({
          ok: true,
          status: 200,
          data: { id: 7, email: 'new@example.com', name: null },
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        data: { token: 'actor-token-xyz' },
      })
    })

    render(<ImpersonationBanner />)
    await user.click(screen.getByText('target@example.com'))
    await user.type(screen.getByPlaceholderText(/search by email/i), 'new')

    await waitFor(
      () => {
        expect(screen.getByText('new@example.com')).toBeInTheDocument()
      },
      { timeout: 2000 },
    )

    await user.click(screen.getByText('new@example.com'))

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
    })
    expect(mockSignInCreate).toHaveBeenCalledWith({
      strategy: 'ticket',
      ticket: 'actor-token-xyz',
    })
    expect(mockSetActive).toHaveBeenCalledWith({ session: 'session-123' })
  })

  it('shows error snackbar when impersonation swap fails', async () => {
    vi.mocked(useIsImpersonating).mockReturnValue(true)
    const user = userEvent.setup()

    mockClientRequest.mockImplementation((route: string) => {
      if (route === 'GET /v1/admin/users/search') {
        return Promise.resolve({
          ok: true,
          status: 200,
          data: { id: 7, email: 'new@example.com', name: null },
        })
      }
      return Promise.resolve({ ok: false, status: 500, data: null })
    })

    render(<ImpersonationBanner />)
    await user.click(screen.getByText('target@example.com'))
    await user.type(screen.getByPlaceholderText(/search by email/i), 'new')

    await waitFor(
      () => {
        expect(screen.getByText('new@example.com')).toBeInTheDocument()
      },
      { timeout: 2000 },
    )

    await user.click(screen.getByText('new@example.com'))

    await waitFor(() => {
      expect(mockErrorSnackbar).toHaveBeenCalled()
    })
    expect(mockSignOut).not.toHaveBeenCalled()
  })
})
