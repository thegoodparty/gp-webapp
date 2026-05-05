import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import NewOnboardingFlow from './NewOnboardingFlow'
import { NEW_ONBOARDING_STEPS } from './newOnboardingConfig'
import {
  getNextOnboardingStep,
  getOnboardingPayload,
  getPreviousOnboardingStep,
  getVisibleOnboardingSteps,
} from './newOnboardingHelpers'

describe('new onboarding flow shell', () => {
  it('renders the first step on initial mount', () => {
    render(<NewOnboardingFlow />)
    expect(
      screen.getByRole('heading', { level: 1, name: /winning campaign plan/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Step 1 of/)).toBeInTheDocument()
  })

  it('routes structured office users through structured calculation steps', () => {
    expect(
      getNextOnboardingStep(NEW_ONBOARDING_STEPS, 'office-selection', {
        officePath: 'structured',
      })?.id,
    ).toBe('path-to-victory')
  })

  it('routes manual office users through manual entry and skips structured calculation steps', () => {
    const visibleStepIds = getVisibleOnboardingSteps(NEW_ONBOARDING_STEPS, {
      officePath: 'manual',
      manualOffice: true,
      unmatchedOffice: true,
    }).map((step) => step.id)

    expect(
      getNextOnboardingStep(NEW_ONBOARDING_STEPS, 'office-selection', {
        officePath: 'manual',
      })?.id,
    ).toBe('manual-office-entry')
    expect(visibleStepIds).toContain('manual-office-entry')
    expect(visibleStepIds).not.toContain('path-to-victory')
    expect(visibleStepIds).not.toContain('minimum-budget')
    expect(visibleStepIds).not.toContain('community-cares')
    expect(visibleStepIds).not.toContain('community-alignment')
  })

  it('keeps onboarding answers in a flexible payload with office mode flags', () => {
    expect(
      getOnboardingPayload({
        officePath: 'manual',
        manualOffice: true,
        unmatchedOffice: true,
        ballotStatus: 'seriously-considering',
      }),
    ).toEqual({
      version: 1,
      officeSelection: {
        mode: 'manual',
        manualOffice: true,
        unmatchedOffice: true,
      },
      answers: {
        officePath: 'manual',
        manualOffice: true,
        unmatchedOffice: true,
        ballotStatus: 'seriously-considering',
      },
    })
  })

  it('supports back and continue navigation across skipped manual-office steps', () => {
    const answers = {
      officePath: 'manual' as const,
      manualOffice: true,
      unmatchedOffice: true,
    }

    expect(
      getPreviousOnboardingStep(
        NEW_ONBOARDING_STEPS,
        'candidate-issues',
        answers,
      )?.id,
    ).toBe('manual-office-entry')
    expect(
      getNextOnboardingStep(
        NEW_ONBOARDING_STEPS,
        'manual-office-entry',
        answers,
      )?.id,
    ).toBe('candidate-issues')
    expect(
      getNextOnboardingStep(NEW_ONBOARDING_STEPS, 'candidate-issues', answers)
        ?.id,
    ).toBe('pledge')
  })
})
