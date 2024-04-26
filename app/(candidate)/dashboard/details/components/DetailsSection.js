'use client';

import H3 from '@shared/typography/H3';
import Body1 from '@shared/typography/Body1';
import { validateZip } from 'app/(entrance)/login/components/LoginPage';
import RenderInputField from '@shared/inputs/RenderInputField';
import { useEffect, useState } from 'react';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { CircularProgress } from '@mui/material';

const fields = [
  {
    key: 'zip',
    label: 'Zip Code',
    required: true,
    type: 'text',
    validate: validateZip,
  },
];

export default function DetailsSection(props) {
  const initialState = {};
  fields.forEach((field) => {
    initialState[field.key] = '';
  });
  const [state, setState] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const { campaign } = props;
  useEffect(() => {
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
      await updateCampaign({ key: 'details.zip', value: state.zip });

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
    <section>
      <H3>My Details</H3>
      <Body1 className="text-gray-600 mt-2 border-b border-gray-600 pb-6 mb-12">
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
          <PrimaryButton onClick={handleSave} disabled={!canSave()}>
            Save
          </PrimaryButton>
        )}
      </div>
    </section>
  );
}
