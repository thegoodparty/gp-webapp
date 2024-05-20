'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import RenderInputField from '@shared/inputs/RenderInputField';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { flatStates } from 'helpers/statesHelper';

const formFields = [
  {
    key: 'state',
    label: 'State',
    type: 'select',
    options: flatStates,
  },
  {
    key: 'slug',
    label: 'Campaign Slug',
    type: 'text',
  },
  {
    key: 'level',
    label: 'Race Level',
    type: 'select',
    options: ['local', 'city', 'county', 'state', 'federal'],
  },
  {
    key: 'primaryElectionDateStart',
    label: 'Primary Election Date Start',
    type: 'date',
  },
  {
    key: 'primaryElectionDateEnd',
    label: 'Primary Election Date End',
    type: 'date',
  },
  {
    key: 'campaignStatus',
    label: 'Campaign Status',
    type: 'select',
    options: ['active', 'inactive'],
  },
  {
    key: 'generalElectionDateStart',
    label: 'General Election Date Start',
    type: 'date',
  },
  {
    key: 'generalElectionDateEnd',
    label: 'General Election Date End',
    type: 'date',
  },
];

const URLSearchParamsToObject = (params) => {
  const obj = {};
  for (const [key, value] of params) {
    obj[key] = Object.hasOwn(obj, key)
      ? Array.isArray(obj[key])
        ? [...obj[key], value]
        : [obj[key], value]
      : value;
  }
  return obj;
};

export default function SearchForm({ show = true }) {
  const router = useRouter();
  const [formState, setFormState] = useState(
    URLSearchParamsToObject(useSearchParams()),
  );

  const onChangeField = (key, val) => {
    setFormState({
      ...formState,
      [key]: val,
    });
  };

  const {
    primaryElectionDateStart,
    primaryElectionDateEnd,
    generalElectionDateStart,
    generalElectionDateEnd,
    state,
  } = formState;
  const invalidPrimaryDates =
    primaryElectionDateStart !== '' &&
    primaryElectionDateEnd !== '' &&
    new Date(primaryElectionDateStart) > new Date(primaryElectionDateEnd);
  const invalidGeneralDates =
    generalElectionDateStart !== '' &&
    generalElectionDateEnd !== '' &&
    new Date(generalElectionDateStart) > new Date(generalElectionDateEnd);
  const formValid = !(
    invalidPrimaryDates ||
    invalidGeneralDates ||
    Object.values(formState).every((val) => val === '' || val === undefined)
  );

  const handleSubmit = () => {
    const searchParams = new URLSearchParams();

    Object.keys(formState).forEach((key) => {
      if (formState[key] !== undefined && formState[key] !== '') {
        searchParams.append(key, formState[key]);
      }
    });

    router.push(`?${searchParams.toString()}`);
  };

  return (
    <form
      className={`mb-4 overflow-hidden transform transition-all ${
        show ? 'max-h-screen' : 'max-h-0'
      }`}
      noValidate
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="grid grid-cols-12 gap-4 mt-6">
        {formFields.map((field) => (
          <div
            key={field.key}
            className={`mb-3 col-span-12 md:col-span-6 lg:col-span-4 ${
              field.type === 'select' ? 'mt-0' : 'mt-5'
            }`}
          >
            <RenderInputField
              field={field}
              value={formState[field.key]}
              onChangeCallback={onChangeField}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <PrimaryButton disabled={!formValid} onClick={handleSubmit}>
          Search
        </PrimaryButton>
      </div>
    </form>
  );
}
