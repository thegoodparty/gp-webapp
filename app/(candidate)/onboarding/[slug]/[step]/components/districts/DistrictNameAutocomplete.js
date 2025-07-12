'use client'
import React, { useEffect, useState } from 'react'
import { Autocomplete } from '@mui/material'
import TextField from '@shared/inputs/TextField'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

async function fetchDistrictNames(districtType, state, electionYear) {
  try {
    const { data = [] } = await clientFetch(
      apiRoutes.elections.districts.names,
      { L2DistrictType: districtType, state, electionYear },
    )
    return data
  } catch (e) {
    console.error(e)
    return []
  }
}

export default function DistrictNameAutocomplete({
  value,
  onChange,
  districtType,
  state,
  electionYear,
  disabled = false,
}) {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    if (!districtType) {
      setOptions([])
      return
    }

    setLoading(true)

    async function load() {
      const data = await fetchDistrictNames(districtType, state, electionYear)
      setOptions(data)
      setLoading(false)
    }

    load()
    return () => {
    }
  }, [districtType, state, electionYear])

  return (
    <Autocomplete
      fullWidth
      loading={loading}
      options={options}
      value={value}
      getOptionLabel={(o) => o.L2DistrictName}
      isOptionEqualToValue={(o, v) => o.id === v?.id}
      onChange={(_, v) => onChange(v)}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label="District Name"
          required
          variant="outlined"
          InputProps={{ ...params.InputProps, style: { borderRadius: 4 } }}
        />
      )}
    />
  )
}