'use client'

import { Select } from '@mui/material'
import { ChangeEvent, memo, useEffect, useState } from 'react'
import Checkbox from '@shared/inputs/Checkbox'
import TextField from '@shared/inputs/TextField'
import { debounce } from 'helpers/debounceHelper'
import { states } from 'helpers/statesHelper'
import { Campaign } from 'helpers/types'

interface SelectOption {
  key: string
  label: string
}

const partyOptions: SelectOption[] = [
  { key: 'independent', label: 'Independent' },
  { key: 'libertarian', label: 'Libertarian' },
  { key: 'forward', label: 'Forward Party' },
  { key: 'green', label: 'Green Party' },
  { key: 'nonpartisan', label: 'Nonpartisan' },
]

const levelOptions: SelectOption[] = [
  { key: 'LOCAL', label: 'Local' },
  { key: 'CITY', label: 'City' },
  { key: 'COUNTY', label: 'County' },
  { key: 'STATE', label: 'State' },
  { key: 'FEDERAL', label: 'Federal' },
]

interface MapFilters {
  party?: string
  state?: string
  level?: string
  results?: boolean
  office?: string
  name?: string
}

interface FiltersProps {
  filters: MapFilters
  onChangeFilters: (key: keyof MapFilters, value: string | boolean) => void
  campaigns: Campaign[]
}

export default memo(function Filters({
  filters,
  onChangeFilters,
  campaigns,
}: FiltersProps): React.JSX.Element {
  const [officeOptions, setOfficeOptions] = useState<string[]>([])
  const [name, setName] = useState(filters.name || '')

  useEffect(() => {
    if (!campaigns || campaigns.length === 0) {
      return
    }
    const allOffices = campaigns
      .map((campaign) => campaign.normalizedOffice)
      .filter((office): office is string => Boolean(office))
    const offices = [...new Set(allOffices)] // dedupe
    setOfficeOptions(offices)
  }, [campaigns])

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value)
    debounce(onChangeFilters, 500, 'name', e.target.value)
  }

  return (
    <div className="md:w-[400px] lg:w-[500px] bg-white">
      <div className="p-4">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <Select
              native
              fullWidth
              value={filters.state}
              variant="outlined"
              onChange={(e) => onChangeFilters('state', e.target.value)}
            >
              <option value="">All States</option>
              {states.map((op) => (
                <option value={op.abbreviation} key={op.abbreviation}>
                  {op.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="col-span-6">
            <Select
              native
              fullWidth
              value={filters.party}
              variant="outlined"
              onChange={(e) => onChangeFilters('party', e.target.value)}
            >
              <option value="">All Parties</option>
              {partyOptions.map((op) => (
                <option value={op.key} key={op.key}>
                  {op.label}
                </option>
              ))}
            </Select>
          </div>
          <div className=" col-span-6">
            <Select
              native
              fullWidth
              value={filters.level}
              variant="outlined"
              onChange={(e) => onChangeFilters('level', e.target.value)}
            >
              <option value="">All Levels</option>
              {levelOptions.map((op) => (
                <option value={op.key} key={op.key}>
                  {op.label}
                </option>
              ))}
            </Select>
          </div>
          <div className=" col-span-6">
            <Select
              native
              fullWidth
              value={filters.office}
              variant="outlined"
              onChange={(e) => onChangeFilters('office', e.target.value)}
            >
              <option value="">All Offices</option>
              {officeOptions.map((op) => (
                <option value={op} key={op}>
                  {op}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex mt-4 items-center justify-center">
          <Checkbox
            label="Show Winners Only"
            checked={filters.results}
            onChange={(e) => onChangeFilters('results', e.target.checked)}
          />
        </div>
      </div>
      <div className="bg-indigo-100 p-4 pb-2">
        <TextField
          label="Search for a candidate"
          fullWidth
          value={name}
          onChange={handleNameChange}
          className="bg-white"
        />
      </div>
    </div>
  )
})
