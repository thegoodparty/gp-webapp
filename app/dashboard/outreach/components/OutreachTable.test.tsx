import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { OutreachTable } from './OutreachTable'
import type { ReactNode } from 'react'
import type { Outreach } from 'app/dashboard/outreach/hooks/OutreachContext'
import type { VoterFileFilters } from 'helpers/types'

// Mock the OutreachContext
const mockOutreaches: Outreach[] = []
vi.mock('app/dashboard/outreach/hooks/OutreachContext', () => ({
  useOutreach: () => [mockOutreaches, vi.fn()],
  outreachContext: {
    Provider: ({ children }: { children: ReactNode }) => children,
  },
}))

// Mock the P2P UX enabled hook
vi.mock('app/dashboard/components/tasks/flows/hooks/P2pUxEnabledProvider', () => ({
  useP2pUxEnabled: () => ({ p2pUxEnabled: true }),
}))

// Mock analytics
vi.mock('helpers/analyticsHelper', () => ({
  trackEvent: vi.fn(),
  EVENTS: {
    Outreach: {
      ActionClicked: 'Outreach - Action Clicked',
    },
  },
}))

// Mock MUI Popover
vi.mock('@mui/material/Popover', () => ({
  default: ({ children, open }: { children: ReactNode; open: boolean }) =>
    open ? <div data-testid="popover">{children}</div> : null,
}))

// Mock child components
vi.mock('app/dashboard/outreach/components/OutreachActions', () => ({
  OutreachActions: () => <div data-testid="outreach-actions" />,
}))

vi.mock('app/dashboard/voter-records/components/ViewAudienceFiltersModal', () => ({
  ActualViewAudienceFiltersModal: () => null,
}))

vi.mock('@shared/utils/SimpleTable', () => ({
  default: ({
    columns,
    data,
  }: {
    columns: Array<{
      header: string
      cell: (props: { row: unknown }) => ReactNode
    }>
    data: unknown[]
  }) => (
    <table>
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {columns.map((col, colIdx) => (
              <td key={colIdx}>{col.cell({ row })}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}))

vi.mock('@shared/typography/H4', () => ({
  default: ({ children }: { children: ReactNode }) => <h4>{children}</h4>,
}))

vi.mock('@shared/GradientOverlay', () => ({
  GradientOverlay: ({ children }: { children: ReactNode }) => (
    <div data-testid="gradient-overlay">{children}</div>
  ),
}))

vi.mock('@shared/utils/StackedChips', () => ({
  StackedChips: () => <span data-testid="stacked-chips" />,
}))

interface OutreachRowWithP2p extends Outreach {
  p2pJob?: { status?: string; start_date?: string }
  voterFileFilter?: VoterFileFilters
}

describe('OutreachTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the date to a known value for consistent tests
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-15T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('P2P job status display', () => {
    it('shows "Sent" when P2P job is active and start_date is in the past', () => {
      const mockOutreach: OutreachRowWithP2p = {
        id: 1,
        phoneListId: 123,
        status: 'pending',
        p2pJob: {
          status: 'active',
          start_date: '2026-04-14', // yesterday
        },
        date: '2026-04-14',
      }

      render(<OutreachTable mockOutreaches={[mockOutreach]} />)

      expect(screen.getByText('Sent')).toBeInTheDocument()
    })

    it('shows "Scheduled" when P2P job is active but start_date is in the future', () => {
      const mockOutreach: OutreachRowWithP2p = {
        id: 2,
        phoneListId: 456,
        status: 'pending',
        p2pJob: {
          status: 'active',
          start_date: '2026-04-20', // 5 days in the future
        },
        date: '2026-04-20',
      }

      render(<OutreachTable mockOutreaches={[mockOutreach]} />)

      expect(screen.getByText('Scheduled')).toBeInTheDocument()
    })

    it('shows "Sent" when P2P job is active and start_date is today', () => {
      const mockOutreach: OutreachRowWithP2p = {
        id: 3,
        phoneListId: 789,
        status: 'pending',
        p2pJob: {
          status: 'active',
          start_date: '2026-04-15', // today
        },
        date: '2026-04-15',
      }

      render(<OutreachTable mockOutreaches={[mockOutreach]} />)

      // start_date == today means it's not in the future, so it should show 'Sent'
      expect(screen.getByText('Sent')).toBeInTheDocument()
    })

    it('uses outreach date as fallback when p2pJob start_date is not available', () => {
      const mockOutreach: OutreachRowWithP2p = {
        id: 4,
        phoneListId: 111,
        status: 'pending',
        p2pJob: {
          status: 'active',
          // no start_date
        },
        date: '2026-04-25', // future date
      }

      render(<OutreachTable mockOutreaches={[mockOutreach]} />)

      expect(screen.getByText('Scheduled')).toBeInTheDocument()
    })

    it('shows "Draft" when P2P job status is pending', () => {
      const mockOutreach: OutreachRowWithP2p = {
        id: 5,
        phoneListId: 222,
        status: 'pending',
        p2pJob: {
          status: 'pending',
          start_date: '2026-04-20',
        },
        date: '2026-04-20',
      }

      render(<OutreachTable mockOutreaches={[mockOutreach]} />)

      expect(screen.getByText('Draft')).toBeInTheDocument()
    })

    it('shows "n/a" in status column when phoneListId is null (not a P2P outreach)', () => {
      const mockOutreach: OutreachRowWithP2p = {
        id: 6,
        phoneListId: null,
        status: 'pending',
        p2pJob: {
          status: 'active',
          start_date: '2026-04-14',
        },
        date: '2026-04-14',
      }

      render(<OutreachTable mockOutreaches={[mockOutreach]} />)

      // There will be multiple n/a elements (for Audience, Voters, Status columns)
      // We just need to verify that the status column is n/a (not Sent/Scheduled)
      const naElements = screen.getAllByText('n/a')
      expect(naElements.length).toBeGreaterThanOrEqual(1)
      // Verify there's no "Sent" or "Scheduled" status (which would appear if P2P logic was applied)
      expect(screen.queryByText('Sent')).not.toBeInTheDocument()
      expect(screen.queryByText('Scheduled')).not.toBeInTheDocument()
    })

    it('shows "n/a" in status column when p2pJob status is missing', () => {
      const mockOutreach: OutreachRowWithP2p = {
        id: 7,
        phoneListId: 333,
        status: 'pending',
        p2pJob: {
          // no status
          start_date: '2026-04-14',
        },
        date: '2026-04-14',
      }

      render(<OutreachTable mockOutreaches={[mockOutreach]} />)

      // There will be multiple n/a elements (for Audience, Voters, Status columns)
      // We just need to verify that status column is n/a (not Sent/Scheduled)
      const naElements = screen.getAllByText('n/a')
      expect(naElements.length).toBeGreaterThanOrEqual(1)
      // Verify there's no "Sent" or "Scheduled" status (which would appear if P2P logic was applied)
      expect(screen.queryByText('Sent')).not.toBeInTheDocument()
      expect(screen.queryByText('Scheduled')).not.toBeInTheDocument()
    })

    it('shows "In review" when outreach status is approved', () => {
      const mockOutreach: OutreachRowWithP2p = {
        id: 8,
        phoneListId: 444,
        status: 'approved',
        p2pJob: {
          status: 'paused',
          start_date: '2026-04-14',
        },
        date: '2026-04-14',
      }

      render(<OutreachTable mockOutreaches={[mockOutreach]} />)

      expect(screen.getByText('In review')).toBeInTheDocument()
    })
  })

  describe('date edge cases', () => {
    it('shows "Sent" when start_date is empty string (treats as past)', () => {
      const mockOutreach: OutreachRowWithP2p = {
        id: 9,
        phoneListId: 555,
        status: 'pending',
        p2pJob: {
          status: 'active',
          start_date: '',
        },
        date: '',
      }

      render(<OutreachTable mockOutreaches={[mockOutreach]} />)

      // Empty string date should return false from isScheduledDateInFuture
      // which means it's not in the future, so should show 'Sent'
      expect(screen.getByText('Sent')).toBeInTheDocument()
    })

    it('handles multiple outreaches with different statuses', () => {
      const mockOutreaches: OutreachRowWithP2p[] = [
        {
          id: 10,
          phoneListId: 666,
          status: 'pending',
          p2pJob: { status: 'active', start_date: '2026-04-10' },
          date: '2026-04-10',
        },
        {
          id: 11,
          phoneListId: 777,
          status: 'pending',
          p2pJob: { status: 'active', start_date: '2026-04-30' },
          date: '2026-04-30',
        },
      ]

      render(<OutreachTable mockOutreaches={mockOutreaches} />)

      expect(screen.getByText('Sent')).toBeInTheDocument()
      expect(screen.getByText('Scheduled')).toBeInTheDocument()
    })
  })
})
