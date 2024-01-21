'use client';

import { InputAdornment, Select } from '@mui/material';
import SuccessButton from '@shared/buttons/SuccessButton';
import H2 from '@shared/typography/H2';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { slugify } from 'helpers/articleHelper';
import { states } from 'helpers/statesHelper';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const fetchState = async (state) => {
  const api = gpApi.race.byState;
  const payload = {
    state,
  };

  return await gpFetch(api, payload, 3600);
};

const fetchCounty = async (state, county) => {
  const api = gpApi.race.byCounty;
  const payload = {
    state,
    county,
  };

  return await gpFetch(api, payload, 3600);
};

export default function SearchLocation() {
  const [state, setState] = useState({
    state: '',
    county: '',
    municipality: '',
    countyOptions: [],
    munOptions: [],
  });

  const router = useRouter();

  const onChangeState = async (stateName) => {
    const { counties } = await fetchState(stateName);
    setState({
      ...state,
      state: stateName,
      countyOptions: counties,
    });
  };

  const onChangeCounty = async (countyName) => {
    const { municipalities } = await fetchCounty(state.state, countyName);
    setState({
      ...state,
      county: countyName,
      munOptions: municipalities,
    });
  };

  const onChangeMun = (munName) => {
    setState({ ...state, municipality: munName });
  };

  const handleSubmit = () => {
    if (state.state === '') {
      return;
    }
    let url = `/how-to-run/${slugify(state.state, true)}`;
    if (state.county !== '') {
      url += `/${slugify(state.county, true)}`;
    }
    if (state.county !== '' && state.municipality !== '') {
      url += `/${slugify(state.municipality, true)}`;
    }
    router.push(url);
  };

  return (
    <div className="mb-10">
      <H2 className="mb-6">
        Find elections at the State, County or City level
      </H2>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3">
          <Select
            native
            value={state.state}
            fullWidth
            variant="outlined"
            onChange={(e) => onChangeState(e.target.value)}
            startAdornment={
              // Placing the icon as startAdornment
              <InputAdornment position="start">
                <Image
                  src="/images/how-to-run/state-select.svg"
                  alt="state"
                  width={28}
                  height={28}
                />
              </InputAdornment>
            }
          >
            <option value="">Select State</option>

            {states.map((op) => (
              <option value={op.abbreviation} key={op.abbreviation}>
                {op.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="col-span-12 md:col-span-3">
          <Select
            native
            value={state.county}
            fullWidth
            variant="outlined"
            disabled={state.state === '' || state.countyOptions.length === 0}
            onChange={(e) => onChangeCounty(e.target.value)}
            startAdornment={
              // Placing the icon as startAdornment
              <InputAdornment position="start">
                <Image
                  src="/images/how-to-run/county-select.svg"
                  alt="state"
                  width={28}
                  height={28}
                  className={`${
                    state.state === '' || state.countyOptions.length === 0
                      ? 'opacity-50'
                      : ''
                  }`}
                />
              </InputAdornment>
            }
          >
            <option value="">All Counties</option>

            {state.countyOptions &&
              state.countyOptions.map((op) => (
                <option value={op.name} key={op.id}>
                  {op.name}
                </option>
              ))}
          </Select>
        </div>

        <div className="col-span-12 md:col-span-3">
          <Select
            native
            value={state.municipality}
            fullWidth
            variant="outlined"
            disabled={state.county === '' || state.munOptions.length === 0}
            onChange={(e) => onChangeMun(e.target.value)}
            startAdornment={
              // Placing the icon as startAdornment
              <InputAdornment position="start">
                <Image
                  src="/images/how-to-run/mun-select.svg"
                  alt="state"
                  width={28}
                  height={28}
                  className={`${
                    state.county === '' || state.munOptions.length === 0
                      ? 'opacity-50'
                      : ''
                  }`}
                />
              </InputAdornment>
            }
          >
            <option value="">All Municipalities</option>

            {state.munOptions &&
              state.munOptions.map((op) => (
                <option value={op.name} key={op.id}>
                  {op.name}
                </option>
              ))}
          </Select>
        </div>
        <div className="col-span-12 md:col-span-3">
          <div onClick={handleSubmit}>
            <SuccessButton
              style={{ padding: '12px 20px', marginTop: '4px' }}
              disabled={state.state === ''}
            >
              Go
            </SuccessButton>
          </div>
        </div>
      </div>
    </div>
  );
}
