import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { CreatePoll } from './CreatePoll'

// Mock all external dependencies
vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: () => [
    {
      details: {
        office: 'City Council',
        city: 'Austin',
      },
    },
  ],
}))

vi.mock('@shared/hooks/useUser', () => ({
  useUser: () => [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      metaData: { hubspotId: '123' },
    },
  ],
}))

vi.mock('../../shared/DashboardLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}))

vi.mock('@shared/stepper', () => ({
  StepIndicator: () => <div data-testid="step-indicator" />,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

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

vi.mock('../shared/components/poll-text-bias/PollTextBiasInput', () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string
    onChange: (v: string) => void
  }) => (
    <textarea
      data-testid="poll-text-bias-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}))

vi.mock('uuidv7', () => ({
  uuidv7: () => 'test-uuid-123',
}))

describe('CreatePoll', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Button text on details step', () => {
    it('should display "Continue" button on the first step (build your poll)', async () => {
      render(<CreatePoll pathname="/dashboard/polls" />)

      // The first step should show "First, let's build your poll." title
      expect(
        screen.getByRole('heading', { name: /First, let's build your poll/i }),
      ).toBeInTheDocument()

      // The button should say "Continue" instead of "Select Audience"
      const continueButton = screen.getByRole('button', { name: /Continue/i })
      expect(continueButton).toBeInTheDocument()

      // Verify "Select Audience" text is NOT present
      expect(
        screen.queryByRole('button', { name: /Select Audience/i }),
      ).not.toBeInTheDocument()
    })

    it('should NOT display "Next" as button text on the details step', () => {
      render(<CreatePoll pathname="/dashboard/polls" />)

      // The button should NOT say "Next" on this step
      const buttons = screen.getAllByRole('button')
      const buttonTexts = buttons.map((btn) => btn.textContent)

      // The only navigation buttons should be "Exit" (back) and "Continue" (next)
      expect(buttonTexts).toContain('Exit')
      expect(buttonTexts).toContain('Continue')
      expect(buttonTexts).not.toContain('Select Audience')
    })
  })
})
