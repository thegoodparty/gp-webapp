import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import DeleteAccountPage from './DeleteAccountPage'

vi.mock('gpApi/clientFetch', () => ({
  clientFetch: vi.fn(),
}))

vi.mock('@clerk/nextjs', () => ({
  useClerk: vi.fn(() => ({ signOut: vi.fn() })),
}))

vi.mock('@shared/hooks/useUser', () => ({
  useUser: vi.fn(() => [{ id: 42 }, vi.fn(), false]),
}))

import { clientFetch } from 'gpApi/clientFetch'
import { useClerk } from '@clerk/nextjs'

const mockClientFetch = vi.mocked(clientFetch)
const mockUseClerk = vi.mocked(useClerk)

beforeEach(() => {
  vi.clearAllMocks()
  mockUseClerk.mockReturnValue({ signOut: vi.fn() } as unknown as ReturnType<typeof useClerk>)
})

describe('DeleteAccountPage', () => {
  it('renders the Delete Account button and no modal on initial load', () => {
    render(<DeleteAccountPage />)
    expect(
      screen.getByRole('button', { name: /delete account/i }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the confirmation modal when Delete Account is clicked', () => {
    render(<DeleteAccountPage />)
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }))
    expect(screen.getByText(/this cannot be undone/i)).toBeInTheDocument()
  })

  it('closes the modal when Cancel is clicked', () => {
    render(<DeleteAccountPage />)
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }))
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByText(/this cannot be undone/i)).not.toBeInTheDocument()
  })

  it('calls clientFetch then signOut on 204 success', async () => {
    const mockSignOut = vi.fn()
    mockUseClerk.mockReturnValue({ signOut: mockSignOut } as ReturnType<typeof useClerk>)
    mockClientFetch.mockResolvedValue({ ok: true, status: 204, statusText: 'No Content', data: null })

    render(<DeleteAccountPage />)
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }))
    fireEvent.click(screen.getByRole('button', { name: /delete my account/i }))

    await waitFor(() => {
      expect(mockClientFetch).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'DELETE' }),
        { id: 42 },
      )
      expect(mockSignOut).toHaveBeenCalledWith({ redirectUrl: '/' })
    })
  })

  it('treats 404 as success and calls signOut', async () => {
    const mockSignOut = vi.fn()
    mockUseClerk.mockReturnValue({ signOut: mockSignOut } as ReturnType<typeof useClerk>)
    mockClientFetch.mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found', data: null })

    render(<DeleteAccountPage />)
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }))
    fireEvent.click(screen.getByRole('button', { name: /delete my account/i }))

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledWith({ redirectUrl: '/' })
    })
  })

  it('shows error message and does not call signOut on API failure', async () => {
    const mockSignOut = vi.fn()
    mockUseClerk.mockReturnValue({ signOut: mockSignOut } as ReturnType<typeof useClerk>)
    mockClientFetch.mockResolvedValue({ ok: false, status: 500, statusText: 'Internal Server Error', data: null })

    render(<DeleteAccountPage />)
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }))
    fireEvent.click(screen.getByRole('button', { name: /delete my account/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(mockSignOut).not.toHaveBeenCalled()
  })
})
