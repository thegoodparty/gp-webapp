import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CreatePoll } from './CreatePoll'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  })),
}))

// Mock useCampaign hook
vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: vi.fn(() => [
    {
      details: {
        city: 'Springfield',
        office: 'City Council',
        otherOffice: null,
      },
    },
    vi.fn(),
  ]),
}))

// Mock useUser hook
vi.mock('@shared/hooks/useUser', () => ({
  useUser: vi.fn(() => [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
    },
    vi.fn(),
  ]),
}))

// Mock DashboardLayout
vi.mock('../../shared/DashboardLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}))

// Mock StepIndicator
vi.mock('@shared/stepper', () => ({
  StepIndicator: () => <div data-testid="step-indicator" />,
}))

// Mock H1 typography
vi.mock('@shared/typography/H1', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <h1>{children}</h1>
  ),
}))

// Mock analytics
vi.mock('helpers/analyticsHelper', () => ({
  EVENTS: {
    createPoll: {
      pollQuestionViewed: 'pollQuestionViewed',
      pollQuestionCompleted: 'pollQuestionCompleted',
    },
  },
  trackEvent: vi.fn(),
}))

// Mock PollTextBiasInput
vi.mock('../shared/components/poll-text-bias/PollTextBiasInput', () => ({
  default: ({ value, onChange, placeholder }: any) => (
    <textarea
      data-testid="poll-text-bias-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}))

// Mock QuestionFeedback
vi.mock('./QuestionFeedback', () => ({
  QuestionFeedback: () => <div data-testid="question-feedback" />,
}))

// Mock uuidv7
vi.mock('uuidv7', () => ({
  uuidv7: () => 'test-uuid-123',
}))

describe('CreatePoll', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Poll Introduction Dropdown', () => {
    it('renders the Poll Introduction select dropdown', () => {
      render(<CreatePoll pathname="/dashboard/polls/create" />)

      expect(screen.getByText('Poll Introduction')).toBeInTheDocument()
      // The select trigger should have the placeholder text
      expect(screen.getByText('Select your introduction')).toBeInTheDocument()
    })

    it('renders introduction options with whitespace-normal class for text wrapping', async () => {
      render(<CreatePoll pathname="/dashboard/polls/create" />)

      // Find the select trigger by its placeholder text and click it
      const trigger = screen.getByText('Select your introduction').closest('button')
      expect(trigger).toBeInTheDocument()
      fireEvent.click(trigger!)

      // Find the select content and check it has max-width class
      const selectContent = document.querySelector('[data-slot="select-content"]')
      expect(selectContent).toHaveClass('max-w-[calc(100vw-2rem)]')

      // Find select items and verify they have whitespace-normal class
      const selectItems = document.querySelectorAll('[data-slot="select-item"]')
      expect(selectItems.length).toBeGreaterThan(0)
      selectItems.forEach((item) => {
        expect(item).toHaveClass('whitespace-normal')
      })
    })

    it('shows all introduction options in the dropdown', () => {
      render(<CreatePoll pathname="/dashboard/polls/create" />)

      // Find the select trigger by its placeholder text and click it
      const trigger = screen.getByText('Select your introduction').closest('button')
      expect(trigger).toBeInTheDocument()
      fireEvent.click(trigger!)

      // Check that all introduction options are rendered
      // Radix UI uses a hidden select with options as a fallback
      // Note: grammarizeOfficeName transforms "City Council" to "City Council Member"
      const hiddenSelect = document.querySelector('select[aria-hidden="true"]')
      expect(hiddenSelect).toBeInTheDocument()

      const options = hiddenSelect?.querySelectorAll('option')
      expect(options?.length).toBe(4) // 4 introduction options

      // Verify at least one option contains the expected text pattern
      const optionTexts = Array.from(options || []).map(opt => opt.textContent)
      expect(optionTexts.some(text => text?.includes('John Doe'))).toBe(true)
      expect(optionTexts.some(text => text?.includes('Springfield'))).toBe(true)
    })
  })
})
