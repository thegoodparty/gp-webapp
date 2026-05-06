'use client'

import { Button, Card, CardContent } from '@styleguide'
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Compass,
  Target,
  UsersRound,
  Wand2,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  createCampaignWithOffice,
  onboardingStep,
  updateCampaign,
} from 'app/onboarding/shared/ajaxActions'

const ONBOARDING_STEP_COMPLETE = 'onboarding-complete'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useUser } from '@shared/hooks/useUser'
import { clientRequest } from 'gpApi/typed-request'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { setCookie } from 'helpers/cookieHelper'
import { ORG_SLUG_COOKIE } from '@shared/organizations/constants'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { identifyUser } from '@shared/utils/analytics'
import { reportErrorToSentry } from '@shared/sentry'
import { numberFormatter } from 'helpers/numberHelper'
import type { Campaign } from 'helpers/types'
import { ONBOARDING_STEPS, firstOnboardingStepId } from './onboardingConfig'
import { getVisibleOnboardingSteps } from './onboardingHelpers'
import { OfficeSelectionStep } from './OfficeSelectionStep'
import { ManualOfficeEntryStep } from './ManualOfficeEntryStep'
import { PathToVictoryStep } from './PathToVictoryStep'
import { PledgeStep } from './PledgeStep'
import {
  VoterDemographicsStep,
  onboardingDistrictStatsQueryOptions,
} from './VoterDemographicsStep'
import { localNewsQueryOptions } from './LocalNewsSourcesSection'
import { RadioCardGroup, type RadioCardOption } from './RadioCardGroup'
import type {
  BallotStatus,
  ManualOfficeForm,
  OnboardingStepConfig,
  OnboardingAnswers,
  OnboardingStepId,
  PartyAffiliation,
  SelectedOffice,
} from './onboardingTypes'

type OnboardingUpdateAttribute = {
  key: string
  value: string | number | boolean | OnboardingAnswers | null | undefined
}

const ballotStatusOptions: ReadonlyArray<RadioCardOption<BallotStatus>> = [
  {
    value: 'on-ballot',
    title: "I'm officially on the ballot",
    description: 'Filing accepted by your local elections office.',
  },
  {
    value: 'qualified-not-filed',
    title: "I've qualified but haven't filed",
    description: 'You meet residency/age/petition requirements.',
  },
  {
    value: 'considering',
    title: "I'm seriously considering running",
    description: "We'll help you understand what it takes.",
  },
  {
    value: 'testing',
    title: "I'm just testing out the product",
    description: 'Poke around with sample data — no commitment required.',
  },
]

const partyAffiliationOptions: ReadonlyArray<
  RadioCardOption<PartyAffiliation>
> = [
  {
    value: 'nonpartisan',
    title: 'Nonpartisan Race',
    description:
      'The race itself is officially nonpartisan (most local seats).',
  },
  {
    value: 'independent-or-non-major',
    title: 'Independent / Non-major party',
    description: 'Running independent of both major parties.',
  },
  {
    value: 'democrat',
    title: 'Democrat',
    description: 'Running as a Democrat.',
  },
  {
    value: 'republican',
    title: 'Republican',
    description: 'Running as a Republican.',
  },
]

const isMajorPartyAffiliation = (
  value: PartyAffiliation | undefined,
): boolean => value === 'democrat' || value === 'republican'

const partyAffiliationToCampaignParty: Record<PartyAffiliation, string> = {
  nonpartisan: 'nonpartisan',
  'independent-or-non-major': 'independent',
  democrat: 'democrat',
  republican: 'republican',
}

const ballotStatusToCandidateStage: Record<
  BallotStatus,
  'FILED' | 'QUALIFIED' | 'CONSIDERING' | 'TESTING'
> = {
  'on-ballot': 'FILED',
  'qualified-not-filed': 'QUALIFIED',
  considering: 'CONSIDERING',
  testing: 'TESTING',
}

const PLEDGE_VERSION = 1

interface PartyAffiliationStepProps {
  value: PartyAffiliation | undefined
  onChange: (value: PartyAffiliation) => void
}

const PartyAffiliationStep = ({
  value,
  onChange,
}: PartyAffiliationStepProps): React.JSX.Element => {
  const [dismissedFor, setDismissedFor] = useState<PartyAffiliation | null>(
    null,
  )
  const showBlocker = isMajorPartyAffiliation(value) && dismissedFor !== value

  return (
    <div className="space-y-4">
      {showBlocker ? (
        <div
          role="alert"
          className="relative flex items-start gap-4 rounded-lg border border-red-200 bg-red-50 p-5 pr-12 text-left"
        >
          <div className="flex-1 space-y-2">
            <p className="text-sm leading-6 font-semibold text-red-700">
              Sorry, GoodParty.org is only for non-partisan and independent
              candidates.
            </p>
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setDismissedFor(value ?? null)}
            className="absolute top-3 right-3 rounded-md p-1 text-slate-400 transition-colors hover:bg-red-100 hover:text-slate-600"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
      <RadioCardGroup
        name="party-affiliation"
        value={value}
        onChange={(next) => {
          setDismissedFor(null)
          onChange(next)
        }}
        options={partyAffiliationOptions}
      />
    </div>
  )
}

const welcomeCards = [
  {
    title: 'Know how many votes you need to win',
    description:
      "We use real voter data and historical local turnout to project the number of votes you'll need to win.",
    Icon: Target,
  },
  {
    title: 'Learn what issues matter to your voters',
    description:
      'We analyze your local voter data to surface and rank their top issues and concerns.',
    Icon: UsersRound,
  },
  {
    title: 'Get a powerful outreach plan & materials',
    description:
      'We create personalized stump speeches, door-knocking scripts, fundraising emails, social posts, all drafted from your profile and platform.',
    Icon: Wand2,
  },
  {
    title: 'Plan with a budget and calendar of tasks',
    description:
      'We provide you with a minimum resources budget and an interactive weekly plan of tasks & actions that give you the best chances of winning.',
    Icon: CalendarCheck,
  },
]

interface WhyWeAskProps {
  text?: string
  title?: string
  children?: React.ReactNode
}

const WhyWeAsk = ({
  text,
  title = 'Why we ask',
  children,
}: WhyWeAskProps): React.JSX.Element => (
  <aside className="rounded-xl border border-slate-200 p-5">
    <div className="mb-3 flex items-center gap-2">
      <Compass className="size-4 text-slate-400" aria-hidden="true" />
      <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
        {title}
      </span>
    </div>
    <p className="text-sm leading-6 text-slate-700">{children ?? text}</p>
  </aside>
)

interface StepProgressProps {
  currentStep: number
  numberOfSteps: number
}

const StepProgress = ({
  currentStep,
  numberOfSteps,
}: StepProgressProps): React.JSX.Element => (
  <div
    className="space-y-3"
    role="progressbar"
    aria-label="Onboarding progress"
    aria-valuemin={1}
    aria-valuemax={numberOfSteps}
    aria-valuenow={currentStep}
  >
    <div className="flex justify-end text-sm font-medium text-slate-500">
      Step {currentStep} of {numberOfSteps}
    </div>
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${numberOfSteps}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: numberOfSteps }, (_, index) => (
        <div
          key={index}
          className={
            index < currentStep
              ? 'h-1.5 rounded-full bg-blue-600'
              : 'h-1.5 rounded-full bg-slate-100'
          }
        />
      ))}
    </div>
  </div>
)

interface StepBodyProps {
  activeStep: OnboardingStepConfig
  answers: OnboardingAnswers
  updateAnswers: (answers: Partial<OnboardingAnswers>) => void
  onCantFindOffice: () => void
  liveCampaign: Campaign | null
  onP2vLoadingChange: (loading: boolean) => void
  onP2vMetricsResolved: NonNullable<
    React.ComponentProps<typeof PathToVictoryStep>['onMetricsResolved']
  >
  p2vOfficeName: string | null
}

const StepBody = ({
  activeStep,
  answers,
  updateAnswers,
  onCantFindOffice,
  liveCampaign,
  onP2vLoadingChange,
  onP2vMetricsResolved,
  p2vOfficeName,
}: StepBodyProps): React.JSX.Element => {
  if (activeStep.id === 'welcome') {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {welcomeCards.map(({ title, description, Icon }) => (
            <Card
              key={title}
              className="rounded-xl border-slate-200 text-left shadow-none"
            >
              <CardContent className="space-y-4 p-6">
                <span className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="space-y-2">
                  <h2 className="text-base leading-6 font-semibold text-slate-950">
                    {title}
                  </h2>
                  <p className="text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500">
          Ready? Hit{' '}
          <span className="font-semibold text-slate-950">Continue</span> to get
          started.
        </p>
      </div>
    )
  }

  if (activeStep.id === 'ballot-status') {
    return (
      <RadioCardGroup
        name="ballot-status"
        value={answers.ballotStatus}
        onChange={(value) => updateAnswers({ ballotStatus: value })}
        options={ballotStatusOptions}
      />
    )
  }

  if (activeStep.id === 'party-affiliation') {
    return (
      <PartyAffiliationStep
        value={answers.partyAffiliation}
        onChange={(value) => updateAnswers({ partyAffiliation: value })}
      />
    )
  }

  if (activeStep.id === 'office-selection') {
    return (
      <OfficeSelectionStep
        zip={answers.officeZip}
        selected={answers.structuredOffice}
        onZipChange={(zip) => updateAnswers({ officeZip: zip })}
        onSelect={(office) =>
          updateAnswers({
            structuredOffice: office,
            officePath: office ? 'structured' : undefined,
            manualOffice: office ? false : undefined,
            unmatchedOffice: office ? false : undefined,
          })
        }
        onCantFindOffice={onCantFindOffice}
      />
    )
  }

  if (activeStep.id === 'manual-office-entry') {
    return (
      <ManualOfficeEntryStep
        value={answers.manualOfficeForm}
        onChange={(form) => updateAnswers({ manualOfficeForm: form })}
      />
    )
  }

  if (activeStep.id === 'path-to-victory') {
    return (
      <PathToVictoryStep
        campaign={liveCampaign}
        officeName={p2vOfficeName}
        onLoadingChange={onP2vLoadingChange}
        onMetricsResolved={onP2vMetricsResolved}
      />
    )
  }

  if (activeStep.id === 'voter-demographics') {
    return (
      <VoterDemographicsStep
        ballotReadyPositionId={answers.structuredOffice?.positionId}
        city={answers.structuredOffice?.city}
        state={answers.structuredOffice?.state}
        office={answers.structuredOffice?.positionName}
      />
    )
  }

  if (activeStep.id === 'pledge') {
    return <PledgeStep />
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm leading-6 text-slate-700">{activeStep.summary}</p>
    </div>
  )
}

export default function OnboardingFlow({
  campaign: initialCampaign = null,
}: {
  campaign?: Campaign | null
} = {}): React.JSX.Element {
  const router = useRouter()
  const [contextCampaign] = useCampaign()
  const campaign = contextCampaign ?? initialCampaign
  const [user] = useUser()
  const validStepIds = new Set<OnboardingStepId>(
    ONBOARDING_STEPS.map((s) => s.id),
  )
  const initialStoredStep = (
    initialCampaign?.data as { currentStep?: string } | undefined
  )?.currentStep
  const initialStoredAnswers = (
    initialCampaign?.data as { onboarding?: OnboardingAnswers } | undefined
  )?.onboarding
  const [answers, setAnswers] = useState<OnboardingAnswers>(
    initialStoredAnswers && typeof initialStoredAnswers === 'object'
      ? initialStoredAnswers
      : {},
  )
  const [activeStepId, setActiveStepId] = useState<OnboardingStepId>(
    initialStoredStep && validStepIds.has(initialStoredStep as OnboardingStepId)
      ? (initialStoredStep as OnboardingStepId)
      : firstOnboardingStepId,
  )
  const [isSavingOffice, setIsSavingOffice] = useState(false)
  const isAdvancingRef = useRef(false)
  const [liveCampaign, setLiveCampaign] = useState<Campaign | null>(
    initialCampaign,
  )
  const [isP2vLoading, setIsP2vLoading] = useState(true)
  const queryClient = useQueryClient()

  const visibleSteps = getVisibleOnboardingSteps(ONBOARDING_STEPS, answers)
  const activeIndex = Math.max(
    0,
    visibleSteps.findIndex((step) => step.id === activeStepId),
  )
  const activeStep = visibleSteps[activeIndex] ?? visibleSteps[0]
  const previousStep = activeIndex > 0 ? visibleSteps[activeIndex - 1] : null
  const nextStep = visibleSteps[activeIndex + 1] ?? null
  const activeStepNumber = activeIndex + 1
  const isActiveStepValid = activeStep.isValid?.({ answers }) ?? true
  const isP2vBlocking = activeStep.id === 'path-to-victory' && isP2vLoading
  const p2vOfficeName =
    answers.structuredOffice?.positionName ||
    liveCampaign?.positionName ||
    liveCampaign?.organization?.customPositionName ||
    liveCampaign?.office ||
    null
  const canContinue = isActiveStepValid && !isSavingOffice && !isP2vBlocking

  const handleP2vLoadingChange = useCallback((loading: boolean) => {
    setIsP2vLoading(loading)
  }, [])

  const handleP2vMetricsResolved = useCallback<
    NonNullable<
      React.ComponentProps<typeof PathToVictoryStep>['onMetricsResolved']
    >
  >(
    (result) => {
      const campaignId = liveCampaign?.id ?? campaign?.id
      if (result.status === 'success') {
        trackEvent(EVENTS.Onboarding.PathToVictoryUpdated, {
          campaignId,
          projectedTurnout: result.projectedTurnout,
          winNumber: result.winNumber,
          voterContactGoal: liveCampaign?.raceTargetMetrics?.voterContactGoal,
          totalRegisteredVoters: result.totalRegisteredVoters,
          source: 'ballot_ready',
          modelVersion: 1,
        })
        if (user?.id) {
          void identifyUser(user.id, { hasWinNumber: true })
        }
      } else {
        trackEvent(EVENTS.Onboarding.PathToVictoryErrored, {
          campaignId,
          reason: result.reason,
        })
      }
    },
    [liveCampaign, campaign, user?.id],
  )

  useEffect(() => {
    if (activeStepId !== 'path-to-victory') return
    let cancelled = false
    setIsP2vLoading(true)
    void (async () => {
      try {
        const res = await clientRequest('GET /v1/campaigns/mine', {})
        if (!cancelled && res.data) {
          setLiveCampaign(res.data)
        }
      } catch (error) {
        if (!cancelled) {
          reportErrorToSentry(error as Error, {
            context: 'onboarding.fetchLiveCampaign',
            activeStepId,
          })
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activeStepId])

  useEffect(() => {
    if (activeStepId !== 'path-to-victory') return
    const ballotReadyPositionId = answers.structuredOffice?.positionId
    const city = answers.structuredOffice?.city
    const state = answers.structuredOffice?.state
    const office = answers.structuredOffice?.positionName
    if (ballotReadyPositionId) {
      void queryClient.prefetchQuery(
        onboardingDistrictStatsQueryOptions({ ballotReadyPositionId }),
      )
    }
    if (state && office) {
      void queryClient.prefetchQuery(
        localNewsQueryOptions({ city, state, office }),
      )
    }
  }, [
    activeStepId,
    answers.structuredOffice?.positionId,
    answers.structuredOffice?.city,
    answers.structuredOffice?.state,
    answers.structuredOffice?.positionName,
    queryClient,
  ])

  const updateAnswers = (answerPatch: Partial<OnboardingAnswers>) => {
    setAnswers((currentAnswers) => ({ ...currentAnswers, ...answerPatch }))
  }

  const goBack = () => {
    if (previousStep) {
      setActiveStepId(previousStep.id)
    }
  }

  const buildEarlyAnswerAttrs = (): OnboardingUpdateAttribute[] => {
    const attrs: OnboardingUpdateAttribute[] = []
    if (answers.partyAffiliation) {
      attrs.push({
        key: 'details.party',
        value: partyAffiliationToCampaignParty[answers.partyAffiliation],
      })
    }
    if (answers.ballotStatus) {
      attrs.push({ key: 'details.ballotStatus', value: answers.ballotStatus })
    }
    return attrs
  }

  const persistStructuredOffice = async (
    office: SelectedOffice,
  ): Promise<boolean> => {
    const attr = [
      { key: 'details.electionId', value: office.electionId },
      { key: 'details.raceId', value: office.raceId },
      { key: 'details.state', value: office.state },
      { key: 'details.city', value: office.city },
      { key: 'details.district', value: null },
      { key: 'details.officeTermLength', value: office.officeTermLength },
      { key: 'details.ballotLevel', value: office.level },
      {
        key: 'details.primaryElectionDate',
        value: office.primaryElectionDate,
      },
      { key: 'details.electionDate', value: office.electionDay },
      { key: 'details.partisanType', value: office.partisanType },
      { key: 'details.primaryElectionId', value: office.primaryElectionId },
      { key: 'details.hasPrimary', value: office.hasPrimary },
      { key: 'details.filingPeriodsStart', value: office.filingPeriodsStart },
      { key: 'details.filingPeriodsEnd', value: office.filingPeriodsEnd },
    ]

    const trackingProperties = {
      officeState: office.state,
      officeMunicipality: office.city ?? 'Unavailable',
      officeName: office.positionName,
      officeElectionDate: office.electionDay,
    }

    const resolvedOrgSlug = campaign ? `campaign-${campaign.id}` : undefined

    if (resolvedOrgSlug && office.positionId) {
      try {
        await clientRequest('PATCH /v1/organizations/:slug', {
          slug: resolvedOrgSlug,
          ballotReadyPositionId: office.positionId,
          customPositionName: null,
        })
      } catch (error: unknown) {
        reportErrorToSentry(error as Error, {
          context: 'onboarding.persistStructuredOffice.patchOrganization',
          campaignId: campaign?.id,
        })
        return false
      }
    }

    if (campaign) {
      const updated = await updateCampaign(attr)
      if (updated === false) return false
      await identifyUser(user?.id, {
        ...trackingProperties,
        officeType: office.level,
      })
      trackEvent(EVENTS.Onboarding.OfficeStep.OfficeCompleted, {
        ...trackingProperties,
        officeManuallyInput: false,
      })
      trackEvent(EVENTS.Onboarding.OfficeSelectionCompleted, {
        zipCode: answers.officeZip,
        officeType: office.level,
        officeName: office.positionName,
        campaignId: campaign.id,
      })
      return true
    }

    const createAttr = [
      ...attr,
      ...buildEarlyAnswerAttrs(),
      {
        key: 'data.currentStep',
        value: nextStep?.id ?? onboardingStep(undefined, 1),
      },
      { key: 'data.onboarding', value: answers },
      { key: 'ballotReadyPositionId', value: office.positionId },
    ]
    const newCampaign = await createCampaignWithOffice(createAttr)
    if (!newCampaign) return false
    setCookie(ORG_SLUG_COOKIE, `campaign-${newCampaign.id}`)
    await identifyUser(user?.id, {
      ...trackingProperties,
      officeType: office.level,
    })
    trackEvent(EVENTS.Onboarding.OfficeStep.OfficeCompleted, {
      ...trackingProperties,
      officeManuallyInput: false,
    })
    trackEvent(EVENTS.Onboarding.OfficeSelectionCompleted, {
      zipCode: answers.officeZip,
      officeType: office.level,
      officeName: office.positionName,
      campaignId: newCampaign.id,
    })
    return true
  }

  const persistManualOffice = async (
    form: ManualOfficeForm,
  ): Promise<boolean> => {
    const baseAttr = [
      { key: 'details.raceId', value: null },
      { key: 'details.electionId', value: null },
      { key: 'details.ballotOffice', value: null },
      { key: 'details.ballotLevel', value: null },
      { key: 'details.partisanType', value: null },
      { key: 'details.primaryElectionDate', value: null },
      { key: 'details.primaryElectionId', value: null },
      { key: 'details.hasPrimary', value: null },
      { key: 'details.filingPeriodsStart', value: null },
      { key: 'details.filingPeriodsEnd', value: null },
      { key: 'details.state', value: form.state },
      { key: 'details.city', value: form.city },
      { key: 'details.district', value: form.district },
      { key: 'details.officeTermLength', value: form.officeTermLength },
      { key: 'details.electionDate', value: form.electionDate },
    ]
    const customPositionName = form.office

    const trackingProperties = {
      officeState: form.state,
      officeMunicipality: form.city,
      officeName: form.office,
      officeElectionDate: form.electionDate,
    }

    if (campaign) {
      const updated = await updateCampaign(baseAttr)
      if (updated === false) return false
      try {
        await clientRequest('PATCH /v1/organizations/:slug', {
          slug: `campaign-${campaign.id}`,
          customPositionName,
        })
      } catch (error: unknown) {
        reportErrorToSentry(error as Error, {
          context: 'onboarding.persistManualOffice.patchOrganization',
          campaignId: campaign.id,
        })
        return false
      }
      await identifyUser(user?.id, {
        ...trackingProperties,
        officeType: 'manual',
      })
      trackEvent(EVENTS.Onboarding.OfficeStep.OfficeCompleted, {
        ...trackingProperties,
        officeManuallyInput: true,
      })
      trackEvent(EVENTS.Onboarding.OfficeSelectionCompleted, {
        zipCode: answers.officeZip,
        officeType: 'manual',
        officeName: form.office,
        campaignId: campaign.id,
      })
      return true
    }

    const createAttr = [
      ...baseAttr,
      ...buildEarlyAnswerAttrs(),
      {
        key: 'data.currentStep',
        value: nextStep?.id ?? onboardingStep(undefined, 1),
      },
      { key: 'data.onboarding', value: answers },
      { key: 'customPositionName', value: customPositionName },
    ]
    const newCampaign = await createCampaignWithOffice(createAttr)
    if (!newCampaign) return false
    setCookie(ORG_SLUG_COOKIE, `campaign-${newCampaign.id}`)
    await identifyUser(user?.id, {
      ...trackingProperties,
      officeType: 'manual',
    })
    trackEvent(EVENTS.Onboarding.OfficeStep.OfficeCompleted, {
      ...trackingProperties,
      officeManuallyInput: true,
    })
    trackEvent(EVENTS.Onboarding.OfficeSelectionCompleted, {
      zipCode: answers.officeZip,
      officeType: 'manual',
      officeName: form.office,
      campaignId: newCampaign.id,
    })
    return true
  }

  const persistPartyAffiliation = async (
    affiliation: PartyAffiliation,
  ): Promise<boolean> => {
    const party = partyAffiliationToCampaignParty[affiliation]
    if (campaign) {
      const updated = await updateCampaign([
        { key: 'details.party', value: party },
      ])
      if (updated === false) return false
    }
    trackEvent(EVENTS.Onboarding.PartyStep.Completed, { affiliation: party })
    trackEvent(EVENTS.Onboarding.PartySelectionCompleted, {
      party,
      campaignId: campaign?.id,
    })
    if (user?.id) {
      await identifyUser(user.id, { affiliation: party, party })
    }
    return true
  }

  const persistPledgeAndComplete = async (): Promise<boolean> => {
    trackEvent(EVENTS.Onboarding.PledgeStep.ClickSubmit)
    const updated = await updateCampaign([
      { key: 'details.pledged', value: true },
      { key: 'data.currentStep', value: ONBOARDING_STEP_COMPLETE },
      { key: 'data.onboarding', value: answers },
    ])
    if (updated === false) return false
    try {
      await clientFetch(apiRoutes.campaign.launch)
    } catch (error: unknown) {
      reportErrorToSentry(error as Error, {
        context: 'onboarding.persistPledgeAndComplete.launchCampaign',
        campaignId: campaign?.id,
      })
      return false
    }
    trackEvent(EVENTS.Onboarding.PledgeStep.Completed)
    trackEvent(EVENTS.Onboarding.PledgeCompleted, {
      pledgeVersion: PLEDGE_VERSION,
      campaignId: campaign?.id,
    })
    if (user?.id) {
      await identifyUser(user.id, {
        pledgeCompleted: true,
        onboardingCompleted: true,
      })
    }
    return true
  }

  const goNext = async () => {
    if (!canContinue || isAdvancingRef.current) return
    isAdvancingRef.current = true
    try {
      await runGoNext()
    } finally {
      isAdvancingRef.current = false
    }
  }

  const runGoNext = async () => {
    if (activeStep.id === 'welcome') {
      trackEvent(EVENTS.Onboarding.WelcomeCompleted, {
        campaignId: campaign?.id,
      })
    }
    if (activeStep.id === 'path-to-victory' && (liveCampaign || campaign)) {
      const trackedCampaign = liveCampaign ?? campaign
      trackEvent(EVENTS.Onboarding.PathToVictoryCompleted, {
        campaignId: trackedCampaign?.id,
        winNumber: trackedCampaign?.raceTargetMetrics?.winNumber ?? 0,
      })
    }
    if (
      activeStep.id === 'office-selection' &&
      answers.structuredOffice &&
      !isSavingOffice
    ) {
      setIsSavingOffice(true)
      try {
        trackEvent(EVENTS.Onboarding.OfficeStep.ClickNext)
        const ok = await persistStructuredOffice(answers.structuredOffice)
        if (!ok) return
        router.refresh()
      } finally {
        setIsSavingOffice(false)
      }
    }
    if (
      activeStep.id === 'manual-office-entry' &&
      answers.manualOfficeForm &&
      !isSavingOffice
    ) {
      setIsSavingOffice(true)
      try {
        trackEvent(EVENTS.Onboarding.OfficeStep.ClickNext)
        const ok = await persistManualOffice(answers.manualOfficeForm)
        if (!ok) return
        router.refresh()
      } finally {
        setIsSavingOffice(false)
      }
    }
    if (activeStep.id === 'ballot-status' && answers.ballotStatus) {
      if (campaign) {
        const updated = await updateCampaign([
          { key: 'details.ballotStatus', value: answers.ballotStatus },
        ])
        if (updated === false) return
      }
      const candidateStage = ballotStatusToCandidateStage[answers.ballotStatus]
      trackEvent(EVENTS.Onboarding.BallotStatusCompleted, {
        candidateStage,
        campaignId: campaign?.id,
      })
      if (user?.id) {
        await identifyUser(user.id, {
          candidateStage: candidateStage.toLowerCase(),
          hasNotYetFiled: candidateStage !== 'FILED' ? true : undefined,
        })
      }
    }
    if (activeStep.id === 'party-affiliation' && answers.partyAffiliation) {
      const ok = await persistPartyAffiliation(answers.partyAffiliation)
      if (!ok) return
    }
    if (activeStep.id === 'pledge') {
      if (!campaign) return
      const ok = await persistPledgeAndComplete()
      if (!ok) return
      router.push('/dashboard')
      return
    }
    if (nextStep) {
      if (campaign) {
        await updateCampaign([
          { key: 'data.currentStep', value: nextStep.id },
          { key: 'data.onboarding', value: answers },
        ])
      }
      setActiveStepId(nextStep.id)
    }
  }

  const handleCantFindOffice = () => {
    setAnswers((current) => ({
      ...current,
      officePath: 'manual',
      manualOffice: true,
      unmatchedOffice: true,
      structuredOffice: undefined,
    }))
    const visibleAfter = getVisibleOnboardingSteps(ONBOARDING_STEPS, {
      ...answers,
      officePath: 'manual',
    })
    const currentIndex = visibleAfter.findIndex(
      (step) => step.id === activeStepId,
    )
    const next = visibleAfter[currentIndex + 1]
    if (next) {
      setActiveStepId(next.id)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-28 text-slate-950">
      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-8 sm:py-8">
        <div>
          <StepProgress
            currentStep={activeStepNumber}
            numberOfSteps={visibleSteps.length}
          />

          <div
            className={`mt-8 grid grid-cols-1 gap-8 sm:mt-5${
              activeStep.whyWeAsk && !isP2vBlocking
                ? ' md:grid-cols-[minmax(0,1fr)_280px] md:items-start'
                : ''
            }`}
          >
            <section
              className={`space-y-8${
                activeStep.id === 'welcome' ? ' text-center' : ''
              }`}
            >
              {isP2vBlocking ? null : (
                <div className="space-y-4">
                  {activeStep.id === 'welcome' ||
                  activeStep.id === 'pledge' ? null : (
                    <p className="text-sm font-semibold text-blue-600">
                      {activeStep.eyebrow}
                    </p>
                  )}
                  <h1 className="text-4xl leading-[1.08] font-bold text-slate-950 sm:text-5xl">
                    {activeStep.title}
                  </h1>
                  <p className="text-lg leading-8 text-slate-500 sm:text-base sm:leading-7">
                    {activeStep.id === 'path-to-victory' && p2vOfficeName ? (
                      <>
                        We use historical voter data and proprietary models to
                        get the most accurate projections for{' '}
                        <span className="font-semibold text-slate-950">
                          {p2vOfficeName}
                        </span>
                        .
                      </>
                    ) : activeStep.id === 'voter-demographics' &&
                      p2vOfficeName ? (
                      <>
                        We crunch the latest voter data, along with proprietary
                        behavior models, and local news to prioritize the issues
                        voters care about for{' '}
                        <span className="font-semibold text-slate-950">
                          {p2vOfficeName}
                        </span>
                        .
                      </>
                    ) : (
                      activeStep.description
                    )}
                  </p>
                </div>
              )}

              <StepBody
                activeStep={activeStep}
                answers={answers}
                updateAnswers={updateAnswers}
                onCantFindOffice={handleCantFindOffice}
                liveCampaign={liveCampaign}
                onP2vLoadingChange={handleP2vLoadingChange}
                onP2vMetricsResolved={handleP2vMetricsResolved}
                p2vOfficeName={p2vOfficeName}
              />
            </section>

            {activeStep.whyWeAsk && !isP2vBlocking ? (
              activeStep.id === 'path-to-victory' ? (
                <WhyWeAsk title="You can do this!">
                  Most candidates think they need to convince <em>everyone</em>.
                  You don&apos;t. You need to find{' '}
                  {liveCampaign?.raceTargetMetrics?.winNumber
                    ? `${numberFormatter(
                        liveCampaign.raceTargetMetrics.winNumber,
                      )} people`
                    : 'your win number'}
                  , talk to them, and make sure they vote. We&apos;ll show you
                  exactly what that takes.
                </WhyWeAsk>
              ) : (
                <WhyWeAsk text={activeStep.whyWeAsk} />
              )
            ) : null}
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white">
        <div className="mx-auto flex h-20 w-full max-w-4xl items-center justify-between px-4 sm:px-8">
          <Button
            type="button"
            variant="ghost"
            size="large"
            icon={<ArrowLeft aria-hidden="true" />}
            onClick={goBack}
            disabled={!previousStep}
            className="px-0 text-slate-500 disabled:opacity-50"
          >
            Back
          </Button>
          <Button
            type="button"
            variant="default"
            size="large"
            icon={<ArrowRight aria-hidden="true" />}
            iconPosition="right"
            onClick={goNext}
            disabled={!canContinue}
            className="min-w-36"
          >
            {nextStep
              ? 'Continue'
              : activeStep.id === 'pledge'
              ? 'Agree & Create My Plan'
              : 'Complete'}
          </Button>
        </div>
      </div>
    </div>
  )
}
