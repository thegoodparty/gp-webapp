import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import ValuePropStep from './ValuePropStep'
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
const goToNextStep = vi.fn()

describe('ValuePropStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseProUpgradeWizard.mockReturnValue({
      currentStep: 'value-prop',
      goToStep: vi.fn(),
      goToNextStep,
      goToPreviousStep: vi.fn(),
    })
  })

  it('renders every comparison row and the Free / Pro column headers', () => {
    render(<ValuePropStep />)

    for (const label of [
      'Campaign plan',
      'Campaign advising',
      'Voter data & list building',
      '10DLC compliance',
      'Texts and robocalls',
      'Up to 5,000 free texts',
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }

    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByLabelText('PRO')).toBeInTheDocument()
  })

  it('maps the Free/Pro check and x marks per the design', () => {
    const { container } = render(<ValuePropStep />)

    // Pro column: a check on every row (6). Free column: only "Campaign plan"
    // is included (1). Total checks 7, x marks 5.
    expect(container.querySelectorAll('svg.lucide-check')).toHaveLength(7)
    expect(container.querySelectorAll('svg.lucide-x')).toHaveLength(5)
  })

  it('advances to the next (filing-status) step when "Get Pro" is clicked', () => {
    render(<ValuePropStep />)

    screen.getByRole('button', { name: /get pro for \$10\/mo/i }).click()

    expect(goToNextStep).toHaveBeenCalledTimes(1)
    expect(router.push).not.toHaveBeenCalled()
  })

  it('exits the wizard to the dashboard when "Maybe later" is clicked', () => {
    render(<ValuePropStep />)

    screen.getByRole('button', { name: /maybe later/i }).click()

    expect(router.push).toHaveBeenCalledWith('/dashboard')
    expect(goToNextStep).not.toHaveBeenCalled()
  })
})
