'use client'
import React, { useEffect, useState } from 'react'
import { Autocomplete } from '@mui/material'
import TextField from '@shared/inputs/TextField'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface DistrictType {
  id?: string
  L2DistrictType: string
  label?: string
}

interface DistrictTypeAutocompleteProps {
  value: DistrictType | null
  onChange: (value: DistrictType | null) => void
  state: string
  electionYear: number
  excludeInvalidOverride?: boolean
}

async function fetchDistrictTypes(
  state: string,
  electionYear: number,
  excludeInvalidOverride: boolean,
): Promise<DistrictType[]> {
  try {
    const { data = [] } = await clientFetch<DistrictType[]>(
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
}: DistrictTypeAutocompleteProps) {
  const [options, setOptions] = useState<DistrictType[]>([])
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
      getOptionLabel={(o) => o.label || o.L2DistrictType}
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