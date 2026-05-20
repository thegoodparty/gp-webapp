import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import TextComplianceStep from './TextComplianceStep'
import { STEP_STATUS } from '../shared/TextCompliance.types'

const baseProps = {
  number: 1,
  total: 3,
  title: 'Submit candidate profile',
  route: '/dashboard/profile/texting-compliance/submit-candidate-profile',
}

describe('TextComplianceStep', () => {
  describe('active status', () => {
    it('wraps the row in a link to the step route', () => {
      render(<TextComplianceStep {...baseProps} status={STEP_STATUS.ACTIVE} />)

      const link = screen.getByRole('link', {
        name: /submit candidate profile/i,
      })
      expect(link).toHaveAttribute('href', baseProps.route)
    })

    it('renders the step number and a chevron', () => {
      const { container } = render(
        <TextComplianceStep {...baseProps} status={STEP_STATUS.ACTIVE} />,
      )

      expect(screen.getByText('1')).toBeInTheDocument()
      // lucide icons render as <svg> with a `lucide-chevron-right` class
      expect(
        container.querySelector('svg.lucide-chevron-right'),
      ).toBeInTheDocument()
    })
  })

  describe('disabled status', () => {
    it('does not wrap the row in a link', () => {
      render(
        <TextComplianceStep {...baseProps} status={STEP_STATUS.DISABLED} />,
      )

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('marks the row as aria-disabled', () => {
      render(
        <TextComplianceStep
          {...baseProps}
          status={STEP_STATUS.DISABLED}
          title="Enter your PIN"
        />,
      )

      const row = screen.getByText('Enter your PIN').closest('[aria-disabled]')
      expect(row).toHaveAttribute('aria-disabled', 'true')
    })

    it('does not render a chevron', () => {
      const { container } = render(
        <TextComplianceStep {...baseProps} status={STEP_STATUS.DISABLED} />,
      )

      expect(
        container.querySelector('svg.lucide-chevron-right'),
      ).not.toBeInTheDocument()
    })
  })

  describe('completed status', () => {
    it('renders the check icon instead of the step number', () => {
      const { container } = render(
        <TextComplianceStep {...baseProps} status={STEP_STATUS.COMPLETED} />,
      )

      expect(
        container.querySelector('svg.lucide-circle-check'),
      ).toBeInTheDocument()
      expect(screen.queryByText('1')).not.toBeInTheDocument()
    })

    it('does not wrap the row in a link', () => {
      render(
        <TextComplianceStep {...baseProps} status={STEP_STATUS.COMPLETED} />,
      )

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
  })

  describe('separator', () => {
    it('shows a bottom border on non-last steps', () => {
      render(
        <TextComplianceStep
          {...baseProps}
          number={1}
          total={3}
          status={STEP_STATUS.ACTIVE}
        />,
      )

      const row = screen
        .getByText(baseProps.title)
        .closest('div.flex.items-center.justify-between')
      expect(row).toHaveClass('border-b')
    })

    it('omits the bottom border on the last step', () => {
      render(
        <TextComplianceStep
          {...baseProps}
          number={3}
          total={3}
          status={STEP_STATUS.DISABLED}
        />,
      )

      const row = screen
        .getByText(baseProps.title)
        .closest('div.flex.items-center.justify-between')
      expect(row).not.toHaveClass('border-b')
    })
  })
})
