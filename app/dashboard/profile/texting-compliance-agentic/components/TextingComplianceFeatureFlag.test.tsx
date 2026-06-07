import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import TextingComplianceFeatureFlag from './TextingComplianceFeatureFlag'
import { useProUpgrade3Flag } from '@shared/experiments/proUpgrade3Flag'
import { useProUpgradeFlag } from '@shared/experiments/proUpgradeFlag'

vi.mock('@shared/experiments/proUpgrade3Flag', () => ({
  useProUpgrade3Flag: vi.fn(),
}))
vi.mock('@shared/experiments/proUpgradeFlag', () => ({
  useProUpgradeFlag: vi.fn(),
}))

// Stub the three surfaces with identifiable markers so the assertions verify
// which surface the precedence logic selects, not each surface's internals.
vi.mock('./ProUpgrade3Compliance', () => ({
  default: () => <div>pro-upgrade3-surface</div>,
}))
vi.mock('./TextingComplianceAgentic', () => ({
  default: () => <div>agentic-surface</div>,
}))
vi.mock(
  'app/dashboard/profile/texting-compliance/components/TextingCompliance',
  () => ({ default: () => <div>legacy-surface</div> }),
)

const mockUseProUpgrade3Flag = vi.mocked(useProUpgrade3Flag)
const mockUseProUpgradeFlag = vi.mocked(useProUpgradeFlag)

describe('TextingComplianceFeatureFlag', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the pro-upgrade3 surface when pro-upgrade3 is on (even if pro-upgrade1 is also on)', () => {
    mockUseProUpgrade3Flag.mockReturnValue({ ready: true, enabled: true })
    mockUseProUpgradeFlag.mockReturnValue({ ready: true, enabled: true })

    render(<TextingComplianceFeatureFlag />)

    expect(screen.getByText('pro-upgrade3-surface')).toBeInTheDocument()
    expect(screen.queryByText('agentic-surface')).not.toBeInTheDocument()
    expect(screen.queryByText('legacy-surface')).not.toBeInTheDocument()
  })

  it('falls back to the agentic surface when only pro-upgrade1 is on', () => {
    mockUseProUpgrade3Flag.mockReturnValue({ ready: true, enabled: false })
    mockUseProUpgradeFlag.mockReturnValue({ ready: true, enabled: true })

    render(<TextingComplianceFeatureFlag />)

    expect(screen.getByText('agentic-surface')).toBeInTheDocument()
    expect(screen.queryByText('pro-upgrade3-surface')).not.toBeInTheDocument()
    expect(screen.queryByText('legacy-surface')).not.toBeInTheDocument()
  })

  it('falls back to the legacy surface when neither flag is on', () => {
    mockUseProUpgrade3Flag.mockReturnValue({ ready: true, enabled: false })
    mockUseProUpgradeFlag.mockReturnValue({ ready: true, enabled: false })

    render(<TextingComplianceFeatureFlag />)

    expect(screen.getByText('legacy-surface')).toBeInTheDocument()
    expect(screen.queryByText('pro-upgrade3-surface')).not.toBeInTheDocument()
    expect(screen.queryByText('agentic-surface')).not.toBeInTheDocument()
  })

  it('shows the legacy surface until the flags resolve, even with a cached "on" variant', () => {
    // useFlagOn returns `on` independently of `ready`, so a cached/early
    // variant must not flash a flagged surface before Amplitude resolves.
    mockUseProUpgrade3Flag.mockReturnValue({ ready: false, enabled: true })
    mockUseProUpgradeFlag.mockReturnValue({ ready: false, enabled: true })

    render(<TextingComplianceFeatureFlag />)

    expect(screen.getByText('legacy-surface')).toBeInTheDocument()
    expect(screen.queryByText('pro-upgrade3-surface')).not.toBeInTheDocument()
    expect(screen.queryByText('agentic-surface')).not.toBeInTheDocument()
  })
})
