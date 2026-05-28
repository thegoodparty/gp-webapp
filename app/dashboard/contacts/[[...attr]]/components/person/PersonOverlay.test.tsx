import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import PersonOverlay from './PersonOverlay'
import { useContactsTable } from '../../hooks/ContactsTableProvider'
import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'
import { makePerson } from '../shared/test-fixtures'
import type {
  ConstituentIssue,
  ConstituentActivity,
} from '../shared/contacts-types'

vi.mock('../../hooks/ContactsTableProvider', () => ({
  useContactsTable: vi.fn(),
}))

vi.mock('@shared/experiments/FeatureFlagsProvider', () => ({
  useFlagOn: vi.fn(),
}))

// Google Maps would otherwise try to attach a Script tag and reference
// `window.google`. Stub it with a marker we can assert on.
vi.mock('@shared/utils/Map', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-map" />,
}))

const mockedUseContactsTable = vi.mocked(useContactsTable)
const mockedUseFlagOn = vi.mocked(useFlagOn)

type ContextValue = ReturnType<typeof useContactsTable>
type SelectedPerson = ContextValue['currentlySelectedPerson']

function setContext({
  selectedPersonId = 'p_1',
  selectedPerson,
  isElectedOfficial = false,
  selectPerson = vi.fn(),
}: {
  selectedPersonId?: string | null
  selectedPerson?: Partial<SelectedPerson>
  isElectedOfficial?: boolean
  selectPerson?: ContextValue['selectPerson']
} = {}) {
  const currentlySelectedPerson: SelectedPerson = {
    person: makePerson(),
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
    ...selectedPerson,
  }

  const ctx: ContextValue = {
    filteredContacts: [],
    currentlySelectedPersonId: selectedPersonId,
    currentlySelectedPerson,
    segments: [],
    customSegments: [],
    currentSegment: 'all',
    searchTerm: '',
    urlQueryParams: new URLSearchParams(),
    pagination: null,
    isLoading: false,
    isCustomSegment: false,
    totalSegmentContacts: 0,
    canUseProFeatures: true,
    isElectedOfficial,
    pageUp: vi.fn(),
    pageDown: vi.fn(),
    goToPage: vi.fn(),
    setPageSize: vi.fn(),
    selectPerson,
    selectSegment: vi.fn(),
    searchContacts: vi.fn(),
    refreshCustomSegments: vi.fn().mockResolvedValue(undefined),
  }
  mockedUseContactsTable.mockReturnValue(ctx)
  return ctx
}

describe('<PersonOverlay>', () => {
  beforeEach(() => {
    mockedUseContactsTable.mockReset()
    mockedUseFlagOn.mockReset()
    mockedUseFlagOn.mockReturnValue({ ready: true, on: false })
  })

  it('does not open the overlay when no person is selected', () => {
    setContext({ selectedPersonId: null })

    render(<PersonOverlay />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the loading skeleton while the person query is loading', () => {
    setContext({
      selectedPerson: { person: null, isLoadingPerson: true },
    })

    render(<PersonOverlay />)

    // Sheet content renders inside a Radix Portal, so query the document
    // instead of the render container.
    const dialog = screen.getByRole('dialog')
    expect(dialog.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
    // No real card section headings while loading.
    expect(
      screen.queryByRole('heading', { name: /contact information/i }),
    ).not.toBeInTheDocument()
  })

  it('renders the person details and the standard info sections', () => {
    setContext()

    render(<PersonOverlay />)

    // Person name renders as a real <h2>; the card titles render as styled
    // <div>s (CardTitle), so query them by text content.
    expect(
      screen.getByRole('heading', { name: /jane doe/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/female, 42 years old/i)).toBeInTheDocument()
    // CardTitle is a styled <div>; scope to data-slot to avoid colliding
    // with the sr-only SheetTitle that uses the same copy.
    const cardTitles = document.querySelectorAll('[data-slot="card-title"]')
    const titles = Array.from(cardTitles).map((el) => el.textContent?.trim())
    expect(titles).toEqual(
      expect.arrayContaining([
        'Contact Information',
        'Voter Demographics',
        'Demographic Information',
      ]),
    )
  })

  it('renders an error message and lets the user close the overlay when the person fetch fails', async () => {
    const user = userEvent.setup()
    const selectPerson = vi.fn()
    setContext({
      selectPerson,
      selectedPerson: { person: null, isErrorPerson: true },
    })

    render(<PersonOverlay />)

    const errorHeading = screen.getByRole('heading', {
      name: /error loading contact/i,
    })
    const errorBlock = errorHeading.parentElement
    if (!errorBlock) throw new Error('error block not rendered')

    // The error UI's Close button is a raw <button> next to the heading;
    // the Sheet renders its own (svg-icon) close button at the top right.
    await user.click(within(errorBlock).getByRole('button', { name: /close/i }))
    expect(selectPerson).toHaveBeenCalledWith(null)
  })

  it('hides the Political Party field for elected officials', () => {
    setContext({ isElectedOfficial: true })

    render(<PersonOverlay />)

    expect(screen.queryByText(/^political party$/i)).not.toBeInTheDocument()
  })

  it('hides Top Issues and Activity Feed when the feature flag is off', () => {
    mockedUseFlagOn.mockReturnValue({ ready: true, on: false })
    setContext()

    render(<PersonOverlay />)

    expect(screen.queryByText('Top Issues')).not.toBeInTheDocument()
    expect(screen.queryByText('Activity Feed')).not.toBeInTheDocument()
  })

  it('shows Top Issues and Activity Feed (with seeded data) when the feature flag is on', () => {
    mockedUseFlagOn.mockReturnValue({ ready: true, on: true })
    const issues: ConstituentIssue[] = [
      {
        issueTitle: 'Better Bike Lanes',
        issueSummary: 'Constituent supports bike-lane expansion',
        pollTitle: 'Transit',
        pollId: 'poll_1',
        date: '2026-05-01',
      },
    ]
    const activities: ConstituentActivity[] = [
      {
        type: 'poll',
        date: '2026-05-02',
        data: {
          pollId: 'poll_1',
          pollTitle: 'Transit Survey',
          events: [{ type: 'SENT', date: '2026-05-02T00:00:00.000Z' }],
        },
      },
    ]
    setContext({
      selectedPerson: { issues, activities },
    })

    render(<PersonOverlay />)

    expect(screen.getByText('Top Issues')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /better bike lanes/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('Activity Feed')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /transit survey/i }),
    ).toBeInTheDocument()
  })
})
