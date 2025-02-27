'use client';

import H3 from '@shared/typography/H3';
import Body1 from '@shared/typography/Body1';
import RenderInputField from '@shared/inputs/RenderInputField';
import { useEffect, useState } from 'react';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { CircularProgress } from '@mui/material';
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper';

const fields = [
  {
    key: 'funFact',
    label: '',
    placeholder:
      "EXAMPLE: In my free time, I love to play the guitar and write songs. I've even performed at a few local open mic nights! Music has been a passion of mine for as long as I can remember, and I believe that it has helped me to develop creativity, perseverance, and a willingness to take risks. Whether I'm writing a song or crafting a policy proposal, I bring the same level of enthusiasm and dedication to everything I do.",
    required: true,
    type: 'text',
    rows: 8,
  },
];

export default function FunFactSection(props) {
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

      trackEvent(EVENTS.Profile.FunFact.ClickSave);

      await updateCampaign([{ key: 'details.funFact', value: state.funFact }]);
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
      <H3>Fun Fact About Yourself</H3>
      <Body1 className="text-gray-600 mt-2  pb-6 mb-12">
        What&apos;s something fun or interesting about you- unrelated to
        politics- that you think people in your community would like to know?
        This will help humanize your campaign.
      </Body1>
      {fields.map((field) => (
        <div key={field.key}>
          <div className="">
            <RenderInputField
              field={field}
              value={state[field.key]}
              onChangeCallback={onChangeField}
            />
          </div>
        </div>
      ))}
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
