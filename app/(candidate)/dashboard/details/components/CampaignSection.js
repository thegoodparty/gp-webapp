'use client';

import H3 from '@shared/typography/H3';
import Body1 from '@shared/typography/Body1';
import { validateZip } from 'app/(entrance)/register/components/RegisterPage';
import RenderInputField from 'app/(candidate)/onboarding/shared/RenderInputField';
import { useEffect, useState } from 'react';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { CircularProgress } from '@mui/material';

const fields = [
  {
    key: 'firstName',
    label: 'Candidate First Name',
    required: true,
    type: 'text',
  },
  {
    key: 'lastName',
    label: 'Candidate Last Name',
    required: true,
    type: 'text',
  },
  {
    key: 'campaignPhone',
    label: 'Phone',
    required: true,
    type: 'phone',
    validate: 'validPhone',
  },
  {
    key: 'zip',
    label: 'Zip Code',
    required: true,
    type: 'text',
    validate: validateZip,
  },
  {
    key: 'dob',
    label: 'Date of Birth',
    required: true,
    type: 'date',
    validate: 'over 18',
  },
  {
    key: 'citizen',
    label: 'Are you a U.S. Citizen?',
    required: true,
    type: 'radio',
    options: ['Yes', 'No'],
    validateOptions: ['yes', 'No'],
    alignLeft: true,
  },
];

export default function CampaignSection(props) {
  const initialState = {};
  fields.forEach((field) => {
    initialState[field.key] = '';
  });
  const [state, setState] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const { campaign } = props;
  useEffect(() => {
    console.log('campaign', campaign);
    if (campaign?.details) {
      const newState = {};
      fields.forEach((field) => {
        newState[field.key] = campaign.details[field.key] || '';
      });
      setState(newState);
    }
  }, [campaign]);
  const canSave = () => {
    let able = true;
    fields.forEach((field) => {
      if (field.required && state[field.key] === '') {
        able = false;
      }
    });
    return able;
  };

  const handleSave = async () => {
    if (canSave()) {
      setSaving(true);
      await updateCampaign({
        ...campaign,
        details: {
          ...campaign.details,
          ...state,
        },
      });
      setSaving(false);
    }
  };

  const onChangeField = (key, val) => {
    setState({
      ...state,
      [key]: val,
    });
  };

  return (
    <section className="border-t pt-6 border-gray-600">
      <H3>Campaign Details</H3>
      <Body1 className="text-indigo-300 mt-2  pb-6 mb-12">
        Update your details so our AI can give you even more personalized tips
        and suggestions.
      </Body1>
      <div className="grid grid-cols-12 gap-3">
        {fields.map((field) => (
          <div key={field.key} className="col-span-12 md:col-span-6">
            <div className="">
              <RenderInputField
                field={field}
                value={state[field.key]}
                onChangeCallback={onChangeField}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mb-6">
        {saving ? (
          <PrimaryButton disabled>
            <div className="px-3">
              <CircularProgress size={16} />
            </div>
          </PrimaryButton>
        ) : (
          <div onClick={handleSave}>
            <PrimaryButton disabled={!canSave()}>Save</PrimaryButton>
          </div>
        )}
      </div>
    </section>
  );
}
