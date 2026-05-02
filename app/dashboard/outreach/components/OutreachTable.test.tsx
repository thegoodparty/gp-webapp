import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { OutreachTable } from './OutreachTable'

vi.mock('app/dashboard/outreach/hooks/OutreachContext', () => ({
  useOutreach: () => [[], vi.fn()],
  OutreachProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

vi.mock('app/dashboard/components/tasks/flows/hooks/P2pUxEnabledProvider', () => ({
  useP2pUxEnabled: () => ({ p2pUxEnabled: true }),
}))

vi.mock('helpers/analyticsHelper', () => ({
  trackEvent: vi.fn(),
  EVENTS: { Outreach: { ActionClicked: 'Outreach - Action Clicked' } },
}))

vi.mock('@mui/material/Popover', () => ({
  default: () => null,
}))

vi.mock('app/dashboard/voter-records/components/ViewAudienceFiltersModal', () => ({
  ActualViewAudienceFiltersModal: () => null,
}))

vi.mock('app/dashboard/outreach/components/OutreachActions', () => ({
  OutreachActions: () => null,
}))

const createOutreachRow = (overrides = {}) => ({
  id: 1,
  date: '2025-04-15T17:00:00Z',
  outreachType: 'text' as const,
  phoneListId: 123,
  status: 'paid' as const,
  p2pJob: { status: 'active' },
  voterFileFilter: { voterCount: 100 },
  ...overrides,
})

describe('OutreachTable P2P status display', () => {
  const originalDateNow = Date.now

  afterEach(() => {
    Date.now = originalDateNow
  })

  describe('isScheduledDatePassed logic', () => {
    it('shows "Sent" when p2pJob is active AND scheduled date has passed', () => {
      // Set current time to after the scheduled date
      Date.now = vi.fn(() => new Date('2025-04-15T18:00:00Z').getTime())

      const outreach = createOutreachRow({
        date: '2025-04-15T17:00:00Z', // 5 PM - in the past
        p2pJob: { status: 'active' },
      })

      render(<OutreachTable mockOutreaches={[outreach]} />)

      const statusCell = screen.getByText('Sent')
      expect(statusCell).toBeInTheDocument()
    })

    it('shows "Scheduled" when p2pJob is active but scheduled date is in the future', () => {
      // Set current time to before the scheduled date
      Date.now = vi.fn(() => new Date('2025-04-15T13:00:00Z').getTime())

      const outreach = createOutreachRow({
        date: '2025-04-15T17:00:00Z', // 5 PM - in the future
        p2pJob: { status: 'active' },
      })

      render(<OutreachTable mockOutreaches={[outreach]} />)

      const statusCell = screen.getByText('Scheduled')
      expect(statusCell).toBeInTheDocument()
    })

    it('shows "Sent" when scheduled date is exactly now', () => {
      const now = new Date('2025-04-15T17:00:00Z')
      Date.now = vi.fn(() => now.getTime())

      const outreach = createOutreachRow({
        date: '2025-04-15T17:00:00Z', // exactly now
        p2pJob: { status: 'active' },
      })

      render(<OutreachTable mockOutreaches={[outreach]} />)

      const statusCell = screen.getByText('Sent')
      expect(statusCell).toBeInTheDocument()
    })

    it('shows "Scheduled" when p2pJob is active but date is null', () => {
      Date.now = vi.fn(() => new Date('2025-04-15T13:00:00Z').getTime())

      const outreach = createOutreachRow({
        date: null,
        p2pJob: { status: 'active' },
      })

      render(<OutreachTable mockOutreaches={[outreach]} />)

      // When date is null, isScheduledDatePassed returns false, so shows Scheduled
      const statusCell = screen.getByText('Scheduled')
      expect(statusCell).toBeInTheDocument()
    })
  })

  describe('non-active p2pJob status', () => {
    beforeEach(() => {
      Date.now = vi.fn(() => new Date('2025-04-15T13:00:00Z').getTime())
    })

    it('shows "Draft" when outreach status is pending', () => {
      const outreach = createOutreachRow({
        status: 'pending',
        p2pJob: { status: 'pending' },
      })

      render(<OutreachTable mockOutreaches={[outreach]} />)

      const statusCell = screen.getByText('Draft')
      expect(statusCell).toBeInTheDocument()
    })

    it('shows "In review" when outreach status is approved', () => {
      const outreach = createOutreachRow({
        status: 'approved',
        p2pJob: { status: 'pending' },
      })

      render(<OutreachTable mockOutreaches={[outreach]} />)

      const statusCell = screen.getByText('In review')
      expect(statusCell).toBeInTheDocument()
    })

    it('shows "Scheduled" when outreach status is paid', () => {
      const outreach = createOutreachRow({
        status: 'paid',
        p2pJob: { status: 'pending' },
      })

      render(<OutreachTable mockOutreaches={[outreach]} />)

      const statusCell = screen.getByText('Scheduled')
      expect(statusCell).toBeInTheDocument()
    })

    it('shows "Scheduled" when outreach status is in_progress', () => {
      const outreach = createOutreachRow({
        status: 'in_progress',
        p2pJob: { status: 'pending' },
      })

      render(<OutreachTable mockOutreaches={[outreach]} />)

      const statusCell = screen.getByText('Scheduled')
      expect(statusCell).toBeInTheDocument()
    })

    it('shows "Sent" when outreach status is completed', () => {
      const outreach = createOutreachRow({
        status: 'completed',
        p2pJob: { status: 'pending' },
      })

      render(<OutreachTable mockOutreaches={[outreach]} />)

      const statusCell = screen.getByText('Sent')
      expect(statusCell).toBeInTheDocument()
    })
  })

  describe('non-P2P outreach (no phoneListId)', () => {
    it('shows "n/a" for status when phoneListId is null', () => {
      const outreach = createOutreachRow({
        phoneListId: null,
        p2pJob: { status: 'active' },
      })

      render(<OutreachTable mockOutreaches={[outreach]} />)

      // The status column (5th column) should show n/a
      // Since phoneListId is null, getP2pStatusLabel returns null
      const allNaCells = screen.getAllByText('n/a')
      expect(allNaCells.length).toBeGreaterThan(0)
      // Verify no status labels are shown
      expect(screen.queryByText('Sent')).not.toBeInTheDocument()
      expect(screen.queryByText('Scheduled')).not.toBeInTheDocument()
      expect(screen.queryByText('Draft')).not.toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('shows "n/a" for status when p2pJob status is missing', () => {
      const outreach = createOutreachRow({
        p2pJob: {},
      })

      render(<OutreachTable mockOutreaches={[outreach]} />)

      // Verify no status labels are shown (status should be n/a)
      expect(screen.queryByText('Sent')).not.toBeInTheDocument()
      expect(screen.queryByText('Scheduled')).not.toBeInTheDocument()
      expect(screen.queryByText('Draft')).not.toBeInTheDocument()
      expect(screen.queryByText('In review')).not.toBeInTheDocument()
    })

    it('shows "n/a" for status when outreach status is missing', () => {
      const outreach = createOutreachRow({
        status: null,
      })

      render(<OutreachTable mockOutreaches={[outreach]} />)

      // Verify no status labels are shown
      expect(screen.queryByText('Sent')).not.toBeInTheDocument()
      expect(screen.queryByText('Scheduled')).not.toBeInTheDocument()
      expect(screen.queryByText('Draft')).not.toBeInTheDocument()
      expect(screen.queryByText('In review')).not.toBeInTheDocument()
    })
  })
})
