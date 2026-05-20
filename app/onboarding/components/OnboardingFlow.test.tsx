import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import OnboardingFlow from './OnboardingFlow'
import { ONBOARDING_STEPS } from './onboardingConfig'
import {
  getNextOnboardingStep,
  getPreviousOnboardingStep,
  getVisibleOnboardingSteps,
} from './onboardingHelpers'

const renderFlow = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <OnboardingFlow />
    </QueryClientProvider>,
  )

describe('new onboarding flow shell', () => {
  it('renders the first step on initial mount', () => {
    renderFlow()
    expect(
      screen.getByRole('heading', { level: 1, name: /winning campaign plan/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Step 1 of/)).toBeInTheDocument()
  })

  it('routes structured office users through structured calculation steps', () => {
    expect(
      getNextOnboardingStep(ONBOARDING_STEPS, 'office-selection', {
        officePath: 'structured',
      })?.id,
    ).toBe('path-to-victory')
  })

  it('routes manual office users through manual entry and skips structured calculation steps', () => {
    const visibleStepIds = getVisibleOnboardingSteps(ONBOARDING_STEPS, {
      officePath: 'manual',
      manualOffice: true,
      unmatchedOffice: true,
    }).map((step) => step.id)

    expect(
      getNextOnboardingStep(ONBOARDING_STEPS, 'office-selection', {
        officePath: 'manual',
      })?.id,
    ).toBe('manual-office-entry')
    expect(visibleStepIds).toContain('manual-office-entry')
    expect(visibleStepIds).not.toContain('path-to-victory')
    expect(visibleStepIds).not.toContain('voter-demographics')
  })

  it('disables continue on the ballot-status step until a status is selected', async () => {
    renderFlow()

    const continueButton = screen.getByRole('button', { name: /continue/i })
    fireEvent.click(continueButton)

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /already on the ballot/i,
      }),
    ).toBeInTheDocument()
    expect(continueButton).toBeDisabled()

    fireEvent.click(screen.getByLabelText(/officially on the ballot/i))
    expect(continueButton).toBeEnabled()

    fireEvent.click(continueButton)
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', {
          level: 1,
          name: /already on the ballot/i,
        }),
      ).not.toBeInTheDocument(),
    )
  })

  it('blocks continue on party affiliation when a major party is selected', async () => {
    renderFlow()

    const continueButton = screen.getByRole('button', { name: /continue/i })
    // welcome -> ballot-status
    fireEvent.click(continueButton)
    fireEvent.click(await screen.findByLabelText(/officially on the ballot/i))
    // ballot-status -> party-affiliation
    fireEvent.click(continueButton)

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /party designation/i,
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
      getPreviousOnboardingStep(ONBOARDING_STEPS, 'pledge', answers)?.id,
    ).toBe('manual-office-entry')
    expect(
      getNextOnboardingStep(ONBOARDING_STEPS, 'manual-office-entry', answers)
        ?.id,
    ).toBe('pledge')
  })
})
