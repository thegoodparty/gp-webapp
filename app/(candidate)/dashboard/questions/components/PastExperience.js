'use client';
import { TextField } from '@mui/material';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import MaxWidth from '@shared/layouts/MaxWidth';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import { useState } from 'react';

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
export default function PastExperience({
  value,
  onChangeCallback,
  saveCallback,
  campaign,
  campaignKey,
}) {
  const handleSave = () => {
    if (!canSave()) return;
    const updated = {
      ...campaign,
      details: {
        ...campaign.details,
        [campaignKey]: value,
      },
    };
    saveCallback(updated);
  };

  const canSave = () => {
    return value !== '';
  };
  return (
    <div className="max-w-xl m-auto">
      <H1 className="mb-10">
        Tell us about your past experiences and why you want to run for office
      </H1>
      <Body1 className="my-8 text-center">
        Tell potential voters about your prior experience. Any work or
        experiences that are relevant to the role you plan to run for will
        increase your odds of gaining their support.
      </Body1>
      <div className="max-w-md m-auto">
        <TextField
          required
          label="Your past experiences"
          fullWidth
          multiline
          rows={6}
          InputLabelProps={{
            shrink: true,
          }}
          value={value}
          onChange={(e) => {
            onChangeCallback(campaignKey, e.target.value);
          }}
        />
        <div className="flex justify-center mt-10" onClick={handleSave}>
          <PrimaryButton className="mt-3" disabled={!canSave()}>
            Next
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
