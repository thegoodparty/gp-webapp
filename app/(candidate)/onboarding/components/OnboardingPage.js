'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import { useState } from 'react';
import OnboardingWrapper from '../shared/OnboardingWrapper';
import TextField from '@shared/inputs/TextField';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import EmailInput from '@shared/inputs/EmailInput';
import PhoneInput from '@shared/inputs/PhoneInput';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import PositionsSelector from './PositionsSelector';
import { getUserCookie } from 'helpers/cookieHelper';
import PasswordInput from '@shared/inputs/PasswrodInput';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';

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

const initialErrors = {
  password: false,
  passwordConf: false,
};
inputFields.map((field) => {
  if (field.initialValue) {
    initialState[field.key] = field.initialValue;
  } else {
    initialState[field.key] = '';
  }
  initialErrors[field.key] = false;
});

export default function OnboardingPage(props) {
  const user = getUserCookie(true);
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const canSubmit = () => {
    console.log('state', state);
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
    return true;
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
            {(field.type === 'text' || field.type === 'date') && (
              <TextField
                label={field.label}
                name={field.label}
                fullWidth
                value={state[field.key]}
                onChange={(e) => onChangeField(field.key, e.target.value)}
                multiline={!!field.rows}
                rows={field.rows || 1}
                required={field.required}
                type={field.type}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
            {field.type === 'email' && (
              <EmailInput
                value={state[field.key]}
                onChangeCallback={(e) =>
                  onChangeField(field.key, e.target.value)
                }
                shrink
              />
            )}
            {field.type === 'phone' && (
              <PhoneInput
                value={state[field.key]}
                onChangeCallback={(phone, isValid) => {
                  onChangeField(field.key, phone);
                  // setIsPhoneValid(isValid);
                }}
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
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </div>
            )}
            {field.type === 'select' && (
              <>
                <div className="text-sm text-gray-500">{field.label}</div>
                <Select
                  native
                  value={state[field.key]}
                  fullWidth
                  variant="outlined"
                  onChange={(e) => onChangeField(field.key, e.target.value)}
                  label={field.label}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  <option value="">Select</option>
                  {field.options.map((op) => (
                    <option value={op} key={op}>
                      {op}
                    </option>
                  ))}
                </Select>
              </>
            )}
            {field.type === 'positionsSelector' && (
              <PositionsSelector
                {...props}
                updateCallback={(positions) =>
                  onChangeField('positions', positions)
                }
              />
            )}
          </div>
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
              // className={styles.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        )}

        <BlackButtonClient
          className="w-full uppercase font-black mt-10"
          disabled={!canSubmit()}
        >
          Create my campaign
        </BlackButtonClient>
      </PortalPanel>
    </OnboardingWrapper>
  );
}
