'use client'
import React, { useMemo, useState } from 'react'
import {
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
  campaign: Campaign
  step?: number
  updateCallback?: () => void | Promise<void>
  adminMode?: boolean
}

async function runP2V(slug: string): Promise<boolean> {
  try {
    const resp = await clientFetch<boolean>(
      apiRoutes.campaign.pathToVictory.create,
      {
        slug,
      },
    )

    return !!resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

interface CampaignResponse extends Campaign {
  error?: string
}

async function updateRaceTargetDetails(
  slug: string | undefined = undefined,
): Promise<Campaign | false> {
  try {
    const resp = await clientFetch<CampaignResponse>(
      apiRoutes.campaign.raceTargetDetails.update,
      {
        slug,
      },
    )

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
  const campaign = await updateRaceTargetDetails(slug)
  // If gold flow failed (!campaign) or succeeded but found no turnout,
  // enqueue silver (LLM-based matching) as fallback.
  if (!campaign || !campaign?.pathToVictory?.data?.projectedTurnout) {
    runP2V(slug!)
  }
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
    originalPosition: campaign.details?.positionId,
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
    const orgPosition = campaign.details?.positionId
    const orgElection = campaign.details?.electionId
    const orgRace = campaign.details?.raceId
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

    if (adminMode) {
      await runPostOfficeStepUpdates(attr, campaign.slug)
    } else {
      const trackingProperties = {
        officeState: position.state,
        officeMunicipality: 'Unavailable',
        officeName: position.name,
        officeElectionDate: election.electionDay,
      }
      await identifyUser(user?.id, trackingProperties)
      trackEvent(EVENTS.Onboarding.OfficeStep.OfficeCompleted, {
        ...trackingProperties,
        officeManuallyInput: false,
      })
      await runPostOfficeStepUpdates(attr)
    }

    if (step) {
      router.push(`/onboarding/${campaign.slug}/${step + 1}`)
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
    | false = campaign.details?.positionId
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

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center flex-col">
        <OfficeStepForm
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
