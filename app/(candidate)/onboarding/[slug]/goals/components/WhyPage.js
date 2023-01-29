'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import RenderInputField from 'app/(candidate)/onboarding/components/RenderInputField';
import { useState } from 'react';
import OnboardingWrapper from '../../../shared/OnboardingWrapper';

const inputFields = [
  {
    key: 'twoMinutes',
    label: '2 minutes / 100 words',
    required: true,
    type: 'text',
    rows: 6,
  },
  {
    key: 'oneMinute',
    label: '1 minute / 50 words',
    required: true,
    type: 'text',
    rows: 4,
  },
  {
    key: 'halfMinute',
    label: '30 seconds / 50 words',
    required: true,
    type: 'text',
    rows: 4,
  },
];

const initialState = {};

inputFields.map((field) => {
  if (field.initialValue) {
    initialState[field.key] = field.initialValue;
  } else {
    initialState[field.key] = '';
  }
});

export default function WhyPage(props) {
  if (props.campaign?.whyGoals) {
    initialState.twoMinutes = props.campaign.whyGoals.why100;
  }
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});

  console.log('campaign', props.campaign);

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };
  return (
    <OnboardingWrapper {...props}>
      <PortalPanel color="#ea580c" smWhite>
        <h3 className="font-black text-xl italic mb-2">What is your WHY?</h3>
        <div className="text-sm  mb-8">
          Remember that your whole campaign will always connect back to your{' '}
          <strong>why</strong>
        </div>

        {inputFields.map((field) => (
          <RenderInputField
            field={field}
            onChangeCallback={onChangeField}
            error={!!errors[field.key]}
            positions={props.positions}
            value={state[field.key]}
          />
        ))}
      </PortalPanel>
    </OnboardingWrapper>
  );
}
