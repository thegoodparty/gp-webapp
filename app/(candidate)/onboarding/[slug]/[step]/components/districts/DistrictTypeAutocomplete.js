'use client'
import React, { useEffect, useState } from 'react'
import { Autocomplete } from '@mui/material'
import TextField from '@shared/inputs/TextField'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export default function DistrictTypeAutocomplete({
  value,
  onChange,
  state,
  electionYear,
}) {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true

    async function load() {
      if (!state || !electionYear) return
      setLoading(true)
      try {
        const { data = [] } = await clientFetch(
          apiRoutes.elections.districts.types,
          { state, electionYear },
        )
        if (active) {
          setOptions(
            data.map((d) => ({
              ...d,
              label: d.L2DistrictType.replace(/_/g, ' '),
            })),
          )
        }
      } finally {
        active && setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [state, electionYear])

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
