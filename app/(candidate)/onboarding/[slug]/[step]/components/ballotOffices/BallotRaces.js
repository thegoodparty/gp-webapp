'use client'
import RaceCard from './RaceCard'
import { useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import H3 from '@shared/typography/H3'
import CantFindRaceModal from './CantFindRaceModal'
import { useRouter } from 'next/navigation'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { EVENTS, trackEvent } from 'helpers/fullStoryHelper'
import Body2 from '@shared/typography/Body2'

const fetchRaces = async (zipcode, level, electionDate) => {
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
    ...(electionDate ? { electionDate } : {}),
  }

  const resp = await clientFetch(apiRoutes.elections.racesByYear, payload, {
    revalidate: 3600,
  })

  return resp.data
}

export default function BallotRaces(props) {
  const {
    campaign,
    selectedOfficeCallback,
    selectedOffice,
    step,
    updateCallback,
    zip,
    level,
    electionDate,
    adminMode,
    onBack,
  } = props
  const [races, setRaces] = useState(false)
  const [inputValue] = useState('')
  const [selected, setSelected] = useState(selectedOffice || false)
  const [loading, setLoading] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const router = useRouter()

  useEffect(() => {
    loadRaces(zip, level, electionDate)
  }, [zip, level, electionDate])

  const loadRaces = async (zip, level, electionDate) => {
    if (zip) {
      setLoading(true)
      const initRaces = await fetchRaces(zip, level, electionDate)
      if (!initRaces) {
        throw new Error(`Couldn't fetch races for zip ${zip}`)
      }
      setRaces(
        initRaces.sort((a, b) =>
          a.election.electionDay.localeCompare(b.election.electionDay),
        ),
      )
      setLoading(false)
    }
  }

  if (!zip) {
    return <div>No valid zip</div>
  }

  const handleSelect = (race) => {
    if (race?.id === selected?.id) {
      setSelected(false)
      selectedOfficeCallback(false)
    } else {
      setSelected(race)
      selectedOfficeCallback(race)
    }
  }

  const handleShowModal = () => {
    trackEvent(EVENTS.Onboarding.OfficeStep.ClickCantSeeOffice)
    setShowHelpModal(true)
  }

  const handleCloseModal = () => {
    setShowHelpModal(false)
  }

  const handleSaveCustomOffice = async (updated) => {
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

  const racesLength = races?.length || 0
  const countMessage = `${racesLength} office${
    racesLength === 1 ? '' : 's'
  } found`

  return (
    <section className="mb-2">
      {/*<H1 className="text-center">Which office are you running for?</H1>*/}
      {/*<Body1 className="text-center mt-4">*/}
      {/*  Make sure it matches your candidacy papers from when you filed for*/}
      {/*  office.*/}
      {/*</Body1>*/}

      {loading ? (
        <div className="mt-6 text-center">
          <CircularProgress />
          <br />
          <br />
          <H3>Loading Races</H3>
        </div>
      ) : (
        <Body2>
          {countMessage}
          {races?.length === 0 ? (
            <div className="bg-white rounded-lg p-6 border border-gray-200 mt-4">
              <ol className="space-y-2">
                <li>1. Try a different Zip Code</li>
                <li>2. Select a different office level</li>
                <li>3. Try another office name</li>
                <li>4. Double check your candidacy papers</li>
              </ol>
            </div>
          ) : (
            Array.isArray(races) &&
            races.map((race, index) => (
              <RaceCard
                key={index}
                race={race}
                selected={race?.id === selected.id}
                selectCallback={handleSelect}
                inputValue={inputValue}
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
          onBack={onBack}
          onSaveCustomOffice={handleSaveCustomOffice}
        />
      )}
    </section>
  )
}
