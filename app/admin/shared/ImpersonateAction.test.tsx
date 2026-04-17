import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import ImpersonateAction from './ImpersonateAction'

const mockImpersonate = vi.fn()
const mockSuccessSnackbar = vi.fn()
const mockErrorSnackbar = vi.fn()

vi.mock('@shared/hooks/useImpersonateUser', () => ({
  useImpersonateUser: () => ({
    impersonate: mockImpersonate,
  }),
}))

vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: () => ({
    successSnackbar: mockSuccessSnackbar,
    errorSnackbar: mockErrorSnackbar,
  }),
}))

// Mock window.location
const originalLocation = window.location
beforeEach(() => {
  mockImpersonate.mockReset()
  mockSuccessSnackbar.mockReset()
  mockErrorSnackbar.mockReset()

  // Reset location mock
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: '' },
  })
})

afterAll(() => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: originalLocation,
  })
})

describe('ImpersonateAction', () => {
  it('renders the Impersonate button', () => {
    render(
      <ImpersonateAction
        email="test@example.com"
        isCandidate={false}
        launched={undefined}
      />,
    )

    expect(screen.getByText('Impersonate')).toBeInTheDocument()
  })

  it('shows success snackbar when impersonate is clicked', async () => {
    mockImpersonate.mockResolvedValue('actor_token_123')

    render(
      <ImpersonateAction
        email="test@example.com"
        isCandidate={false}
        launched={undefined}
      />,
    )

    const button = screen.getByText('Impersonate')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockSuccessSnackbar).toHaveBeenCalledWith('Impersonating user')
    })
  })

  it('navigates to /impersonate with token for non-candidate users', async () => {
    const testToken = 'actor_token_123'
    mockImpersonate.mockResolvedValue(testToken)

    render(
      <ImpersonateAction
        email="test@example.com"
        isCandidate={false}
        launched={undefined}
      />,
    )

    const button = screen.getByText('Impersonate')
    fireEvent.click(button)

    await waitFor(() => {
      expect(window.location.href).toBe(
        `/impersonate?__clerk_ticket=${encodeURIComponent(testToken)}&redirect=${encodeURIComponent('/')}`,
      )
    })
  })

  it('navigates to /impersonate with dashboard redirect for live candidate', async () => {
    const testToken = 'actor_token_456'
    mockImpersonate.mockResolvedValue(testToken)

    render(
      <ImpersonateAction
        email="candidate@example.com"
        isCandidate={true}
        launched="Live"
      />,
    )

    const button = screen.getByText('Impersonate')
    fireEvent.click(button)

    await waitFor(() => {
      expect(window.location.href).toBe(
        `/impersonate?__clerk_ticket=${encodeURIComponent(testToken)}&redirect=${encodeURIComponent('/dashboard')}`,
      )
    })
  })

  it('navigates to / for candidate without Live status', async () => {
    const testToken = 'actor_token_789'
    mockImpersonate.mockResolvedValue(testToken)

    render(
      <ImpersonateAction
        email="candidate@example.com"
        isCandidate={true}
        launched="Pending"
      />,
    )

    const button = screen.getByText('Impersonate')
    fireEvent.click(button)

    await waitFor(() => {
      expect(window.location.href).toBe(
        `/impersonate?__clerk_ticket=${encodeURIComponent(testToken)}&redirect=${encodeURIComponent('/')}`,
      )
    })
  })

  it('shows error snackbar when impersonate fails', async () => {
    mockImpersonate.mockResolvedValue(null)

    render(
      <ImpersonateAction
        email="test@example.com"
        isCandidate={false}
        launched={undefined}
      />,
    )

    const button = screen.getByText('Impersonate')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockErrorSnackbar).toHaveBeenCalledWith('Impersonate failed')
    })
  })

  it('does not navigate when impersonate fails', async () => {
    mockImpersonate.mockResolvedValue(null)

    render(
      <ImpersonateAction
        email="test@example.com"
        isCandidate={false}
        launched={undefined}
      />,
    )

    const button = screen.getByText('Impersonate')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockErrorSnackbar).toHaveBeenCalled()
    })

    expect(window.location.href).toBe('')
  })
})
