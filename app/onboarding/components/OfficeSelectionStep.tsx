'use client'

import { Button, Input, Label, Skeleton } from '@styleguide'
import { useQuery } from '@tanstack/react-query'
import Fuse, { type IFuseOptions } from 'fuse.js'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { useId, useMemo, useState, useEffect } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { reportErrorToSentry } from '@shared/sentry'
import type { Race } from '../[slug]/[step]/components/ballotOffices/types'
import type { SelectedOffice } from './onboardingTypes'

interface OfficeSelectionStepProps {
  zip: string | undefined
  selected: SelectedOffice | undefined
  onZipChange: (zip: string) => void
  onSelect: (office: SelectedOffice | undefined) => void
  onCantFindOffice: () => void
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
  return resp.data ?? []
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
    positionId: race.position?.id,
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
  <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-base text-slate-700">
    {message}
  </div>
)

export const OfficeSelectionStep = ({
  zip,
  selected,
  onZipChange,
  onSelect,
  onCantFindOffice,
}: OfficeSelectionStepProps): React.JSX.Element => {
  const zipInputId = useId()
  const [zipInput, setZipInput] = useState(zip ?? '')
  const [submittedZip, setSubmittedZip] = useState<string | undefined>(zip)
  const [nameFilter, setNameFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('')

  const canSearch = isZipValid(zipInput)

  const query = useQuery({
    queryKey: ['onboarding-races', submittedZip],
    queryFn: () => fetchRaces(submittedZip as string),
    enabled: Boolean(submittedZip && isZipValid(submittedZip)),
  })

  useEffect(() => {
    if (!query.error) return
    reportErrorToSentry(query.error as Error, {
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
    onZipChange(cleaned)
    onSelect(undefined)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleSearch()
  }

  const handleSelectRace = (race: Race) => {
    if (selected?.raceId === race.id) {
      onSelect(undefined)
    } else {
      onSelect(toSelectedOffice(race))
    }
  }

  const showResults = Boolean(submittedZip) && query.isSuccess
  const totalOffices = races.length
  const filteredCount = filteredRaces.length

  return (
    <>
      <div className="space-y-6 text-left">
        <form className="space-y-2" noValidate onSubmit={handleSubmit}>
          <Label
            className="text-sm font-medium text-slate-900"
            htmlFor={zipInputId}
          >
            Zip code
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={zipInputId}
              inputMode="numeric"
              maxLength={5}
              pattern="[0-9]{5}"
              placeholder="ZIP"
              value={zipInput}
              onChange={(event) =>
                setZipInput(event.target.value.replace(/\D/g, ''))
              }
              aria-invalid={
                query.isError || (Boolean(zipInput) && !canSearch) || undefined
              }
              className="rounded-full bg-white px-4"
            />
            <Button
              type="submit"
              variant="secondary"
              disabled={!canSearch || query.isFetching}
            >
              {query.isFetching ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </form>

        {!submittedZip && !query.isFetching ? (
          <EmptyState message="Enter your zip code to see offices" />
        ) : null}

        {query.isFetching ? <RaceListSkeleton /> : null}

        {query.isError ? (
          <EmptyState message="We couldn't load offices for that ZIP code. Try again." />
        ) : null}

        {showResults ? (
          <div className="space-y-4">
            {submittedZip && isZipValid(submittedZip) ? (
              <Input
                aria-label="Search by office name"
                placeholder="Search by office name"
                value={nameFilter}
                onChange={(event) => setNameFilter(event.target.value)}
                className="rounded-full bg-white px-4"
              />
            ) : null}

            <div className="flex flex-col gap-3">
              {filterOptions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((option) => {
                    const isActive = activeFilter === option.value
                    return (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => {
                          setActiveFilter(isActive ? '' : option.value)
                          onSelect(undefined)
                        }}
                        aria-pressed={isActive}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                          isActive
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {option.label} ({option.count})
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>

            {filteredCount === 0 ? (
              <EmptyState
                message={
                  totalOffices === 0
                    ? "We couldn't find any offices for that ZIP. Try a different ZIP or enter your office manually below."
                    : activeFilter || nameFilter.trim()
                    ? 'No offices match that filter. Try clearing filters or another office type.'
                    : 'No offices available right now. Please try again or enter your office manually below.'
                }
              />
            ) : (
              <div
                role="radiogroup"
                aria-label="Available offices"
                className="space-y-6"
              >
                <p className="text-sm leading-5 text-slate-500">
                  {activeFilter !== ''
                    ? `${filteredCount} office${filteredCount === 1 ? '' : 's'}`
                    : `${totalOffices} office${
                        totalOffices === 1 ? '' : 's'
                      } showing. Please select your office.`}
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
                          className="shrink-0 text-sm text-slate-500"
                          data-testid="race-form-year-header"
                        >
                          {year}
                        </span>
                        <div className="h-px flex-1 bg-slate-200" />
                      </div>
                      {yearRaces.map((race) => {
                        const isSelected = selected?.raceId === race.id
                        const positionName = race.position?.name ?? 'Office'
                        const cityLabel = race.city ? ` — ${race.city}` : ''
                        return (
                          <button
                            type="button"
                            key={race.id}
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => handleSelectRace(race)}
                            className={`flex w-full cursor-pointer items-start gap-3 rounded-md border bg-white p-4 text-left transition-colors hover:border-slate-300 ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                                : 'border-slate-200'
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center ${
                                isSelected ? 'text-blue-600' : 'text-slate-300'
                              }`}
                            >
                              {isSelected ? (
                                <CheckCircle2 className="size-5 fill-blue-600 text-white" />
                              ) : (
                                <Circle className="size-5" />
                              )}
                            </span>
                            <span className="flex-1 space-y-1">
                              <span className="block text-sm font-semibold text-slate-950">
                                {positionName}
                                {cityLabel}
                              </span>
                              <span className="block text-xs text-slate-500">
                                {formatElectionDate(race.election?.electionDay)}
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        ) : null}

        {showResults ? (
          <div className="text-center">
            <button
              type="button"
              onClick={onCantFindOffice}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              I don&apos;t see my office
            </button>
          </div>
        ) : null}
      </div>
    </>
  )
}
