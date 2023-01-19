'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import { useState } from 'react';
import OnboardingWrapper from '../shared/OnboardingWrapper';
import TextField from '@shared/inputs/TextField';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput';
import PhoneInput, { isValidPhone } from '@shared/inputs/PhoneInput';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import PositionsSelector from './PositionsSelector';
import { getUserCookie } from 'helpers/cookieHelper';
import PasswordInput, { isValidPassword } from '@shared/inputs/PasswrodInput';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import RenderInputField from './RenderInputField';

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
  { key: 'dob', label: 'Date of Birth', required: true, type: 'date' },
  {
    key: 'party',
    label: 'Political Party Affiliation (select one)',
    required: true,
    type: 'select',
    options: [
      'Independent',
      'Green Party',
      'Libertarian',
      'SAM',
      'Forward',
      'Other',
    ],
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
  { type: 'positionsSelector', key: 'positions', initialValue: [] },
];

const initialState = {
  password: '',
  passwordConf: '',
};

inputFields.map((field) => {
  if (field.initialValue) {
    initialState[field.key] = field.initialValue;
  } else {
    initialState[field.key] = '';
  }
});

export default function OnboardingPage(props) {
  const user = getUserCookie(true);
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const canSubmit = () => {
    for (let i = 0; i < inputFields.length; i++) {
      const field = inputFields[i];
      if (field.required) {
        const val = state[field.key];
        if (field.initialValue && val === initialValue) {
          return false;
        } else if (val === '') {
          return false;
        }
      }
    }
    if (user && (password !== passwordConf || !isValidPassword(password))) {
      return false;
    }
    if (!isValidEmail(state.email)) {
      return false;
    }
    if (!isValidPhone(state.phone)) {
      return false;
    }
    return true;
  };

  const checkErrors = () => {
    const newErrors = {};
    for (let i = 0; i < inputFields.length; i++) {
      const field = inputFields[i];
      if (field.required) {
        const val = state[field.key];
        if (field.initialValue && val === initialValue) {
          newErrors[field.key] = true;
        } else if (val === '') {
          newErrors[field.key] = true;
        }
      }
    }
    if (user && (password !== passwordConf || !isValidPassword(password))) {
      newErrors.password = true;
    }
    if (!isValidEmail(state.email)) {
      newErrors.email = true;
    }
    if (!isValidPhone(state.phone)) {
      newErrors.phone = true;
    }
    setErrors(newErrors);
  };

  const handleSubmit = () => {
    checkErrors();
  };

  return (
    <OnboardingWrapper {...props}>
      <PortalPanel color="#ea580c" smWhite>
        <h3 className="font-black text-xl italic mb-8">
          Now, let's start putting your campaign together.
        </h3>
        <h4 className="font-black italic mb-6">Basic Information</h4>
        {inputFields.map((field) => (
          <RenderInputField
            field={field}
            onChangeCallback={onChangeField}
            error={!!errors[field.key]}
            positions={props.positions}
            value={state[field.key]}
          />
        ))}

        {!user && (
          <div>
            <div className="font-black mt-12 mb-6">Account password</div>
            <PasswordInput
              value={state.password}
              onChangeCallback={(pwd) => onChangeField('password', pwd)}
              className="mb-10"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <PasswordInput
              label="Re-enter password"
              helperText=""
              className="mb-10"
              value={state.passwordConf}
              onChangeCallback={(pwd) => onChangeField('passwordConf', pwd)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        )}

        <BlackButtonClient
          className="w-full uppercase font-black mt-10"
          disabled={!canSubmit()}
          onClick={handleSubmit}
        >
          Create my campaign
        </BlackButtonClient>
      </PortalPanel>
    </OnboardingWrapper>
  );
}
