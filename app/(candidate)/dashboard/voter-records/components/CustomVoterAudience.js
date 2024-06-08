import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import Checkbox from '@shared/inputs/Checkbox';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import Overline from '@shared/typography/Overline';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { dateUsHelper } from 'helpers/dateHelper';
import { trackEvent } from 'helpers/fullStoryHelper';

import { useState } from 'react';

const fields = [
  {
    label: 'AUDIENCE',
    options: [
      { key: 'audience_superVoters', label: 'Super Voters (75% +)' },
      { key: 'audience_likelyVoters', label: 'Likely Voters (50%-75%)' },
      {
        key: 'audience_unreliableVoters',
        label: 'Unreliable Voters (25%-50%)',
      },
      { key: 'audience_unlikelyVoters', label: 'Unlikely Voters (0%-25%)' },
      { key: 'audience_firstTimeVoters', label: 'First Time Voters' },
    ],
  },
  {
    label: 'POLITICAL PARTY',
    options: [
      { key: 'party_independent', label: 'Independent / Non-Partisan' },
      { key: 'party_democrat', label: 'Democrat' },
      { key: 'party_republican', label: 'Republican' },
    ],
  },
  {
    label: 'AGE',
    options: [
      { key: 'age_18-25', label: '18-25' },
      { key: 'age_25-35', label: '25-35' },
      { key: 'age_35-50', label: '35-50' },
      { key: 'age_50+', label: '50+' },
    ],
  },
  {
    label: 'GENDER',
    options: [
      { key: 'gender_male', label: 'Male' },
      { key: 'gender_female', label: 'Female' },
      { key: 'gender_unknown', label: 'Unknown' },
    ],
  },
];

export default function CustomVoterAudience({
  campaign,
  backCallback,
  customCreatedCallback,
  prevStepValues,
}) {
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChangeAudience = (option, e) => {
    const val = e.target.checked;
    setState({
      ...state,
      [option]: val,
    });
  };

  const { office, otherOffice } = campaign?.details;
  const resolvedOffice = office === 'Other' ? otherOffice : office;

  const canSave = () => {
    // return true if at least one option is selected
    return !loading && Object.values(state).some((v) => v);
  };
  const handleSubmit = async () => {
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
    console.log('voterFiles', voterFiles);
    await updateCampaign([
      {
        key: 'data.customVoterFiles',
        value: voterFiles,
      },
    ]);
    trackEvent('Custom Voter file created', { newFile });
    customCreatedCallback();
    setState({});
    setLoading(false);
  };

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
      <div className="mt-8 grid grid-cols-12 gap-4">
        {fields.map((field) => (
          <div
            className="col-span-12 md:col-span-6 lg:col-span-3 mt-2"
            key={field.label}
          >
            <Overline>{field.label}</Overline>
            {field.options.map((option) => (
              <div key={option.key} className="flex items-center mt-3">
                <Checkbox
                  onChange={(e) => {
                    handleChangeAudience(option.key, e);
                  }}
                  checked={state[option.key]}
                  color="secondary"
                />
                <Body2>{option.label}</Body2>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-12">
        <SecondaryButton onClick={backCallback}>Back</SecondaryButton>
        <PrimaryButton disabled={!canSave()} onClick={handleSubmit}>
          Create Voter File
        </PrimaryButton>
      </div>
    </div>
  );
}
