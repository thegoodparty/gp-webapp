'use client'
import React, { useEffect, useState } from 'react'
import { Combobox } from '@styleguide'
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
      {
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

export default function DistrictTypeAutocomplete({
  value,
  onChange,
  state,
  electionYear,
  excludeInvalidOverride = false,
}: DistrictTypeAutocompleteProps) {
  const [options, setOptions] = useState<DistrictType[]>([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setInputValue('')
    if (!state || !electionYear) return

    let ignore = false
    setLoading(true)

    const load = async () => {
      const data = await fetchDistrictTypes(
        state,
        electionYear,
        excludeInvalidOverride,
      )
      if (!ignore) {
        setOptions(
          data.map((d) => ({
            ...d,
            label: d.L2DistrictType.replace(/_/g, ' '),
          })),
        )
        setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [state, electionYear, excludeInvalidOverride])

  const getLabel = (o: DistrictType) => o.label || o.L2DistrictType

  const filtered = inputValue
    ? options.filter((o) =>
        getLabel(o).toLowerCase().includes(inputValue.toLowerCase()),
      )
    : options

  return (
    <Combobox
      options={filtered}
      value={value}
      onChange={onChange}
      onInputChange={setInputValue}
      inputValue={inputValue}
      getOptionLabel={getLabel}
      getOptionKey={(o) => o.id ?? o.L2DistrictType}
      disableClientFilter
      loading={loading}
      placeholder="District Type"
      searchPlaceholder="Search district types..."
    />
  )
}
