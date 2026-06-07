import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import ProUpgradeWizard from './ProUpgradeWizard'
import { useProUpgrade3Flag } from '@shared/experiments/proUpgrade3Flag'
import { usePathname } from 'next/navigation'
import { noop } from '@shared/utils/noop'

vi.mock('@shared/experiments/proUpgrade3Flag', () => ({
  useProUpgrade3Flag: vi.fn(),
}))

// The global setup mocks next/navigation with useRouter only; this component
// also needs usePathname, so override the module for this file.
vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: vi.fn(),
}))

const mockUseProUpgrade3Flag = vi.mocked(useProUpgrade3Flag)
const mockUsePathname = vi.mocked(usePathname)

describe('ProUpgradeWizard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'scrollTo').mockImplementation(noop)
    mockUsePathname.mockReturnValue('/dashboard/pro-upgrade/ein')
  })

  it('renders a spinner and does not redirect while the flag is not ready', () => {
    mockUseProUpgrade3Flag.mockReturnValue({ ready: false, enabled: false })

    render(
      <ProUpgradeWizard>
        <div>step-content</div>
      </ProUpgradeWizard>,
    )

    // LoadingAnimation renders a "POWERED BY" marker.
    expect(screen.getByText(/powered by/i)).toBeInTheDocument()
    expect(screen.queryByText('step-content')).not.toBeInTheDocument()
    expect(router.replace).not.toHaveBeenCalled()
  })

  it('renders nothing (not a permanent spinner) and redirects the off cohort', () => {
    mockUseProUpgrade3Flag.mockReturnValue({ ready: true, enabled: false })

    const { container } = render(
      <ProUpgradeWizard>
        <div>step-content</div>
      </ProUpgradeWizard>,
    )

    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByText(/powered by/i)).not.toBeInTheDocument()
    expect(screen.queryByText('step-content')).not.toBeInTheDocument()
    expect(router.replace).toHaveBeenCalledWith('/dashboard/pro-sign-up')
  })

  it('renders the step children when the flag is ready and enabled', () => {
    mockUseProUpgrade3Flag.mockReturnValue({ ready: true, enabled: true })

    render(
      <ProUpgradeWizard>
        <div>step-content</div>
      </ProUpgradeWizard>,
    )

    expect(screen.getByText('step-content')).toBeInTheDocument()
    expect(router.replace).not.toHaveBeenCalled()
  })

  it('does not show a Back control on the post-payment success surface', () => {
    mockUseProUpgrade3Flag.mockReturnValue({ ready: true, enabled: true })
    mockUsePathname.mockReturnValue('/dashboard/pro-upgrade/success')

    render(
      <ProUpgradeWizard>
        <div>step-content</div>
      </ProUpgradeWizard>,
    )

    expect(
      screen.queryByRole('button', { name: /go back/i }),
    ).not.toBeInTheDocument()
  })
})
