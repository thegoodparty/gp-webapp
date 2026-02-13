'use client'
import React, { useEffect, useState } from 'react'
import { Autocomplete } from '@mui/material'
import TextField from '@shared/inputs/TextField'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface DistrictName {
  id?: string
  L2DistrictName: string
}

interface DistrictNameAutocompleteProps {
  value: DistrictName | null
  onChange: (value: DistrictName | null) => void
  districtType: string | undefined
  state: string
  electionYear: number
  disabled?: boolean
  excludeInvalidOverride?: boolean
}

async function fetchDistrictNames(
  districtType: string | undefined,
  state: string,
  electionYear: number,
  excludeInvalidOverride: boolean,
): Promise<DistrictName[]> {
  try {
    const { data = [] } = await clientFetch<DistrictName[]>(
      apiRoutes.elections.districts.names,
      {
        L2DistrictType: districtType,
        state,
        electionYear,
        ...(excludeInvalidOverride ? { excludeInvalid: false } : {}),
      },
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
  excludeInvalidOverride = false,
}: DistrictNameAutocompleteProps) {
  const [options, setOptions] = useState<DistrictName[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!districtType) {
      setOptions([])
      return
    }

    setLoading(true)

    async function load() {
      const data = await fetchDistrictNames(
        districtType,
        state,
        electionYear,
        excludeInvalidOverride,
      )
      setOptions(data)
      setLoading(false)
    }

    load()
    return () => {}
  }, [districtType, state, electionYear, excludeInvalidOverride])

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
