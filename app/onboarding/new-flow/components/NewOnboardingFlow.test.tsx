import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
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
        ballotStatus: 'considering',
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
        ballotStatus: 'considering',
      },
    })
  })

  it('disables continue on the ballot-status step until a status is selected', () => {
    render(<NewOnboardingFlow />)

    const continueButton = screen.getByRole('button', { name: /continue/i })
    fireEvent.click(continueButton)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /already on the ballot/i,
      }),
    ).toBeInTheDocument()
    expect(continueButton).toBeDisabled()

    fireEvent.click(screen.getByLabelText(/officially on the ballot/i))
    expect(continueButton).toBeEnabled()

    fireEvent.click(continueButton)
    expect(
      screen.queryByRole('heading', {
        level: 1,
        name: /already on the ballot/i,
      }),
    ).not.toBeInTheDocument()
  })

  it('blocks continue on party affiliation when a major party is selected', () => {
    render(<NewOnboardingFlow />)

    const continueButton = screen.getByRole('button', { name: /continue/i })
    // welcome -> ballot-status
    fireEvent.click(continueButton)
    fireEvent.click(screen.getByLabelText(/officially on the ballot/i))
    // ballot-status -> party-affiliation
    fireEvent.click(continueButton)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /official party affiliation/i,
      }),
    ).toBeInTheDocument()
    expect(continueButton).toBeDisabled()

    fireEvent.click(screen.getByLabelText(/democrat/i))
    expect(continueButton).toBeDisabled()
    expect(screen.getByRole('alert')).toHaveTextContent(
      /only for non-partisan and independent candidates/i,
    )

    fireEvent.click(screen.getByLabelText(/nonpartisan race/i))
    expect(continueButton).toBeEnabled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('supports back and continue navigation across skipped manual-office steps', () => {
    const answers = {
      officePath: 'manual' as const,
      manualOffice: true,
      unmatchedOffice: true,
    }

    expect(
      getPreviousOnboardingStep(NEW_ONBOARDING_STEPS, 'pledge', answers)?.id,
    ).toBe('manual-office-entry')
    expect(
      getNextOnboardingStep(
        NEW_ONBOARDING_STEPS,
        'manual-office-entry',
        answers,
      )?.id,
    ).toBe('pledge')
  })
})
