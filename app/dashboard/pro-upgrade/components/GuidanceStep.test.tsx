import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import GuidanceStep from './GuidanceStep'
import { useProUpgradeWizard } from './ProUpgradeWizard'

vi.mock('./ProUpgradeWizard', () => ({
  useProUpgradeWizard: vi.fn(),
}))

// Keep EVENTS real; stub trackEvent so we don't hit analytics in tests.
vi.mock('helpers/analyticsHelper', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('helpers/analyticsHelper')>()
  return { ...actual, trackEvent: vi.fn() }
})

const mockUseProUpgradeWizard = vi.mocked(useProUpgradeWizard)
const goToStep = vi.fn()
const goToNextStep = vi.fn()

describe('GuidanceStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseProUpgradeWizard.mockReturnValue({
      currentStep: 'guidance',
      goToStep,
      goToNextStep,
      goToPreviousStep: vi.fn(),
    })
  })

  it('fires the viewed analytics event on mount', () => {
    render(<GuidanceStep />)
    expect(trackEvent).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.GuidanceViewed,
    )
  })

  it('renders the heading and all four numbered checklist items', () => {
    render(<GuidanceStep />)

    expect(
      screen.getByText(/we'll need to gather a few things/i),
    ).toBeInTheDocument()

    for (const label of [
      'Your campaign EIN',
      'Your campaign filing details',
      'Your candidate profile',
      'Payment',
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }

    // The four ordinal markers, per the Figma numbered list.
    for (const ordinal of ['1', '2', '3', '4']) {
      expect(screen.getByText(ordinal)).toBeInTheDocument()
    }
  })

  it('advances explicitly to the EIN step when "Let\'s go!" is clicked', () => {
    render(<GuidanceStep />)

    screen.getByRole('button', { name: /let's go/i }).click()

    // GUIDANCE is off the linear order, so it must navigate to EIN explicitly
    // rather than via goToNextStep (which would no-op from an off-order route).
    expect(goToStep).toHaveBeenCalledWith('ein')
    expect(goToNextStep).not.toHaveBeenCalled()
    expect(router.push).not.toHaveBeenCalled()
    expect(trackEvent).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.GuidanceContinue,
    )
  })
})
