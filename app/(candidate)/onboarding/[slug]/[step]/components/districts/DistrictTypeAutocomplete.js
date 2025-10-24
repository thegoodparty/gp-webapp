'use client'
import React, { useEffect, useState } from 'react'
import { Autocomplete } from '@mui/material'
import TextField from '@shared/inputs/TextField'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

async function fetchDistrictTypes(state, electionYear, excludeInvalidOverride) {
  try {
    const { data = [] } = await clientFetch(
      apiRoutes.elections.districts.types,
      { state, electionYear, ...(excludeInvalidOverride ? { excludeInvalid: false } : {}) },
    )
    return data
  } catch (e) {
    console.error(e)
    return []
  }
}

export default function DistrictTypeAutocomplete({
  value,
  onChange,
  state,
  electionYear,
  excludeInvalidOverride = false,
}) {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!state || !electionYear) return
    setLoading(true)

    async function load() {
      const data = await fetchDistrictTypes(state, electionYear, excludeInvalidOverride)
      setOptions(
        data.map((d) => ({
          ...d,
          label: d.L2DistrictType.replace(/_/g, ' '),
        })),
      )
      setLoading(false)
    }

    load()
    return () => {
    }
  }, [state, electionYear, excludeInvalidOverride])

  return (
    <Autocomplete
      fullWidth
      loading={loading}
      options={options}
      value={value}
      getOptionLabel={(o) => o.label}
      isOptionEqualToValue={(o, v) => o.id === v?.id}
      onChange={(_, v) => onChange(v)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="District Type"
          required
          variant="outlined"
          InputProps={{ ...params.InputProps, style: { borderRadius: 4 } }}
        />
      )}
    />
  )
}