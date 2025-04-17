'use client'
import {
  onboardingStep,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions'
import { useRouter } from 'next/navigation'
import BallotRaces from './ballotOffices/BallotRaces'
import { useMemo, useState } from 'react'
import { buildTrackingAttrs, EVENTS, trackEvent } from 'helpers/fullStoryHelper'
import Button from '@shared/buttons/Button'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import OfficeStepForm from './OfficeStepForm'

async function runP2V(slug) {
  try {
    const resp = await clientFetch(apiRoutes.campaign.pathToVictory.create, {
      slug,
    })

    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export default function OfficeStep(props) {
  const { campaign, step, updateCallback, adminMode } = props
  const router = useRouter()
  const [state, setState] = useState({
    ballotOffice: false,
    originalPosition: campaign.details?.positionId,
  })

  const { ballotSearch } = state

  const [processing, setProcessing] = useState(false)
  const trackingAttrs = useMemo(
    () =>
      buildTrackingAttrs('Onboarding Next Button', {
        step,
      }),
    [step],
  )

  const canSubmit = () => {
    if (step) {
      return !!state.ballotOffice || !!state.originalPosition
    }
    const orgPosition = campaign.details?.positionId
    const orgElection = campaign.details?.electionId
    const orgRace = campaign.details?.raceId
    const { position, election, id } = state.ballotOffice
    if (!position || !election) {
      return false
    }

    return !(
      position?.id === orgPosition &&
      election?.id === orgElection &&
      id === orgRace
    )
  }

  const calcTerm = (position) => {
    if (!position) return undefined
    if (!position.electionFrequencies) return undefined
    if (!position.electionFrequencies.length === 0) return undefined
    if (!position.electionFrequencies[0]) return undefined
    return `${position.electionFrequencies[0]?.frequency} years`
  }

  const handleSave = async () => {
    setProcessing(true)
    if (!canSubmit()) {
      setProcessing(false)
      return
    }

    trackEvent(EVENTS.Onboarding.OfficeStep.ClickNext, {
      step,
    })

    const { position, election, id, filingPeriods } = state.ballotOffice

    const attr = [
      { key: 'details.positionId', value: position?.id },
      { key: 'details.electionId', value: election?.id },
      { key: 'details.raceId', value: id },
      { key: 'details.state', value: election?.state },
      { key: 'details.office', value: 'Other' },
      { key: 'details.otherOffice', value: position?.name },
      {
        key: 'details.officeTermLength',
        value: calcTerm(position),
      },
      { key: 'details.ballotLevel', value: position?.level },
      {
        key: 'details.primaryElectionDate',
        value: election?.primaryElectionDate,
      },
      {
        key: 'details.electionDate',
        value: election?.electionDay,
      },
      {
        key: 'details.partisanType',
        value: position?.partisanType,
      },
      {
        key: 'details.primaryElectionId',
        value: election?.primaryElectionId,
      },
      {
        key: 'details.hasPrimary',
        value: position?.hasPrimary,
      },
      {
        key: 'details.filingPeriodsStart',
        value:
          filingPeriods && filingPeriods.length > 0
            ? filingPeriods[0].startOn
            : undefined,
      },
      {
        key: 'details.filingPeriodsEnd',
        value:
          filingPeriods && filingPeriods.length > 0
            ? filingPeriods[0].endOn
            : undefined,
      },
      // reset the electionType and electionLocation
      // so it can run a full p2v.
      {
        key: 'pathToVictory.electionType',
        value: undefined,
      },
      {
        key: 'pathToVictory.electionLocation',
        value: undefined,
      },
    ]
    if (step) {
      const currentStep = onboardingStep(campaign, step)
      attr.push({ key: 'data.currentStep', value: currentStep })
    }

    if (adminMode) {
      await updateCampaign(attr, campaign.slug)
      await runP2V(campaign.slug)
    } else {
      await updateCampaign(attr)
      await runP2V()
    }

    if (step) {
      router.push(`/onboarding/${campaign.slug}/${step + 1}`)
    }
    if (updateCallback) {
      await updateCallback()
    }
    setProcessing(false)
  }

  const onSelect = async (office) => {
    if (office) {
      trackEvent(EVENTS.Onboarding.OfficeStep.OfficeSelected, {
        office: office?.position?.name,
      })

      setState({
        ...state,
        ballotOffice: office,
        originalPosition: false,
      })
    } else {
      setState({
        ...state,
        ballotOffice: false,
        originalPosition: false,
      })
    }
  }

  const selectedOffice = campaign.details?.positionId
    ? {
        position: { id: campaign.details.positionId },
        election: { id: campaign.details.electionId },
      }
    : false

  const updateState = (newState) => {
    setState({
      ...state,
      ballotSearch: newState,
    })
  }

  const handleBack = () => {
    trackEvent(EVENTS.Onboarding.OfficeStep.ClickBack, {
      step,
    })
  }

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center flex-col">
        <OfficeStepForm
          campaign={campaign}
          onChange={updateState}
          zip={ballotSearch?.zip || campaign.details?.zip}
          level={ballotSearch?.level || ''}
          adminMode={adminMode}
        />
        <>
          <div className="w-full max-w-2xl">
            <BallotRaces
              campaign={campaign}
              onSelect={onSelect}
              selectedOffice={selectedOffice}
              updateCallback={updateCallback}
              step={step}
              zip={ballotSearch?.zip || campaign.details?.zip}
              level={ballotSearch?.level}
              adminMode={adminMode}
              onBack={handleBack}
              fuzzyFilter={ballotSearch?.fuzzyFilter}
            />
          </div>
          <div className="flex w-full justify-center">
            <Button
              size="large"
              disabled={!canSubmit() || processing}
              loading={processing}
              type="submit"
              onClick={handleSave}
              {...trackingAttrs}
            >
              {step ? 'Next' : 'Save'}
            </Button>
          </div>
        </>
      </div>
    </form>
  )
}
