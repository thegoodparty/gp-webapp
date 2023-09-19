'use client';

import { Checkbox, FormControlLabel } from '@mui/material';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { isValidEmail } from '@shared/inputs/EmailInput';
import { isValidPhone } from '@shared/inputs/PhoneInput';
import RenderInputField from 'app/(candidate)/onboarding/shared/RenderInputField';
import { useState } from 'react';

const fields = [
  {
    key: 'firstName',
    label: 'First Name',
    required: true,
    type: 'text',
  },
  {
    key: 'lastName',
    label: 'Last Name',
    required: true,
    type: 'text',
  },
  {
    key: 'phone',
    label: 'Phone',
    required: true,
    type: 'phone',
  },
  {
    key: 'email',
    label: 'Email',
    required: true,
    type: 'email',
  },
];
export default function HeroForm() {
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    forOffice: false,
  });

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const canSubmit = () => {
    return (
      state.firstName !== '' &&
      state.lastName !== '' &&
      isValidEmail(state.email) &&
      isValidPhone(state.phone)
    );
  };

  const handleSubmit = () => {
    if (!canSubmit()) {
      return;
    }
  };
  return (
    <div className="pt-5 pb-9 px-7 bg-lime-500 rounded-3xl relative z-20">
      <h2 className="font-outfit text-5xl font-medium mb-10">
        Join our community
      </h2>
      <form>
        <div className="grid grid-cols-12 gap-4">
          {fields.map((field) => (
            <div key={field.key} className="col-span-12 md:col-span-6">
              <RenderInputField
                field={field}
                value={state[field.key]}
                onChangeCallback={onChangeField}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <Checkbox
            value={state.forOffice}
            onChange={(e) => {
              onChangeField('forOffice', e.target.checked);
            }}
          />
          <span>I&apos;m interested in running for office</span>
        </div>
        <div className="mt-8" onClick={handleSubmit}>
          <PrimaryButton fullWidth disabled={!canSubmit()}>
            Start taking action
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
