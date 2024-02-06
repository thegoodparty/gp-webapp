'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import { useState } from 'react';

export default function FunFact({
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
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <H1 className="mb-10">What is a fun fact about yourself?</H1>
        <Body1 className="my-8 text-center">
          What&apos;s something fun or exciting about you, unrelated to
          politics, that you think people in your community would like to know?
        </Body1>
        <div className="max-w-md m-auto">
          <TextField
            required
            label="Fun fact about yourself"
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
            <PrimaryButton className="mt-3" disabled={!canSave()} type="submit">
              Next
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
}
