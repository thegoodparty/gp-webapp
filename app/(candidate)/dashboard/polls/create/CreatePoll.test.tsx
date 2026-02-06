import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

// Mock all the dependencies
vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: () => [
    {
      details: {
        city: 'San Francisco',
        office: 'City Council',
        otherOffice: null,
      },
    },
    vi.fn(),
  ],
}))

vi.mock('@shared/hooks/useUser', () => ({
  useUser: () => [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      metaData: { hubspotId: '123' },
    },
    vi.fn(),
  ],
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('helpers/analyticsHelper', () => ({
  EVENTS: {
    createPoll: {
      pollQuestionViewed: 'test',
      pollQuestionCompleted: 'test',
      audienceSelectionViewed: 'test',
      audienceSelectionCompleted: 'test',
      schedulePollViewed: 'test',
      schedulePollCompleted: 'test',
      addImageViewed: 'test',
      addImageCompleted: 'test',
      pollPreviewViewed: 'test',
      pollPreviewCompleted: 'test',
      paymentViewed: 'test',
      paymentCompleted: 'test',
    },
  },
  trackEvent: vi.fn(),
}))

vi.mock('../../shared/DashboardLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}))

vi.mock('../shared/components/poll-text-bias/PollTextBiasInput', () => ({
  default: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string
    onChange: (value: string) => void
    placeholder: string
  }) => (
    <textarea
      data-testid="poll-text-bias-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}))

import { CreatePoll } from './CreatePoll'

describe('CreatePoll - Poll Introduction Dropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the details form with Poll Introduction label', async () => {
    render(<CreatePoll pathname="/dashboard/polls" />)

    // Wait for the form to render
    await waitFor(() => {
      expect(screen.getByText('Poll Introduction')).toBeInTheDocument()
    })

    // Verify the select trigger exists
    const selectTrigger = screen.getByRole('combobox')
    expect(selectTrigger).toBeInTheDocument()
    expect(selectTrigger).toHaveClass('w-full')
  })

  it('renders the Poll Name input field', async () => {
    render(<CreatePoll pathname="/dashboard/polls" />)

    await waitFor(() => {
      expect(screen.getByText('Poll Name')).toBeInTheDocument()
    })

    const pollNameInput = screen.getByPlaceholderText(
      'What would you like to name your poll?'
    )
    expect(pollNameInput).toBeInTheDocument()
  })

  it('renders the Poll Question textarea', async () => {
    render(<CreatePoll pathname="/dashboard/polls" />)

    await waitFor(() => {
      expect(screen.getByText('Poll Question')).toBeInTheDocument()
    })

    const pollQuestionInput = screen.getByTestId('poll-text-bias-input')
    expect(pollQuestionInput).toBeInTheDocument()
  })

  it('renders the Poll Closing message (disabled)', async () => {
    render(<CreatePoll pathname="/dashboard/polls" />)

    await waitFor(() => {
      expect(screen.getByText('Poll Closing')).toBeInTheDocument()
    })

    const stopMessageInput = screen.getByDisplayValue('Text STOP to opt out')
    expect(stopMessageInput).toBeInTheDocument()
    expect(stopMessageInput).toBeDisabled()
  })
})
