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
export default function QuestionsPage(props) {
  const { generate, candidatePositions: initCandidatePositions } = props
  const [campaign, setCampaign] = useState(props.campaign)
  const [answers, setAnswers] = useState({
    occupation: '',
    funFact: '',
    pastExperience: '',
    issues: '',
    website: '',
    candidatePositions: initCandidatePositions,
  })

  const flow = flows[generate]
  let nextStep = 0
  const combinedIssuedCount =
    (answers.candidatePositions?.length || 0) +
    (campaign?.details?.customIssues?.length || 0)

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
    } else if (!campaign?.details || !campaign.details[flow[i]]) {
      break
    }
    if (i === flow.length - 1) {
      nextStep = i + 1
    }
  }

  const onChangeField = (key, value) => {
    setAnswers({
      ...answers,
      [key]: value,
    })
  }

  const handleSave = async (keys, values) => {
    const attr = keys.map((key, i) => {
      return { key: keys[0], value: values[i] }
    })
    const campaign = await updateCampaign(attr)
    setCampaign(campaign)
  }

  const handleComplete = async (type = false) => {
    const campaign = await getCampaign()
    setCampaign(campaign)
    if (type === 'issues') {
      const candidatePositions = await loadCandidatePosition(campaign.id)
      onChangeField('candidatePositions', candidatePositions)
      const campaign = await getCampaign()
      setCampaign(campaign)
    }
  }
  let nextKey
  if (nextStep < flow.length) {
    nextKey = flow[nextStep]
  } else {
    nextKey = 'done'
  }

  const updatePositionsCallback = async (freshCandidatePositions) => {
    const campaign = await getCampaign()

    onChangeField('candidatePositions', freshCandidatePositions)
    setCampaign(campaign)
  }

  return (
    <FocusedExperienceWrapper>
      {campaign && nextKey === 'occupation' && (
        <Occupation
          value={answers.occupation}
          onChangeCallback={onChangeField}
          saveCallback={handleSave}
          campaign={campaign}
          campaignKey={nextKey}
        />
      )}
      {campaign && nextKey === 'funFact' && (
        <FunFact
          value={answers.funFact}
          onChangeCallback={onChangeField}
          saveCallback={handleSave}
          campaign={campaign}
          campaignKey={nextKey}
        />
      )}
      {campaign && nextKey === 'pastExperience' && (
        <PastExperience
          value={answers.pastExperience}
          onChangeCallback={onChangeField}
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
          campaign={campaign}
          campaignKey={nextKey}
        />
      )}
      {nextKey === 'done' && <Done />}
    </FocusedExperienceWrapper>
  )
}
