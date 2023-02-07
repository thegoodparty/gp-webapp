'use client';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

const inputFields = [
  {
    key: 'whyRunning',
    label: 'Why are you running?',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'bestChoice',
    label: 'Why are you the best choice?',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'howDeliver',
    label: 'How are you going to deliver?',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'whatDeliver',
    label: 'What are you going to deliver?',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'voteReason',
    label: 'Vote for me, because...',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
];

const generateWhatGoals = async () => {
  const api = gpApi.campaign.onboarding.generateWhatGoals;
  return await gpFetch(api, { adminForce: true });
};

export default function WhatPage(props) {
  return (
    <OnboardingPage
      reGenerateAiCallback={generateWhatGoals}
      inputFields={inputFields}
      nextPath="/goals/more-info"
      campaignKey="whatGoals"
      header="First, how will YOU talk about your campaign? "
      subHeader="It's time to define your race, and identify how you and others are going to talk about it."
      {...props}
    />
  );
}
