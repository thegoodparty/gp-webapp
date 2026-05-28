import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import ContactsTable from './ContactsTable'
import { useContactsTable } from '../hooks/ContactsTableProvider'
import { useShowContactProModal } from '../hooks/ContactProModal'
import { makePerson } from './shared/test-fixtures'

vi.mock('../hooks/ContactsTableProvider', () => ({
  useContactsTable: vi.fn(),
}))

vi.mock('../hooks/ContactProModal', () => ({
  useShowContactProModal: vi.fn(),
}))

const mockedUseContactsTable = vi.mocked(useContactsTable)
const mockedUseShowContactProModal = vi.mocked(useShowContactProModal)

type ContextValue = ReturnType<typeof useContactsTable>

function setContext(overrides: Partial<ContextValue> = {}) {
  const ctx: ContextValue = {
    filteredContacts: [],
    currentlySelectedPersonId: null,
    currentlySelectedPerson: {
      person: null,
      isLoadingPerson: false,
      isErrorPerson: false,
      issues: [],
      isLoadingIssues: false,
      isErrorIssues: false,
      issuesHasNextPage: false,
      issuesFetchNextPage: vi.fn(),
      isFetchingNextIssues: false,
      activities: [],
      isLoadingActivities: false,
      isErrorActivities: false,
      activitiesHasNextPage: false,
      activitiesFetchNextPage: vi.fn(),
      isFetchingNextActivities: false,
    },
    segments: [],
    customSegments: [],
    currentSegment: 'all',
    searchTerm: '',
    urlQueryParams: new URLSearchParams(),
    pagination: {
      totalResults: 0,
      currentPage: 1,
      pageSize: 20,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    isLoading: false,
    isCustomSegment: false,
    totalSegmentContacts: 0,
    canUseProFeatures: true,
    isElectedOfficial: false,
    pageUp: vi.fn(),
    pageDown: vi.fn(),
    goToPage: vi.fn(),
    setPageSize: vi.fn(),
    selectPerson: vi.fn(),
    selectSegment: vi.fn(),
    searchContacts: vi.fn(),
    refreshCustomSegments: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
  mockedUseContactsTable.mockReturnValue(ctx)
  return ctx
}

describe('<ContactsTable>', () => {
  beforeEach(() => {
    mockedUseContactsTable.mockReset()
    mockedUseShowContactProModal.mockReset()
    mockedUseShowContactProModal.mockReturnValue(vi.fn())
  })

  it('renders the column headers', () => {
    setContext({ filteredContacts: [makePerson()] })
    render(<ContactsTable />)

    // Columns are non-sortable so headers render as plain text, not buttons.
    for (const label of [
      'Name',
      'Gender',
      'Age',
      'Address',
      'Cell Phone',
      'Landline',
    ]) {
      expect(
        screen.getByRole('columnheader', { name: label }),
      ).toBeInTheDocument()
    }
  })

  it('renders one row per contact with formatted name', () => {
    setContext({
      filteredContacts: [
        makePerson({ id: '1', firstName: 'Jane', lastName: 'Doe' }),
        makePerson({ id: '2', firstName: 'John', lastName: 'Smith' }),
      ],
    })
    render(<ContactsTable />)

    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('John Smith')).toBeInTheDocument()
  })

  it('renders skeleton cells when isLoading is true', () => {
    setContext({ isLoading: true })
    const { container } = render(<ContactsTable />)

    // 6 skeleton columns x 20 rows (default page size) = 120 placeholders.
    // We just assert the skeleton class shows up and the real data cells
    // (e.g. "Jane Doe") do not.
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(
      0,
    )
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument()
  })

  it('calls selectPerson when a pro user clicks a row', async () => {
    const user = userEvent.setup()
    const selectPerson = vi.fn()
    setContext({
      filteredContacts: [makePerson({ id: 'pid_42' })],
      canUseProFeatures: true,
      selectPerson,
    })
    render(<ContactsTable />)

    await user.click(screen.getByText('Jane Doe'))

    expect(selectPerson).toHaveBeenCalledWith('pid_42')
  })

  it('opens the pro upgrade modal instead of selecting when the user is not pro', async () => {
    const user = userEvent.setup()
    const selectPerson = vi.fn()
    const showProModal = vi.fn()
    mockedUseShowContactProModal.mockReturnValue(showProModal)
    setContext({
      filteredContacts: [makePerson()],
      canUseProFeatures: false,
      selectPerson,
    })
    render(<ContactsTable />)

    await user.click(screen.getByText('Jane Doe'))

    expect(showProModal).toHaveBeenCalledWith(true)
    expect(selectPerson).not.toHaveBeenCalled()
  })

  it('blurs sensitive cells for non-pro users', () => {
    setContext({
      filteredContacts: [makePerson()],
      canUseProFeatures: false,
    })
    const { container } = render(<ContactsTable />)

    // Cell phone, landline, and address are wrapped in a blurred span for
    // non-pro users. Exactly three fields blur per row — assert the exact
    // count so accidentally blurring more cells fails the test.
    const blurredEls = container.querySelectorAll('.blur-\\[6px\\]')
    expect(blurredEls).toHaveLength(3)
  })

  it('does not blur sensitive cells for pro users', () => {
    setContext({
      filteredContacts: [makePerson()],
      canUseProFeatures: true,
    })
    const { container } = render(<ContactsTable />)

    expect(container.querySelectorAll('.blur-\\[6px\\]')).toHaveLength(0)
  })
})
