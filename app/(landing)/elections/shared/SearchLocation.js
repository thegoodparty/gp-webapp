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
import {
  fireGTMButtonClickEvent
} from '@shared/buttons/fireGTMButtonClickEvent';

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

const nameCompare = ({name: aName}, {name: bName} ) => aName.localeCompare(bName)

export default function SearchLocation({ withHeader = false, initialState }) {
  const [state, setState] = useState({
    state: initialState || '',
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
    let url = `/elections/${slugify(state.state, true)}`;
    if (state.county !== '') {
      url += `/${slugify(state.county, true)}`;
    }
    if (state.county !== '' && state.municipality !== '') {
      url += `/${slugify(state.municipality, true)}`;
    }
    router.push(url);
  };

  return (
    <div>
      {withHeader && (
        <H2 className="mb-6">
          Find elections at the State, County or City level
        </H2>
      )}
      <div className="grid grid-cols-12 gap-4 location-selects">
        <div className="col-span-12 md:col-span-3">
          <Select
            id="election-select-state"
            native
            value={state.state}
            fullWidth
            label=" state "
            variant="outlined"
            onChange={(e) => {
              fireGTMButtonClickEvent(e.currentTarget)
              return onChangeState(e.target.value);
            }}
            sx={{ backgroundColor: 'white' }}
            startAdornment={
              // Placing the icon as startAdornment
              <InputAdornment position="start">
                <Image
                  src="/images/elections/state-select.svg"
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
            id="election-select-county"
            native
            value={state.county}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: 'white' }}
            label=" "
            disabled={state.state === '' || state.countyOptions.length === 0}
            onChange={(e) => {
              fireGTMButtonClickEvent(e.currentTarget)
              return onChangeCounty(e.target.value);
            }}
            startAdornment={
              // Placing the icon as startAdornment
              <InputAdornment position="start">
                <Image
                  src="/images/elections/county-select.svg"
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
              state.countyOptions
                .sort(nameCompare)
                .map((op) => (
                  <option value={op.name} key={op.id}>
                    {op.name}
                  </option>
                ))}
          </Select>
        </div>

        <div className="col-span-12 md:col-span-3">
          <Select
            id="election-select-city"
            native
            value={state.municipality}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: 'white' }}
            label=" "
            disabled={state.county === '' || state.munOptions.length === 0}
            onChange={(e) => {
              fireGTMButtonClickEvent(e.currentTarget)
              return onChangeMun(e.target.value);
            }}
            startAdornment={
              // Placing the icon as startAdornment
              <InputAdornment position="start">
                <Image
                  src="/images/elections/mun-select.svg"
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
              state.munOptions
                .sort(nameCompare)
                .map((op) => (
                  <option value={op.name} key={op.id}>
                    {op.name}
                  </option>
                ))}
          </Select>
        </div>
        <div className="col-span-12 md:col-span-3">
          <div id="location-search-go">
            <SuccessButton
              id="election-click-go"
              style={{ padding: '12px 20px', marginTop: '4px' }}
              disabled={state.state === ''}
              onClick={handleSubmit}
            >
              Go
            </SuccessButton>
          </div>
        </div>
      </div>
    </div>
  );
}
