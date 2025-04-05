'use client'
import RaceCard from './RaceCard'
import { useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import H3 from '@shared/typography/H3'
import CantFindRaceModal from './CantFindRaceModal'
import { useRouter } from 'next/navigation'
import Button from '@shared/buttons/Button'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper'

const fetchRaces = async (zipcode, level, electionDate) => {
  let cleanLevel = level
  if (level === 'Local/Township/City') {
    cleanLevel = 'Local'
  }
  if (level === 'County/Regional') {
    cleanLevel = 'County'
  }
  const payload = {
    zipcode,
    level: cleanLevel,
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
  const [inputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState(selectedOffice || false)
  const [loading, setLoading] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const router = useRouter()

  useEffect(() => {
    loadRaces(zip, level, electionDate)
  }, [])

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

  return (
    <section className="mb-2">
      <H1 className="text-center">Which office are you running for?</H1>
      <Body1 className="text-center mt-4">
        Make sure it matches your candidacy papers from when you filed for
        office.
      </Body1>

      {loading ? (
        <div className="mt-6 text-center">
          <CircularProgress />
          <br />
          <br />
          <H3>Loading Races</H3>
        </div>
      ) : (
        <div className="mt-6">
          {Array.isArray(races) &&
            races.map((race, index) => (
              <RaceCard
                key={index}
                race={race}
                selected={race?.id === selected.id}
                selectCallback={handleSelect}
                inputValue={inputValue}
              />
            ))}
          <Button
            onClick={handleShowModal}
            color="neutral"
            variant="text"
            size="large"
            className="w-full"
          >
            I can&apos;t find my office
          </Button>
        </div>
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
