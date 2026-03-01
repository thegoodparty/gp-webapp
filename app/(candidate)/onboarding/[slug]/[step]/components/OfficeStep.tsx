'use client'
import React, { useMemo, useState } from 'react'
import {
  createCampaignWithOffice,
  onboardingStep,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions'
import { useRouter } from 'next/navigation'
import BallotRaces from './ballotOffices/BallotRaces'
import { buildTrackingAttrs, EVENTS, trackEvent } from 'helpers/analyticsHelper'
import Button from '@shared/buttons/Button'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import OfficeStepForm from './OfficeStepForm'
import { useTrackOfficeSearch } from '@shared/hooks/useTrackOfficeSearch'
import { useUser } from '@shared/hooks/useUser'
import { identifyUser } from '@shared/utils/analytics'
import { Campaign } from 'helpers/types'
import { Race, RacePosition } from './ballotOffices/types'

interface BallotSearch {
  zip?: string
  level?: string
  inputValue?: string
  fuzzyFilter?: string
}

interface OfficeStepState {
  ballotOffice: Race | false
  originalPosition: string | number | null | undefined | false
  ballotSearch?: BallotSearch
}

interface OfficeStepProps {
  campaign?: Campaign
  step?: number
  updateCallback?: () => void | Promise<void>
  adminMode?: boolean
}

interface CampaignResponse extends Campaign {
  error?: string
}

async function updateRaceTargetDetails(
  slug: string | undefined = undefined,
): Promise<Campaign | false> {
  try {
    const endpoint = slug
      ? apiRoutes.campaign.raceTargetDetails.adminUpdate
      : apiRoutes.campaign.raceTargetDetails.update
    const resp = await clientFetch<CampaignResponse>(endpoint, { slug })

    if (resp.data && resp.data.error) {
      console.error('API error: ', resp.data)
      return false
    }
    return resp.data
  } catch (error) {
    console.error('error: ', error)
    return false
  }
}

interface UpdateAttr {
  key: string
  value: string | number | boolean | undefined
}

async function runPostOfficeStepUpdates(
  attr: UpdateAttr[],
  slug: string | undefined = undefined,
): Promise<void> {
  await updateCampaign(attr, slug)
  // The API handles P2V record creation and silver enqueue in all cases
  // (gold failure, gold success without turnout, etc.), so the webapp
  // does not need to enqueue separately.
  await updateRaceTargetDetails(slug)
}

export default function OfficeStep({
  campaign,
  step,
  updateCallback,
  adminMode,
}: OfficeStepProps): React.JSX.Element {
  const router = useRouter()
  const [state, setState] = useState<OfficeStepState>({
    ballotOffice: false,
    originalPosition: campaign?.details?.positionId,
  })
  const [user] = useUser()

  const { ballotSearch } = state

  const [processing, setProcessing] = useState(false)
  const trackingAttrs = useMemo(
    () =>
      buildTrackingAttrs('Onboarding Next Button', step ? { step } : undefined),
    [step],
  )
  useTrackOfficeSearch({
    zip: ballotSearch?.zip,
    level: ballotSearch?.level,
    officeName: ballotSearch?.inputValue || ballotSearch?.fuzzyFilter,
  })

  const canSubmit = (): boolean => {
    if (step) {
      return !!state.ballotOffice || !!state.originalPosition
    }
    const orgPosition = campaign?.details?.positionId
    const orgElection = campaign?.details?.electionId
    const orgRace = campaign?.details?.raceId
    if (!state.ballotOffice) {
      return false
    }
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

  const calcTerm = (position: RacePosition | undefined): string | undefined => {
    if (!position) return undefined
    if (!position.electionFrequencies) return undefined
    if (position.electionFrequencies.length === 0) return undefined
    if (!position.electionFrequencies[0]) return undefined
    return `${position.electionFrequencies[0]?.frequency} years`
  }

  const handleSave = async (): Promise<void> => {
    setProcessing(true)
    if (!canSubmit() || !state.ballotOffice) {
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
            ? filingPeriods[0]?.startOn
            : undefined,
      },
      {
        key: 'details.filingPeriodsEnd',
        value:
          filingPeriods && filingPeriods.length > 0
            ? filingPeriods[0]?.endOn
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

    const trackingProperties = {
      officeState: position.state,
      officeMunicipality: 'Unavailable',
      officeName: position.name,
      officeElectionDate: election.electionDay,
    }

    if (adminMode && campaign) {
      await runPostOfficeStepUpdates(attr, campaign.slug)
    } else if (campaign) {
      await identifyUser(user?.id, trackingProperties)
      trackEvent(EVENTS.Onboarding.OfficeStep.OfficeCompleted, {
        ...trackingProperties,
        officeManuallyInput: false,
      })
      await runPostOfficeStepUpdates(attr)
    } else {
      await identifyUser(user?.id, trackingProperties)
      trackEvent(EVENTS.Onboarding.OfficeStep.OfficeCompleted, {
        ...trackingProperties,
        officeManuallyInput: false,
      })
      const newCampaign = await createCampaignWithOffice(attr)
      if (!newCampaign) {
        setProcessing(false)
        return
      }
      await updateRaceTargetDetails()
      router.push(`/onboarding/${newCampaign.slug}/2`)
      setProcessing(false)
      return
    }

    if (step) {
      router.push(`/onboarding/${campaign?.slug}/${step + 1}`)
    }
    if (updateCallback) {
      await updateCallback()
    }
    setProcessing(false)
  }

  const onSelect = async (office: Race | false): Promise<void> => {
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

  const selectedOffice:
    | {
        position: { id: string | number | undefined }
        election: { id: string | number | null | undefined }
      }
    | false = campaign?.details?.positionId
    ? {
        position: { id: campaign.details.positionId },
        election: { id: campaign.details.electionId },
      }
    : false

  const updateState = (newState: BallotSearch): void => {
    setState({
      ...state,
      ballotSearch: newState,
    })
  }

  const zip =
    ballotSearch?.zip || campaign?.details?.zip || user?.zip || undefined

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center flex-col">
        <OfficeStepForm
          onChange={updateState}
          zip={zip}
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
              zip={zip}
              level={ballotSearch?.level}
              adminMode={adminMode}
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
