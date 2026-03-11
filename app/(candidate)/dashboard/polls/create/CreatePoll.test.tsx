import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { CreatePoll } from './CreatePoll'
import { render } from 'helpers/test-utils/render'

// Mock scrollIntoView which is not available in jsdom
Element.prototype.scrollIntoView = vi.fn()

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => '/dashboard/polls/create',
}))

// Mock useCampaign hook
vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: () => [
    {
      details: {
        office: 'City Council',
        city: 'Test City',
      },
    },
  ],
}))

// Mock useUser hook
vi.mock('@shared/hooks/useUser', () => ({
  useUser: () => [
    {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      metaData: {},
    },
  ],
}))

// Mock analytics
vi.mock('helpers/analyticsHelper', () => ({
  EVENTS: {
    createPoll: {
      pollQuestionViewed: 'pollQuestionViewed',
      pollQuestionCompleted: 'pollQuestionCompleted',
      audienceSelectionViewed: 'audienceSelectionViewed',
      audienceSelectionCompleted: 'audienceSelectionCompleted',
      schedulePollViewed: 'schedulePollViewed',
      schedulePollCompleted: 'schedulePollCompleted',
      addImageViewed: 'addImageViewed',
      addImageCompleted: 'addImageCompleted',
      pollPreviewViewed: 'pollPreviewViewed',
      pollPreviewCompleted: 'pollPreviewCompleted',
      paymentViewed: 'paymentViewed',
      paymentCompleted: 'paymentCompleted',
    },
  },
  trackEvent: vi.fn(),
}))

// Mock PollTextBiasInput to simplify testing
vi.mock('../shared/components/poll-text-bias/PollTextBiasInput', () => ({
  default: ({ value, onChange, placeholder }: any) => (
    <textarea
      data-testid="poll-question-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}))

// Mock PollImageUpload
vi.mock('../components/PollImageUpload', () => ({
  PollImageUpload: () => <div data-testid="mock-image-upload">Upload Image</div>,
}))

// Mock PollScheduledDateSelector
vi.mock('../components/PollScheduledDateSelector', () => ({
  POLLS_SCHEDULING_COPY: 'Schedule your poll',
  PollScheduledDateSelector: () => (
    <div data-testid="mock-date-selector">Select Date</div>
  ),
}))

// Mock PollPreview
vi.mock('../components/PollPreview', () => ({
  PollPreview: () => <div data-testid="poll-preview">Poll Preview</div>,
}))

// Mock PollPayment
vi.mock('../shared/components/PollPayment', () => ({
  PollPayment: () => <div data-testid="poll-payment">Payment Form</div>,
  PollPurchaseType: { new: 'new' },
}))

// Mock PollPaymentSuccess
vi.mock('../shared/components/PollPaymentSuccess', () => ({
  PollPaymentSuccess: () => (
    <div data-testid="poll-payment-success">Payment Success</div>
  ),
}))

// Mock PollAudienceSelector
vi.mock('../shared/audience-selection', () => ({
  PollAudienceSelection: {},
  PollAudienceSelector: () => (
    <div data-testid="mock-audience-selector">Select Audience Option</div>
  ),
  useTotalConstituentsWithCellPhone: () => ({
    status: 'success',
    data: {
      totalConstituents: 10000,
    },
  }),
}))

// Mock the Select component from goodparty-styleguide to avoid Radix issues
vi.mock('goodparty-styleguide', async (importOriginal) => {
  const actual = (await importOriginal()) as any
  return {
    ...actual,
    Select: ({ children, value, onValueChange }: any) => (
      <select
        data-testid="intro-select"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      >
        {children}
      </select>
    ),
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ children, value }: any) => (
      <option value={value}>{children}</option>
    ),
    SelectTrigger: ({ children }: any) => <>{children}</>,
    SelectValue: () => null,
  }
})

describe('CreatePoll', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Button labels - ENG-6635', () => {
    it('shows "Continue" button instead of "Select Audience" on the first step (First, let\'s build your poll)', () => {
      render(<CreatePoll pathname="/dashboard/polls" />)

      // Verify we're on the first step
      expect(
        screen.getByText("First, let's build your poll."),
      ).toBeInTheDocument()

      // The button should say "Continue" (not "Select Audience")
      const continueButton = screen.getByRole('button', { name: 'Continue' })
      expect(continueButton).toBeInTheDocument()

      // Make sure "Select Audience" is NOT present as a button
      expect(
        screen.queryByRole('button', { name: 'Select Audience' }),
      ).not.toBeInTheDocument()
    })

    it('does not show "Next" button on the first step', () => {
      render(<CreatePoll pathname="/dashboard/polls" />)

      // Make sure "Next" is NOT present as the primary action button on the first step
      // (It should only be "Continue" or navigation buttons like "Exit")
      const allButtons = screen.getAllByRole('button')
      const buttonTexts = allButtons.map((btn) => btn.textContent)

      expect(buttonTexts).toContain('Continue')
      expect(buttonTexts).not.toContain('Select Audience')
    })
  })
})
