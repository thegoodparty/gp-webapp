'use client'

import {
  Button,
  FilterPill,
  FilterPillGroup,
  Input,
  InputWithButton,
  RadioCardItem,
  RadioGroup,
  Skeleton,
} from '@styleguide'
import { useQuery } from '@tanstack/react-query'
import Fuse, { type IFuseOptions } from 'fuse.js'
import { Search } from 'lucide-react'
import { useMemo, useState, useEffect, useRef } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { clientRequest } from 'gpApi/typed-request'
import { apiRoutes } from 'gpApi/routes'
import { reportErrorToSentry } from '@shared/sentry'
import { useSnackbar } from 'helpers/useSnackbar'
import type { Race } from '../[slug]/[step]/components/ballotOffices/types'
import type { SelectedOffice } from './onboardingTypes'

interface OfficeSelectionStepProps {
  zip: string | undefined
  selected: SelectedOffice | undefined
  onZipChange: (zip: string) => void
  onSelect: (office: SelectedOffice | undefined) => void
  onCantFindOffice: () => void
  onHydratingChange?: (isHydrating: boolean) => void
}

interface FilterOption {
  label: string
  value: string
  count: number
}

const FILTER_PRIORITY: Record<string, number> = {
  'City Council': 0,
  Mayor: 1,
  'School Board': 2,
  'State Senate': 3,
  Sheriff: 4,
  Judge: 5,
  Other: 6,
}

const DEPRIORITIZED_CATEGORIES = new Set(['Judge', 'Other'])

const FILTER_BUCKETS: ReadonlyArray<{
  label: string
  match: (race: Race) => boolean
}> = [
  {
    label: 'City Council',
    match: (race) => /city council/i.test(race.position?.name ?? ''),
  },
  {
    label: 'Mayor',
    match: (race) => /mayor/i.test(race.position?.name ?? ''),
  },
  {
    label: 'School Board',
    match: (race) => /school/i.test(race.position?.name ?? ''),
  },
  {
    label: 'State Senate',
    match: (race) => /state senate/i.test(race.position?.name ?? ''),
  },
  {
    label: 'Sheriff',
    match: (race) => /sheriff/i.test(race.position?.name ?? ''),
  },
  {
    label: 'Judge',
    match: (race) => /judge|justice/i.test(race.position?.name ?? ''),
  },
]

const getBucketLabel = (race: Race): string => {
  const matched = FILTER_BUCKETS.find((bucket) => bucket.match(race))
  return matched?.label ?? 'Other'
}

const sortFilters = (filters: FilterOption[]): FilterOption[] =>
  [...filters].sort((a, b) => {
    const pa = FILTER_PRIORITY[a.label] ?? 7
    const pb = FILTER_PRIORITY[b.label] ?? 7
    return pa !== pb ? pa - pb : a.label.localeCompare(b.label)
  })

const isZipValid = (value: string): boolean => /^\d{5}$/.test(value.trim())

const FUSE_OPTIONS: IFuseOptions<Race> = {
  keys: ['position.name'],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 1,
  shouldSort: true,
  findAllMatches: true,
  isCaseSensitive: false,
}

const fetchRaces = async (zip: string): Promise<Race[]> => {
  const resp = await clientFetch<Race[]>(
    apiRoutes.elections.racesByYear,
    { zipcode: zip },
    { revalidate: 3600 },
  )
  if (!resp.ok) {
    throw new Error(
      `racesByYear returned ${resp.status} ${resp.statusText}`.trim(),
    )
  }
  return Array.isArray(resp.data) ? resp.data : []
}

const formatElectionDate = (date?: string): string => {
  if (!date) return 'Election date unavailable'
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date)
  const parsed = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(date)
  if (Number.isNaN(parsed.getTime())) return `Election date: ${date}`
  return `Election date: ${parsed.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`
}

const getElectionYear = (date?: string): string => {
  if (!date) return 'Unknown year'
  const year = date.slice(0, 4)
  return /^\d{4}$/.test(year) ? year : 'Unknown year'
}

const groupByYear = (races: Race[]): Map<string, Race[]> => {
  const groups = new Map<string, Race[]>()
  for (const race of races) {
    const year = getElectionYear(race.election?.electionDay)
    const group = groups.get(year) ?? []
    group.push(race)
    groups.set(year, group)
  }
  return new Map([...groups.entries()].sort(([a], [b]) => a.localeCompare(b)))
}

const calcTerm = (position: Race['position']): string | undefined => {
  const frequency = position?.electionFrequencies?.[0]?.frequency
  return typeof frequency === 'number' ? `${frequency} years` : undefined
}

const toSelectedOffice = (race: Race): SelectedOffice => {
  const filingPeriod = race.filingPeriods?.[0]
  return {
    raceId: race.id,
    // Lean RaceListItem carries the BR position id at the top level
    // (`brPositionId`); the hydrated RaceFull surfaces it as `position.id`.
    // Fall back across both shapes so `selected.positionId` is always the BR
    // position id, regardless of which stage of selection we're at.
    positionId: race.position?.id ?? race.brPositionId,
    positionName: race.position?.name ?? '',
    level: race.position?.level,
    city: race.city ?? undefined,
    electionDay: race.election?.electionDay,
    electionId: race.election?.id,
    state: race.election?.state,
    partisanType: race.position?.partisanType,
    hasPrimary: race.position?.hasPrimary,
    primaryElectionDate: race.election?.primaryElectionDate,
    primaryElectionId: race.election?.primaryElectionId,
    officeTermLength: calcTerm(race.position),
    filingPeriodsStart: filingPeriod?.startOn,
    filingPeriodsEnd: filingPeriod?.endOn,
  }
}

// Stable per-row identity for UI selection state. Composed of BR position id +
// electionDay because those exist on both the lean RaceListItem and the
// hydrated RaceFull, so the radio key survives the lean → hydrated transition
// without us needing to override the race's `id`. Letting `id` flow through
// unchanged keeps the BallotReady race hash on `selected.raceId`, which is what
// downstream (filing-fee lookup, etc.) actually wants.
const rowKey = (race: Race): string =>
  `${race.brPositionId ?? race.position?.id ?? ''}|${race.election?.electionDay ?? ''}`

const selectedRowKey = (selected: SelectedOffice | undefined): string =>
  selected ? `${selected.positionId ?? ''}|${selected.electionDay ?? ''}` : ''

const RaceListSkeleton = () => (
  <div aria-label="Loading offices" className="space-y-6" role="status">
    <div className="flex flex-wrap gap-2">
      <Skeleton className="h-10 w-32 rounded-full" />
      <Skeleton className="h-10 w-24 rounded-full" />
      <Skeleton className="h-10 w-28 rounded-full" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-4 w-20 rounded-md" />
      <Skeleton className="h-19.5 w-full rounded-md" />
      <Skeleton className="h-19.5 w-full rounded-md" />
    </div>
  </div>
)

const EmptyState = ({ message }: { message: string }) => (
  <p className="rounded-xl border border-base-border px-4 py-8 text-center text-sm text-muted-foreground">
    {message}
  </p>
)

export const OfficeSelectionStep = ({
  zip,
  selected,
  onZipChange,
  onSelect,
  onCantFindOffice,
  onHydratingChange,
}: OfficeSelectionStepProps): React.JSX.Element => {
  const [zipInput, setZipInput] = useState(zip ?? '')
  const [submittedZip, setSubmittedZip] = useState<string | undefined>(zip)
  const [nameFilter, setNameFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('')
  const { errorSnackbar } = useSnackbar()

  const canSearch = isZipValid(zipInput)

  const query = useQuery({
    queryKey: ['onboarding-races', submittedZip],
    queryFn: () => fetchRaces(submittedZip as string),
    enabled: Boolean(submittedZip && isZipValid(submittedZip)),
  })

  useEffect(() => {
    if (!query.error) return
    reportErrorToSentry(query.error, {
      context: 'onboarding.officeSelection.fetchRaces',
      zip: submittedZip,
    })
  }, [query.error, submittedZip])

  const races = useMemo(() => query.data ?? [], [query.data])

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const race of races) {
      const label = getBucketLabel(race)
      counts.set(label, (counts.get(label) ?? 0) + 1)
    }
    return counts
  }, [races])

  const filterOptions = useMemo<FilterOption[]>(() => {
    const opts: FilterOption[] = Array.from(categoryCounts.entries()).map(
      ([label, count]) => ({ label, value: label, count }),
    )
    return sortFilters(opts)
  }, [categoryCounts])

  const filteredRaces = useMemo(() => {
    let working = races
    if (activeFilter) {
      working = working.filter((race) => getBucketLabel(race) === activeFilter)
    }
    if (nameFilter.trim()) {
      const fuse = new Fuse(working, FUSE_OPTIONS)
      working = fuse.search(nameFilter.trim()).map((result) => result.item)
    }
    const rank = (label: string): [number, number] => {
      const deprioritized = DEPRIORITIZED_CATEGORIES.has(label) ? 1 : 0
      const count = categoryCounts.get(label) ?? 0
      return [deprioritized, -count]
    }
    return [...working].sort((a, b) => {
      const [da, ca] = rank(getBucketLabel(a))
      const [db, cb] = rank(getBucketLabel(b))
      if (da !== db) return da - db
      if (ca !== cb) return ca - cb
      return getBucketLabel(a).localeCompare(getBucketLabel(b))
    })
  }, [races, activeFilter, nameFilter, categoryCounts])

  const officesByYear = useMemo(
    () => groupByYear(filteredRaces),
    [filteredRaces],
  )

  const handleSearch = () => {
    if (!canSearch) return
    const cleaned = zipInput.trim()
    setSubmittedZip(cleaned)
    setActiveFilter('')
    setNameFilter('')
    hydratedRacesRef.current.clear()
    pendingHydrationRaceIdRef.current = null
    onZipChange(cleaned)
    onSelect(undefined)
    onHydratingChange?.(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleSearch()
  }

  const hydratedRacesRef = useRef<Map<string, Race>>(new Map())
  // Tracks the most recently clicked race so an in-flight hydration result
  // for a previously clicked race can detect that it's stale and bail.
  // Updated synchronously inside the click handler so it doesn't depend on
  // the parent feeding the new `selected` prop back through a re-render.
  const pendingHydrationRaceIdRef = useRef<string | null>(null)

  const hydrateRace = async (race: Race): Promise<Race | null> => {
    if (!race.brPositionId || !race.election?.electionDay || !submittedZip) {
      errorSnackbar('Could not load this race. Please try a different one.')
      return null
    }
    try {
      const { data } = await clientRequest(
        'GET /v1/elections/race-by-position',
        {
          brPositionId: race.brPositionId,
          zip: submittedZip,
          electionDate: race.election.electionDay,
        },
      )
      // Pass the hydrated race through unchanged so `data.id` (the BallotReady
      // race hash) ends up on `selected.raceId`. The radio's selection state
      // doesn't depend on race-row id any more — it's keyed on
      // (brPositionId, electionDay) via `rowKey` — so dropping the previous
      // `id: race.id` override no longer breaks the picker.
      return data
    } catch {
      errorSnackbar('Could not load race details. Please try again.')
      return null
    }
  }

  const handleSelectRace = async (race: Race) => {
    if (selectedRowKey(selected) === rowKey(race)) {
      pendingHydrationRaceIdRef.current = null
      onSelect(undefined)
      onHydratingChange?.(false)
      return
    }

    // Cached hydration: previous click on this race already enriched it.
    const cached = hydratedRacesRef.current.get(race.id)
    if (cached) {
      pendingHydrationRaceIdRef.current = null
      onSelect(toSelectedOffice(cached))
      onHydratingChange?.(false)
      return
    }

    // Optimistic select so the radio reflects the click immediately.
    pendingHydrationRaceIdRef.current = race.id
    onSelect(toSelectedOffice(race))
    onHydratingChange?.(true)
    const zipAtClick = submittedZip
    const hydrated = await hydrateRace(race)

    // The user may have clicked a different race, deselected, or changed zip
    // while we were hydrating. If so, bail — the newer handler owns state.
    if (pendingHydrationRaceIdRef.current !== race.id) {
      // Only cache if the zip context still matches; otherwise this result
      // belongs to a previous zip and would poison cache for the new one.
      if (hydrated && submittedZip === zipAtClick) {
        hydratedRacesRef.current.set(race.id, hydrated)
      }
      return
    }

    pendingHydrationRaceIdRef.current = null
    if (hydrated) {
      hydratedRacesRef.current.set(race.id, hydrated)
      onSelect(toSelectedOffice(hydrated))
    } else {
      onSelect(undefined)
    }
    onHydratingChange?.(false)
  }

  const showResults = Boolean(submittedZip) && query.isSuccess
  const totalOffices = races.length
  const filteredCount = filteredRaces.length

  return (
    <>
      <div className="space-y-6 text-left">
        <form noValidate onSubmit={handleSubmit}>
          <InputWithButton
            label="ZIP code"
            inputMode="numeric"
            maxLength={5}
            pattern="[0-9]{5}"
            placeholder="Enter your ZIP code"
            value={zipInput}
            onChange={(event) =>
              setZipInput(event.target.value.replace(/\D/g, ''))
            }
            aria-invalid={
              query.isError || (Boolean(zipInput) && !canSearch) || undefined
            }
            buttonLabel="Search"
            buttonProps={{
              type: 'submit',
              disabled: !canSearch || query.isFetching,
              loading: query.isFetching,
            }}
          />
        </form>

        {!submittedZip && !query.isFetching ? (
          <EmptyState message="Enter your ZIP code above to see available offices." />
        ) : null}

        {query.isFetching ? <RaceListSkeleton /> : null}

        {query.isError ? (
          <EmptyState message="We couldn't load offices for that ZIP code. Try again." />
        ) : null}

        {showResults ? (
          <div className="space-y-4">
            {submittedZip && isZipValid(submittedZip) ? (
              <Input
                icon={<Search />}
                aria-label="Search by office name"
                placeholder="Search by office name"
                value={nameFilter}
                onChange={(event) => setNameFilter(event.target.value)}
                className="bg-base-surface"
              />
            ) : null}

            {filterOptions.length > 0 ? (
              <FilterPillGroup
                value={activeFilter}
                onValueChange={(value) => {
                  setActiveFilter(value)
                  pendingHydrationRaceIdRef.current = null
                  onSelect(undefined)
                  onHydratingChange?.(false)
                }}
              >
                {filterOptions.map((option) => (
                  <FilterPill key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </FilterPill>
                ))}
              </FilterPillGroup>
            ) : null}

            {filteredCount === 0 ? (
              <EmptyState
                message={
                  totalOffices === 0
                    ? "We couldn't find any offices for that ZIP code. Try a different ZIP code or enter your office manually below."
                    : activeFilter || nameFilter.trim()
                    ? 'No offices match that filter. Try clearing filters or another office type.'
                    : 'No offices available right now. Please try again or enter your office manually below.'
                }
              />
            ) : (
              <RadioGroup
                aria-label="Available offices"
                className="flex flex-col"
                value={selectedRowKey(selected)}
                onValueChange={(key) => {
                  const race = races.find((r) => rowKey(r) === key)
                  if (race) void handleSelectRace(race)
                }}
              >
                <p className="text-sm text-muted-foreground">
                  {`${filteredCount} office${
                    filteredCount === 1 ? '' : 's'
                  } showing. Please select yours.`}
                </p>
                {Array.from(officesByYear.entries()).map(
                  ([year, yearRaces]) => (
                    <div
                      className="flex flex-col gap-3"
                      data-testid={`race-form-year-section-${year}`}
                      data-year={year}
                      key={year}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="shrink-0 text-sm text-muted-foreground"
                          data-testid="race-form-year-header"
                        >
                          {year}
                        </span>
                        <div className="h-px flex-1 bg-base-border" />
                      </div>
                      {yearRaces.map((race) => {
                        const positionName = race.position?.name ?? 'Office'
                        const cityLabel = race.city ? ` — ${race.city}` : ''
                        const key = rowKey(race)
                        return (
                          <RadioCardItem
                            key={key}
                            value={key}
                            id={`race-${key}`}
                            title={`${positionName}${cityLabel}`}
                            description={formatElectionDate(
                              race.election?.electionDay,
                            )}
                          />
                        )
                      })}
                    </div>
                  ),
                )}
              </RadioGroup>
            )}
          </div>
        ) : null}

        {showResults ? (
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              size="small"
              onClick={onCantFindOffice}
            >
              I don&apos;t see my office
            </Button>
          </div>
        ) : null}
      </div>
    </>
  )
}
