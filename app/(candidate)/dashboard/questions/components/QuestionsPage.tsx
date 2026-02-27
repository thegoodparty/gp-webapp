'use client'
import { useState } from 'react'
import Occupation from './Occupation'
import {
  getCampaign,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions'
import FunFact from './FunFact'
import PastExperience from './PastExperience'
import AddIssues from './issues/AddIssues'
import RunningAgainstSection from 'app/(candidate)/dashboard/campaign-details/components/RunningAgainstSection'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import Website from './Website'
import Done from './Done'
import { CandidatePositionsProvider } from 'app/(candidate)/dashboard/campaign-details/components/issues/CandidatePositionsProvider'
import { loadCandidatePosition } from 'app/(candidate)/dashboard/campaign-details/components/issues/issuesUtils'
import { FocusedExperienceWrapper } from 'app/(candidate)/dashboard/shared/FocusedExperienceWrapper'
import type { Campaign, CandidatePosition, TopIssue } from 'helpers/types'

export const flows = {
  all: [
    'occupation',
    'funFact',
    'pastExperience',
    'issues',
    'runningAgainst',
    'website',
  ],
  why: ['occupation', 'funFact', 'pastExperience', 'issues'],
  aboutMe: ['funFact', 'pastExperience', 'issues'],
  slogan: ['funFact', 'occupation', 'pastExperience', 'issues'],
  policyPlatform: ['issues'],
  communicationsStrategy: [],
  messageBox: [
    'occupation',
    'funFact',
    'pastExperience',
    'issues',
    'runningAgainst',
  ],
  pathToVictory: ['occupation', 'funFact', 'pastExperience', 'issues'],
  mobilizing: ['occupation', 'funFact', 'pastExperience', 'issues'],
}
type FlowKey = keyof typeof flows

interface QuestionsPageProps {
  generate?: string
  campaign: Campaign | null
  candidatePositions?: CandidatePosition[] | false
  topIssues?: TopIssue[]
}

interface PastExperienceValue {
  responsibility?: string
  achievements?: string
  skills?: string
}

interface AnswersState {
  occupation: string
  funFact: string
  pastExperience: PastExperienceValue
  issues: string
  website: string
  candidatePositions?: CandidatePosition[] | false
}

const QuestionsPage = (props: QuestionsPageProps): React.JSX.Element => {
  const { generate, candidatePositions: initCandidatePositions } = props
  const [campaign, setCampaign] = useState(props.campaign)
  const [answers, setAnswers] = useState<AnswersState>({
    occupation: '',
    funFact: '',
    pastExperience: {},
    issues: '',
    website: '',
    candidatePositions: initCandidatePositions,
  })

  const isFlowKey = (key?: string): key is FlowKey =>
    Boolean(key && key in flows)
  const flowKey = isFlowKey(generate) ? generate : 'all'
  const flow = flows[flowKey]
  let nextStep = 0
  const combinedIssuedCount =
    (Array.isArray(answers.candidatePositions)
      ? answers.candidatePositions.length
      : 0) + (campaign?.details?.customIssues?.length || 0)

  for (let i = 0; i < flow.length; i++) {
    nextStep = i
    if (flow[i] === 'issues') {
      if (combinedIssuedCount < 3) {
        break
      }
    } else if (flow[i] === 'runningAgainst') {
      if (!campaign?.details?.runningAgainst) {
        break
      }
    } else {
      const details = campaign?.details
      const stepKey = flow[i]
      const isStepComplete =
        stepKey === 'occupation'
          ? Boolean(details?.occupation)
          : stepKey === 'funFact'
          ? Boolean(details?.funFact)
          : stepKey === 'pastExperience'
          ? Boolean(details?.pastExperience)
          : stepKey === 'website'
          ? Boolean(details?.website)
          : false
      if (!details || !stepKey || !isStepComplete) {
        break
      }
    }
    if (i === flow.length - 1) {
      nextStep = i + 1
    }
  }

  const onChangeField = (key: string, value: string) => {
    setAnswers({
      ...answers,
      [key]: value,
    })
  }

  const onChangePositions = (value: CandidatePosition[] | false) => {
    setAnswers({
      ...answers,
      candidatePositions: value,
    })
  }

  type UpdateValue = string | number | boolean | object | null | undefined
  const handleSave = async (keys: string[], values: UpdateValue[]) => {
    const attr = keys.map((_key, i) => {
      return { key: keys[0]!, value: values[i]! }
    })
    const campaign = await updateCampaign(attr)
    if (campaign) {
      setCampaign(campaign)
    }
  }

  const handleComplete = async (type: string | false = false) => {
    const updatedCampaign = await getCampaign()
    if (updatedCampaign) {
      setCampaign(updatedCampaign)
    }
    if (type === 'issues' && updatedCampaign) {
      const candidatePositions = await loadCandidatePosition(updatedCampaign.id)
      onChangePositions(candidatePositions)
      const refreshedCampaign = await getCampaign()
      if (refreshedCampaign) {
        setCampaign(refreshedCampaign)
      }
    }
  }
  let nextKey
  if (nextStep < flow.length) {
    nextKey = flow[nextStep]
  } else {
    nextKey = 'done'
  }

  const updatePositionsCallback = async (
    freshCandidatePositions: CandidatePosition[] | false,
  ) => {
    const updatedCampaign = await getCampaign()

    onChangePositions(freshCandidatePositions)
    if (updatedCampaign) {
      setCampaign(updatedCampaign)
    }
  }

  return (
    <FocusedExperienceWrapper>
      {campaign && nextKey === 'occupation' && (
        <Occupation
          value={answers.occupation}
          onChangeCallback={onChangeField}
          saveCallback={handleSave}
          campaignKey={nextKey}
        />
      )}
      {campaign && nextKey === 'funFact' && (
        <FunFact
          value={answers.funFact}
          onChangeCallback={onChangeField}
          saveCallback={handleSave}
          campaignKey={nextKey}
        />
      )}
      {campaign && nextKey === 'pastExperience' && (
        <PastExperience
          value={answers.pastExperience}
          saveCallback={handleSave}
          campaign={campaign}
          campaignKey={nextKey}
        />
      )}
      {campaign && nextKey === 'issues' && (
        <CandidatePositionsProvider candidatePositions={initCandidatePositions}>
          <AddIssues
            {...props}
            campaign={campaign}
            completeCallback={handleComplete}
            updatePositionsCallback={updatePositionsCallback}
            candidatePositions={answers.candidatePositions}
          />
        </CandidatePositionsProvider>
      )}

      {campaign && nextKey === 'runningAgainst' && (
        <div className="max-w-xl m-auto">
          <RunningAgainstSection
            campaign={campaign}
            nextCallback={handleComplete}
            header={
              <>
                <H1 className="mb-10 text-center">
                  Who are you running against
                </H1>
                <Body1 className="my-8 text-center">
                  List the names or describe who you will be running against.
                  We&apos;ll use this information to generate a messaging
                  strategy. If you don&apos;t know, Google it.
                </Body1>
              </>
            }
          />
        </div>
      )}
      {campaign && nextKey === 'website' && (
        <Website
          value={answers.website}
          onChangeCallback={onChangeField}
          saveCallback={handleSave}
          campaignKey={nextKey}
        />
      )}
      {nextKey === 'done' && <Done />}
    </FocusedExperienceWrapper>
  )
}

export default QuestionsPage
