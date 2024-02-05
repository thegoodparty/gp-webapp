'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import { useState } from 'react';
import Occupation from './Occupation';
import {
  updateCampaign,
  getCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import FunFact from './FunFact';
import PastExperience from './PastExperience';
import AddIssues from './issues/AddIssues';
import RunningAgainstSection from '../../details/components/RunningAgainstSection';
import H1 from '@shared/typography/H1';
import Body1 from '@shared/typography/Body1';
import Website from './Website';
import Done from './Done';

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
};
export default function QuestionsPage(props) {
  const { generate, candidatePositions } = props;
  const [campaign, setCampaign] = useState(props.campaign);
  const [state, setState] = useState({
    occupation: '',
    funFact: '',
    pastExperience: '',
    issues: '',
    website: '',
    // runningAgainst: '',
  });
  //   if (campaign.details) {
  //     const { occupation, funFact, pastExperience, issues, website, runningAgainst } =
  //       campaign.details;
  //   }
  const flow = flows[generate];
  let nextStep = 0;
  const combinedIssuedCount =
    (candidatePositions?.length || 0) + (campaign?.customIssues?.length || 0);

  for (let i = 0; i < flow.length; i++) {
    nextStep = i;
    if (flow[i] === 'issues') {
      if (combinedIssuedCount < 3) {
        break;
      }
    } else if (flow[i] === 'runningAgainst') {
      if (!campaign?.goals?.runningAgainst) {
        break;
      }
    } else if (!campaign?.details || !campaign.details[flow[i]]) {
      break;
    }
    if (i === flow.length - 1) {
      nextStep = i + 1;
    }
  }

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const handleSave = async (updated) => {
    await updateCampaign(updated);
    const res = await getCampaign();
    setCampaign(res.campaign);
  };

  const handleComplete = async () => {
    const res = await getCampaign();
    setCampaign(res.campaign);
  };
  let nextKey;
  if (nextStep < flow.length) {
    nextKey = flow[nextStep];
  } else {
    nextKey = 'done';
  }

  return (
    <MaxWidth>
      <div className="min-h-[calc(100vh-56px)] py-20 flex flex-col  items-center w-full">
        {campaign && nextKey === 'occupation' && (
          <Occupation
            value={state.occupation}
            onChangeCallback={onChangeField}
            saveCallback={handleSave}
            campaign={campaign}
            campaignKey={nextKey}
          />
        )}
        {campaign && nextKey === 'funFact' && (
          <FunFact
            value={state.funFact}
            onChangeCallback={onChangeField}
            saveCallback={handleSave}
            campaign={campaign}
            campaignKey={nextKey}
          />
        )}
        {campaign && nextKey === 'pastExperience' && (
          <PastExperience
            value={state.pastExperience}
            onChangeCallback={onChangeField}
            saveCallback={handleSave}
            campaign={campaign}
            campaignKey={nextKey}
          />
        )}
        {campaign && nextKey === 'issues' && (
          <AddIssues {...props} completeCallback={handleComplete} />
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
            value={state.website}
            onChangeCallback={onChangeField}
            saveCallback={handleSave}
            campaign={campaign}
            campaignKey={nextKey}
          />
        )}
        {nextKey === 'done' && <Done />}
      </div>
    </MaxWidth>
  );
}
