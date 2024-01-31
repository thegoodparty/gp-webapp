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
    'website',
    'opponents',
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
    'opponents',
  ],
};
export default function QuestionsPage(props) {
  const { generate, candidatePositions, positions } = props;
  const [campaign, setCampaign] = useState(props.campaign);
  const [state, setState] = useState({
    occupation: '',
    funFact: '',
    pastExperience: '',
    issues: '',
    website: '',
    opponents: '',
  });
  //   if (campaign.details) {
  //     const { occupation, funFact, pastExperience, issues, website, opponents } =
  //       campaign.details;
  //   }
  const flow = flows[generate];
  let nextStep = 0;
  for (let i = 0; i < flow.length; i++) {
    if (!campaign?.details || !campaign.details[flow[i]]) {
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

  const nextKey = flow[nextStep];

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
        {campaign && nextKey === 'issues' && <AddIssues {...props} />}
      </div>
    </MaxWidth>
  );
}
