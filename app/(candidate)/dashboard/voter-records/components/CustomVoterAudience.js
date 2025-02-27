import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { dateUsHelper } from 'helpers/dateHelper';
import {
  buildTrackingAttrs,
  trackEvent,
  EVENTS,
} from 'helpers/fullStoryHelper';

import { useState } from 'react';
import CustomVoterAudienceFilters from './CustomVoterAudienceFilters';

/*
 if prevStepValues.purpose is selected preSelect these filters
 GOTV = 25% - 75%, + First Time Voters, Independent, Default All Ages + Genders
Persuasion = 50% - 100%, + First Time Voters, Independent, Default All Ages + Genders
Voter ID = 0 - 100%, Independent, Default All Ages + Genders
*/
const purposeToFilters = {
  GOTV: {
    audience_likelyVoters: true,
    audience_unreliableVoters: true,
    audience_firstTimeVoters: true,
    party_independent: true,
    age_18_25: true,
    age_25_35: true,
    age_35_50: true,
  },
  Persuasion: {
    audience_likelyVoters: true,
    audience_superVoters: true,
    audience_firstTimeVoters: true,
    party_independent: true,
    age_18_25: true,
    age_25_35: true,
    age_35_50: true,
  },
  'Voter ID': {
    audience_superVoters: true,
    audience_likelyVoters: true,
    audience_unreliableVoters: true,
    audience_unlikelyVoters: true,
    audience_firstTimeVoters: true,
    party_independent: true,
    age_18_25: true,
    age_25_35: true,
    age_35_50: true,
  },
};

export default function CustomVoterAudience({
  campaign,
  backCallback,
  customCreatedCallback,
  prevStepValues,
}) {
  // set initial state to all false
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChangeAudience = (newState) => {
    setState(newState);
  };

  const { office, otherOffice } = campaign?.details;
  const resolvedOffice = office === 'Other' ? otherOffice : office;

  const canSave = () => {
    // return true if at least one option is selected
    return !loading && Object.values(state).some((v) => v);
  };
  const handleSubmit = async () => {
    trackEvent(EVENTS.VoterData.CustomFile.ClickCreate);

    setLoading(true);

    const selectedAudience = Object.keys(state).filter((key) => state[key]);
    const voterFiles = campaign.data?.customVoterFiles || [];
    const newFile = {
      filters: selectedAudience,
      channel: prevStepValues.channel,
      name: `${prevStepValues.channel} ${
        prevStepValues.purpose !== '' ? ` - ${prevStepValues.purpose}` : ''
      } - ${dateUsHelper(new Date())}`,
      createdAt: new Date().toDateString(),
    };
    if (prevStepValues.purpose) {
      newFile.purpose = prevStepValues.purpose;
    }

    voterFiles.push(newFile);
    await updateCampaign([
      {
        key: 'data.customVoterFiles',
        value: voterFiles,
      },
    ]);
    trackEvent('Custom Voter file created', { newFile });
    await customCreatedCallback();
    setState({});
    setLoading(false);
  };

  const trackingAttrs = buildTrackingAttrs('Create Custom Voter File Button');

  return (
    <div className="w-[90vw] max-w-5xl p-2 md:p-8">
      <div className=" text-center mb-8">
        <H1 className="mb-2">Select Your Filters</H1>
        <Body2>
          Make your selections to get custom election data for:{' '}
          <span className=" font-bold">{resolvedOffice}</span>.<br />
          You must make a minimum of one selection.
        </Body2>
      </div>
      <CustomVoterAudienceFilters
        prevStepValues={prevStepValues}
        onChangeCallback={handleChangeAudience}
      />

      <div className="flex justify-between mt-12">
        <SecondaryButton onClick={backCallback}>Back</SecondaryButton>
        <PrimaryButton
          disabled={!canSave()}
          onClick={handleSubmit}
          {...trackingAttrs}
        >
          Create Voter File
        </PrimaryButton>
      </div>
    </div>
  );
}
