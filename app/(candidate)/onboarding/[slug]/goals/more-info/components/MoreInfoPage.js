'use client';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';

const inputFields = [
  {
    key: 'electionDate',
    label: 'Date of Election',
    required: true,
    type: 'date',
  },
  {
    key: 'candidacyFiled',
    label: 'Have you filed statement of candidacy?',
    required: true,
    type: 'radio',
    option: ['Yes', 'No'],
  },
  {
    key: 'committee',
    label: 'If yes, please provide the name of candidate/campaign committee',
    type: 'text',
  },
  {
    key: 'moneyRaised',
    label: 'Money Raised to Date',
    type: 'text',
    required: true,
  },
  {
    key: 'opponent',
    label: 'Who are you running against?',
    type: 'text',
  },
];

export default function WhatPage(props) {
  const nextPathFunc = (state) => {
    if (state.opponent === '') {
      return '/strategy/who-are-you';
    } else {
      return '/goals/opponent';
    }
  };

  return (
    <OnboardingPage
      inputFields={inputFields}
      nextPathFunc={nextPathFunc}
      campaignKey="moreInfo"
      header="Please provide us a little more info"
      {...props}
    />
  );
}
