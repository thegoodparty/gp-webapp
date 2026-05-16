import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { api } from 'helpers/test-utils/api-mocking'
import DevAgentTriggerBar from './DevAgentTriggerBar'
import BriefingsLanding from './BriefingsLanding'

describe('DevAgentTriggerBar', () => {
  it('renders both trigger buttons', () => {
    render(<DevAgentTriggerBar electedOfficeId="eo-1" />)
    expect(
      screen.getByRole('button', { name: 'Trigger meeting_schedule' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Trigger meeting_briefing' }),
    ).toBeInTheDocument()
  })

  it('shows success message after a successful dispatch', async () => {
    const user = userEvent.setup()
    api.mock('POST /v1/meetings/briefings/dispatch', {
      status: 200,
      data: { dispatched: true, kind: 'briefing' },
    })

    render(<DevAgentTriggerBar electedOfficeId="eo-1" />)
    await user.click(
      screen.getByRole('button', { name: 'Trigger meeting_briefing' }),
    )

    await waitFor(() => {
      expect(
        screen.getByText('Dispatched briefing agent run'),
      ).toBeInTheDocument()
    })
  })

  it('disables both buttons while a dispatch is in flight', async () => {
    const user = userEvent.setup()
    let resolveDispatch: (() => void) | null = null
    api.mock('POST /v1/meetings/briefings/dispatch', async () => {
      await new Promise<void>((resolve) => {
        resolveDispatch = resolve
      })
      return { status: 200, data: { dispatched: true, kind: 'schedule' } }
    })

    render(<DevAgentTriggerBar electedOfficeId="eo-1" />)
    const scheduleBtn = screen.getByRole('button', {
      name: 'Trigger meeting_schedule',
    })
    const briefingBtn = screen.getByRole('button', {
      name: 'Trigger meeting_briefing',
    })

    await user.click(scheduleBtn)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Dispatching…' }),
      ).toBeDisabled()
    })
    expect(briefingBtn).toBeDisabled()

    resolveDispatch?.()

    await waitFor(() => {
      expect(scheduleBtn).not.toBeDisabled()
      expect(briefingBtn).not.toBeDisabled()
    })
  })

  it('surfaces the error message when dispatch fails', async () => {
    const user = userEvent.setup()
    api.mock('POST /v1/meetings/briefings/dispatch', {
      status: 500,
      data: { message: 'boom' },
    })

    render(<DevAgentTriggerBar electedOfficeId="eo-1" />)
    await user.click(
      screen.getByRole('button', { name: 'Trigger meeting_schedule' }),
    )

    await waitFor(() => {
      expect(
        screen.getByText(/^Failed to dispatch schedule: /),
      ).toBeInTheDocument()
    })
  })
})

describe('BriefingsLanding dev bar gating', () => {
  it('does not render DevAgentTriggerBar when devElectedOfficeId is absent', () => {
    render(<BriefingsLanding summaries={[]} devElectedOfficeId={null} />)
    expect(
      screen.queryByText('Dev tools — manual agent dispatch'),
    ).not.toBeInTheDocument()
  })

  it('renders DevAgentTriggerBar when devElectedOfficeId is provided', () => {
    render(<BriefingsLanding summaries={[]} devElectedOfficeId="eo-current" />)
    expect(
      screen.getByText('Dev tools — manual agent dispatch'),
    ).toBeInTheDocument()
  })
})
