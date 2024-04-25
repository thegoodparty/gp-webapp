'use client';

import H3 from '@shared/typography/H3';
import RenderInputField from '@shared/inputs/RenderInputField';
import { useEffect, useState } from 'react';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { CircularProgress } from '@mui/material';

const fields = [
  {
    key: 'campaignCommittee',
    label: 'Name of Campaign Committee',
    placeholder: 'Campaign Committee',
    type: 'text',
  },
  {
    key: 'occupation',
    label: 'Occupation',
    required: true,
    type: 'text',
  },

  {
    key: 'party',
    label: 'Political Party Affiliation (select one)',
    required: true,
    type: 'select',
    options: [
      'Independent',
      'Green Party',
      'Libertarian Party',
      'Forward Party',
      'Other',
    ],
    invalidOptions: ['Democratic Party', 'Republican Party'],
  },

  {
    key: 'website',
    label: 'Campaign website',
    type: 'text',
    validate: 'url',
    helperText: 'Please provide a full url starting with http',
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
      let keys = [];
      let values = [];
      fields.forEach((field) => {
        keys.push(`details.${field.key}`);
        values.push(state[field.key]);
      });
      await updateCampaign(keys, values);
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
      <H3 className="pb-6">Campaign Details</H3>
      <div className="grid grid-cols-12 gap-3">
        {fields.map((field) => (
          <div key={field.key} className="col-span-12 md:col-span-6">
            <div className={`${field.type === 'select' ? '' : 'pt-5'}`}>
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
