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

const flows = {
  all: [
    'occupation',
    'funFact',
    'pastExperience',
    'issues',
    'runningAgainst',
    'website',
  ],
  why: ['occupation', 'funFact', 'pastExperience', 'issues'],
  bio: ['funFact', 'pastExperience', 'issues'],
  slogan: ['funFact', 'occupation', 'pastExperience', 'issues'],
  politics: ['issues'],
  website: ['website'],
  positioning: [
    'occupation',
    'funFact',
    'pastExperience',
    'issues',
    'runningAgainst',
  ],
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
  for (let i = 0; i < flow.length; i++) {
    const combinedIssuedCount =
      (candidatePositions?.length || 0) + (campaign?.customIssues?.length || 0);
    if (flow[i] === 'issues' && combinedIssuedCount < 3) {
      nextStep = i;
      break;
    } else if (flow[i] === 'issues' && combinedIssuedCount >= 3) {
      nextStep = i + 1;
      break;
    } else if (!campaign?.details || !campaign.details[flow[i]]) {
      nextStep = i;
      break;
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

  const nextKey = flow[nextStep];
  console.log('nextKey', nextKey);

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

        {/* {campaign && nextKey === 'runningAgainst' && (
          <AddIssues {...props} completeCallback={handleComplete} />
        )} */}
      </div>
    </MaxWidth>
  );
}
