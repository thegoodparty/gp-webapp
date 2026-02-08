'use client'
import RaceCard from './RaceCard'
import { useState, ReactNode } from 'react'
import { CircularProgress } from '@mui/material'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import H3 from '@shared/typography/H3'
import CantFindRaceModal from './CantFindRaceModal'
import { useRouter } from 'next/navigation'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import Body2 from '@shared/typography/Body2'
import Fuse, { IFuseOptions } from 'fuse.js'
import { useQuery } from '@tanstack/react-query'
import { Campaign } from 'helpers/types'
import { Race } from './types'

interface BallotRacesCampaign extends Campaign {
  currentStep?: number
}

interface SelectedOffice {
  position?: { id?: string | number }
  election?: { id?: string | number | null }
}

interface BallotRacesProps {
  campaign: BallotRacesCampaign
  onSelect: (race: Race | false) => void
  selectedOffice?: SelectedOffice | false
  step?: number
  updateCallback?: () => void
  zip?: string
  level?: string
  adminMode?: boolean
  fuzzyFilter?: string
}

const FUSE_OPTIONS: IFuseOptions<Race> = {
  keys: ['position.name'],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 1,
  shouldSort: true,
  findAllMatches: true,
  includeScore: true,
  useExtendedSearch: true,
  isCaseSensitive: false,
}

const fetchRaces = async (zipcode: string, level?: string): Promise<Race[]> => {
  const cleanLevel =
    level === 'Local/Township/City'
      ? 'Local'
      : level === 'County/Regional'
      ? 'County'
      : level

  const payload = {
    zipcode,
    ...(cleanLevel
      ? {
          level: cleanLevel,
        }
      : {}),
  }

  const resp = await clientFetch<Race[]>(apiRoutes.elections.racesByYear, payload, {
    revalidate: 3600,
  })

  return resp.data
}

const getHighlightedText = (text: string, searchTerm: string): ReactNode => {
  if (!searchTerm) return text

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
  return parts.map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <strong className="text-blue-600" key={index}>
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

export default function BallotRaces({
  campaign,
  onSelect,
  selectedOffice,
  step,
  updateCallback,
  zip,
  level,
  adminMode,
  fuzzyFilter,
}: BallotRacesProps): React.JSX.Element {
  const query = useQuery({
    queryKey: ['races', zip, level],
    queryFn: async () => {
      if (!zip) {
        return null
      }

      const initRaces = await fetchRaces(zip, level)
      if (!initRaces) {
        throw new Error(`Couldn't fetch races for zip ${zip}`)
      }
      const sortedRaces = initRaces.sort((a, b) => {
        const nameA = a?.position?.name || ''
        const nameB = b?.position?.name || ''
        return nameA.localeCompare(nameB)
      })

      const racesData = sortedRaces.map((race) => ({
        ...race,
        position: { ...race.position, name: race.position?.name || '' },
      }))

      const fuse = new Fuse(racesData, FUSE_OPTIONS)

      return { sortedRaces, fuse }
    },
  })

  const races = query.data?.sortedRaces || []

  const filteredRaces =
    query.data && fuzzyFilter
      ? query.data.fuse.search(fuzzyFilter).map((result) => result.item)
      : query.data?.sortedRaces || []
  const [selected, setSelected] = useState<Race | SelectedOffice | false>(selectedOffice || false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const router = useRouter()

  if (!zip) {
    return <div>No valid zip</div>
  }

  const handleSelect = (race: { id: string }) => {
    const matchedRace = races.find(({ id }) => id === race.id)
    const selectedRace = race?.id === (selected && 'id' in selected ? selected.id : undefined) ? false : matchedRace || false
    setSelected(selectedRace)
    onSelect(selectedRace)
  }

  const handleShowModal = () => {
    trackEvent(EVENTS.Onboarding.OfficeStep.ClickCantSeeOffice)
    setShowHelpModal(true)
  }

  const handleCloseModal = () => {
    setShowHelpModal(false)
  }

  const handleSaveCustomOffice = async (updated: Campaign & { currentStep?: number }) => {
    updated.details.positionId = null
    updated.details.electionId = null
    if (step) {
      updated.currentStep = campaign.currentStep
        ? Math.max(campaign.currentStep, step)
        : step

      const attr = [
        { key: 'data.currentStep', value: updated.currentStep },
        { key: 'details.otherOffice', value: '' },
        { key: 'details.positionId', value: null },
        { key: 'details.electionId', value: null },
        { key: 'details.office', value: updated.details.office },
        { key: 'details.city', value: updated.details.city },
        { key: 'details.district', value: updated.details.district },
        {
          key: 'details.electionDate',
          value: updated.details.electionDate,
        },
        {
          key: 'details.officeTermLength',
          value: updated.details.officeTermLength,
        },
        { key: 'details.state', value: updated.details.state },
      ]
      await updateCampaign(attr)
      router.push(`/onboarding/${campaign.slug}/${step + 1}`)
    } else {
      const attr = [
        { key: 'details.otherOffice', value: '' },
        { key: 'details.positionId', value: null },
        { key: 'details.electionId', value: null },
        { key: 'details.office', value: updated.details.office },
        { key: 'details.city', value: updated.details.city },
        { key: 'details.district', value: updated.details.district },
        {
          key: 'details.electionDate',
          value: updated.details.electionDate,
        },
        {
          key: 'details.officeTermLength',
          value: updated.details.officeTermLength,
        },
        { key: 'details.state', value: updated.details.state },
      ]
      if (adminMode) {
        await updateCampaign(attr, campaign.slug)
      } else {
        await updateCampaign(attr)
      }
      if (updateCallback) {
        updateCallback()
      }
    }
  }

  const racesLength = filteredRaces?.length || 0
  const countMessage = `${racesLength} office${
    racesLength === 1 ? '' : 's'
  } found`

  return (
    <section className="mb-2">
      {query.isPending ? (
        <div className="mt-6 text-center">
          <CircularProgress />
          <br />
          <br />
          <H3>Loading Races</H3>
        </div>
      ) : (
        <Body2>
          <span className="mb-4 block">{countMessage}</span>
          {racesLength === 0 ? (
            <div className="bg-white rounded-lg p-6 border border-gray-200 mt-4">
              <ol className="space-y-2">
                <li>1. Try a different Zip Code</li>
                <li>2. Select a different office level</li>
                <li>3. Try another office name</li>
                <li>4. Double check your candidacy papers</li>
              </ol>
            </div>
          ) : (
            filteredRaces.map((race, index) => (
              <RaceCard
                key={index}
                race={{
                  ...race,
                  position: {
                    ...race.position,
                    name: getHighlightedText(
                      race?.position?.name || '',
                      fuzzyFilter || '',
                    ),
                  },
                }}
                selected={race?.id === (selected && 'id' in selected ? selected.id : undefined)}
                selectCallback={handleSelect}
              />
            ))
          )}
          <div className="my-8 text-center">
            <a
              onClick={handleShowModal}
              className="text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              I don&apos;t see my office
            </a>
          </div>
        </Body2>
      )}
      {showHelpModal && (
        <CantFindRaceModal
          campaign={campaign}
          onClose={handleCloseModal}
          onSaveCustomOffice={handleSaveCustomOffice}
        />
      )}
    </section>
  )
}
