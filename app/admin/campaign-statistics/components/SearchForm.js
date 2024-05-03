'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import RenderInputField from '@shared/inputs/RenderInputField';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const formFields = [
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

const urlWithQuery = (baseUrl, query) => {
  let url = `${baseUrl}?`;
  for (const key in query) {
    if ({}.hasOwnProperty.call(query, key)) {
      url += `${key}=${query[key]}&`;
    }
  }
  url = url.slice(0, -1);
  return url;
};

export default function SearchForm({ initialParams = {} }) {
  console.log('initialParams', initialParams);
  const router = useRouter();
  const [state, setState] = useState({
    level: initialParams.level || '',
    primaryElectionDateStart: initialParams.primaryElectionDateStart || '',
    primaryElectionDateEnd: initialParams.primaryElectionDateEnd || '',
    generalElectionDateStart: initialParams.generalElectionDateStart || '',
    generalElectionDateEnd: initialParams.generalElectionDateEnd || '',
    campaignStatus: initialParams.campaignStatus || '',
  });

  const onChangeField = (key, val) => {
    console.log('key', key, 'val', val);
    setState({
      ...state,
      [key]: val,
    });
  };

  const canSubmit = () => {
    try {
      if (
        state.primaryElectionDateStart !== '' &&
        state.primaryElectionDateEnd !== '' &&
        new Date(state.primaryElectionDateStart) <
          new Date(state.primaryElectionDateEnd)
      ) {
        return false;
      }
      if (
        state.generalElectionDateStart !== '' &&
        state.generalElectionDateEnd !== '' &&
        new Date(state.generalElectionDateStart) <
          new Date(state.generalElectionDateEnd)
      ) {
        return false;
      }
    } catch (e) {}
    // return false if all fields are empty string
    if (Object.values(state).every((val) => val === '')) {
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    // on submit add values that are not empty to the query param
    const queryParams = {};
    Object.keys(state).forEach((key) => {
      if (state[key] !== '') {
        queryParams[key] = state[key];
      }
    });

    console.log('queryParams', queryParams);
    const url = urlWithQuery('/admin/campaign-statistics', queryParams);

    router.push(url);
  };

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
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
              value={state[field.key]}
              onChangeCallback={onChangeField}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <PrimaryButton disabled={!canSubmit()} onClick={handleSubmit}>
          Search
        </PrimaryButton>
      </div>
    </form>
  );
}
