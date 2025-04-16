'use client'

import { InputAdornment, Select } from '@mui/material'
import H2 from '@shared/typography/H2'
import gpApi from 'gpApi'
import gpFetch from 'gpApi/gpFetch'
import { slugify } from 'helpers/articleHelper'
import { states } from 'helpers/statesHelper'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { fireGTMButtonClickEvent } from '@shared/buttons/fireGTMButtonClickEvent'
import Button from '@shared/buttons/Button'
import fetchPlace from './fetchPlace'

const fetchState = async (state) => {
  const api = gpApi.elections.places
  const payload = {
    slug: state.toLowerCase(),
    includeChildren: true,
  }

  return await gpFetch(api, payload, 3600)
}

const fetchCounty = async (state, county) => {
  const api = gpApi.elections.places
  const payload = {
    slug: `${state.toLowerCase()}/${slugify(county, true)}`,
    includeChildren: true,
  }

  return await gpFetch(api, payload, 3600)
}

const nameCompare = ({ name: aName }, { name: bName }) =>
  aName.localeCompare(bName)

export default function SearchLocation({ withHeader = false, initialState }) {
  const [state, setState] = useState({
    state: initialState || '',
    county: '',
    municipality: '',
    countyOptions: [],
    munOptions: [],
  })

  const router = useRouter()

  const onChangeState = async (stateName) => {
    console.log('stateName', stateName)
    const place = await fetchPlace({ slug: stateName, includeRaces: false })
    setState({
      ...state,
      state: stateName,
      countyOptions: place.children,
    })
  }

  const onChangeCounty = async (countyName) => {
    console.log('onChangeCounty', countyName)
    const place = await fetchPlace({
      slug: `${state.state.toLowerCase()}/${slugify(countyName, true)}`,
      includeRaces: false,
    })
    setState({
      ...state,
      county: countyName,
      munOptions: place.children,
    })
  }

  const onChangeMun = (munName) => {
    setState({ ...state, municipality: munName })
  }

  const handleSubmit = () => {
    if (state.state === '') {
      return
    }
    let url = `/elections/${slugify(state.state, true)}`
    if (state.county !== '') {
      url += `/${slugify(state.county, true)}`
    }
    if (state.county !== '' && state.municipality !== '') {
      url += `/${slugify(state.municipality, true)}`
    }
    router.push(url)
  }

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
              return onChangeState(e.target.value)
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
              return onChangeCounty(e.target.value)
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
              state.countyOptions.sort(nameCompare).map((op) => (
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
              return onChangeMun(e.target.value)
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
              state.munOptions.sort(nameCompare).map((op) => (
                <option value={op.name} key={op.id}>
                  {op.name}
                </option>
              ))}
          </Select>
        </div>
        <div className="col-span-12 md:col-span-3">
          <div id="location-search-go">
            <Button
              id="election-click-go"
              size="large"
              color="success"
              disabled={state.state === ''}
              onClick={handleSubmit}
            >
              Go
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
