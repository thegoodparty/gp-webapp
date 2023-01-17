'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import { useState } from 'react';
import OnboardingWrapper from '../shared/OnboardingWrapper';
import TextField from '@shared/inputs/TextField';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import EmailInput from '@shared/inputs/EmailInput';
import PhoneInput from '@shared/inputs/PhoneInput';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';

const inputFields = [
  { key: 'firstName', label: 'First Name', required: true, type: 'text' },
  { key: 'lastName', label: 'Last Name', required: true, type: 'text' },
  { key: 'email', label: 'Email', required: true, type: 'email' },
  { key: 'phone', label: 'Phone', required: true, type: 'phone' },
  { key: 'zip', label: 'Zip Code', required: true, type: 'text' },
  {
    key: 'citizen',
    label: 'Are you a citizen of the United States?',
    required: true,
    type: 'radio',
  },
  {
    key: 'appointed',
    label: 'Have you ever been appointed to or elected for office before?',
    required: true,
    type: 'radio',
  },
  {
    key: 'registered',
    label: 'Have you ever been a registered member of a political party?',
    required: true,
    type: 'radio',
  },
];

const initialState = {};
inputFields.map((field) => {
  initialState[field.key] = '';
});

export default function OnboardingPage(props) {
  const [state, setState] = useState(initialState);
  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const canSubmit = () => {
    return (
      state.name !== '' &&
      state.office !== '' &&
      state.issues !== '' &&
      state.prompt !== ''
    );
  };

  return (
    <OnboardingWrapper {...props}>
      <PortalPanel color="#ea580c" smWhite>
        <h3 className="font-black text-xl italic mb-8">
          Now, let's start putting your campaign together.
        </h3>
        <h4 className="font-black italic mb-6">Basic Information</h4>
        {inputFields.map((field) => (
          <div className="mb-6" key={field.key}>
            {field.type === 'text' && (
              <TextField
                label={field.label}
                name={field.label}
                fullWidth
                value={state[field.key]}
                onChange={(e) => onChangeField(field.key, e.target.value)}
                multiline={!!field.rows}
                rows={field.rows || 1}
                required={field.required}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
            {field.type === 'email' && (
              <EmailInput
                value={state[field.key]}
                onChange={(e) => onChangeField(field.key, e.target.value)}
                shrink
              />
            )}
            {field.type === 'phone' && (
              <PhoneInput
                value={state[field.key]}
                onChange={(e) => onChangeField(field.key, e.target.value)}
                hideIcon
                shrink
              />
            )}

            {field.type === 'radio' && (
              <div className="mb-4">
                <div className="text-zinc-500 mb-2">{field.label}</div>
                <RadioGroup
                  row
                  name={field.label}
                  label={field.label}
                  value={state[field.key] || null}
                  onChange={(e) => onChangeField(field.key, e.target.value)}
                >
                  <FormControlLabel value="no" control={<Radio />} label="No" />

                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                </RadioGroup>
              </div>
            )}
          </div>
        ))}
      </PortalPanel>
    </OnboardingWrapper>
  );
}
