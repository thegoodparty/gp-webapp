'use client'
import { Select, SelectChangeEvent } from '@mui/material'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { states } from 'helpers/statesHelper'
import { useState } from 'react'

const stateOptions = states

interface LevelOption {
  key: string
  label: string
}

const levelOptions: LevelOption[] = [
  { key: 'LOCAL', label: 'Local' },
  { key: 'CITY', label: 'City' },
  { key: 'COUNTY', label: 'County' },
  { key: 'STATE', label: 'State' },
  { key: 'FEDERAL', label: 'Federal' },
]

interface Filters {
  state?: string
  office?: string
  level?: string
}

interface WinnerFiltersProps {
  filters: Filters
  onChangeFilters: (filters: Filters) => void
  offices: string[]
}

export default function WinnerFilters({
  filters,
  onChangeFilters,
  offices,
}: WinnerFiltersProps): React.JSX.Element {
  const [localFilters, setLocalFlters] = useState<Filters>(filters)

  const handleLocalChange = (key: string, val: string) => {
    setLocalFlters((current) => ({
      ...current,
      [key]: val,
    }))
  }

  const handleSubmitChanges = () => {
    onChangeFilters(localFilters)
  }

  return (
    <div className="grid grid-cols-12 gap-4  mb-12 lg:mb-24">
      <div className=" col-span-12 lg:col-span-10">
        <div className="grid grid-cols-12 gap-4">
          <div className=" col-span-12 lg:col-span-4">
            <Select
              native
              fullWidth
              variant="outlined"
              value={localFilters?.state || ''}
              onChange={(e: SelectChangeEvent) =>
                handleLocalChange('state', e.target.value)
              }
              style={{ paddingTop: '4px' }}
            >
              <option value="">All States</option>
              {stateOptions.map((op) => (
                <option value={op.abbreviation} key={op.abbreviation}>
                  {op.name}
                </option>
              ))}
            </Select>
          </div>
          <div className=" col-span-12 lg:col-span-4">
            <Select
              native
              fullWidth
              variant="outlined"
              value={localFilters?.office || ''}
              onChange={(e: SelectChangeEvent) =>
                handleLocalChange('office', e.target.value)
              }
              style={{ paddingTop: '4px' }}
            >
              <option value="">All Offices</option>
              {offices.map((op) => (
                <option value={op} key={op}>
                  {op}
                </option>
              ))}
            </Select>
          </div>
          <div className=" col-span-12 lg:col-span-4">
            <Select
              native
              fullWidth
              variant="outlined"
              value={localFilters?.level || ''}
              onChange={(e: SelectChangeEvent) =>
                handleLocalChange('level', e.target.value)
              }
              style={{ paddingTop: '4px' }}
            >
              <option value="">All Levels</option>
              {levelOptions.map((op) => (
                <option value={op.key} key={op.key}>
                  {op.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className=" col-span-12 lg:col-span-2">
        <PrimaryButton
          fullWidth
          className="lg:mt-1"
          onClick={handleSubmitChanges}
        >
          <div className="py-1 ">Apply Filters</div>
        </PrimaryButton>
      </div>
    </div>
  )
}
