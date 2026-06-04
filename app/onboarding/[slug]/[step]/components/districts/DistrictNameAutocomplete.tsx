'use client'
import React, { useEffect, useState } from 'react'
import { Combobox } from '@styleguide'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { noop } from '@shared/utils/noop'

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
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setInputValue('')
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
    return noop
  }, [districtType, state, electionYear, excludeInvalidOverride])

  const filtered = inputValue
    ? options.filter((o) =>
        o.L2DistrictName.toLowerCase().includes(inputValue.toLowerCase()),
      )
    : options

  return (
    <Combobox
      options={filtered}
      value={value}
      onChange={onChange}
      onInputChange={setInputValue}
      getOptionLabel={(o) => o.L2DistrictName}
      getOptionKey={(o) => o.id ?? o.L2DistrictName}
      disableClientFilter
      loading={loading}
      disabled={disabled}
      placeholder="District Name"
      searchPlaceholder="Search district names..."
    />
  )
}
