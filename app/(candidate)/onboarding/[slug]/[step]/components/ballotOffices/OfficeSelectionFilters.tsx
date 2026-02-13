import { useState, ChangeEvent } from 'react'
import TextField from '@shared/inputs/TextField'
import { Select, SelectChangeEvent } from '@mui/material'

interface FilterValues {
  inputValue: string
  level: string
  yearFilter: string | null
}

interface OfficeSelectionFiltersProps {
  electionYears?: number[]
  onChange: (filters: FilterValues) => void
}

export const OfficeSelectionFilters = ({
  electionYears = [],
  onChange,
}: OfficeSelectionFiltersProps) => {
  const [inputValue, setInputValue] = useState('')
  const [level, setLevel] = useState('')
  const [yearFilter, setYearFilter] = useState<string | null>(null)

  return (
    <div className="bg-white pt-4 pb-2">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6 pt-1">
          <TextField
            label="Search"
            value={inputValue}
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setInputValue(e.target.value)
              onChange({
                inputValue: e.target.value,
                level,
                yearFilter,
              })
            }}
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <Select
            className="py-[2px]"
            native
            required
            variant="outlined"
            fullWidth
            value={level}
            onChange={(e: SelectChangeEvent<string>) => {
              setLevel(e.target.value)
              onChange({
                inputValue,
                level: e.target.value,
                yearFilter,
              })
            }}
          >
            <option value="">Election Level</option>
            {['local', 'county', 'state', 'federal'].map((value) => (
              <option value={value} key={value}>
                {value} office
              </option>
            ))}
          </Select>
        </div>
        <div className="col-span-12 lg:col-span-2">
          <Select
            className="py-[2px]"
            native
            required
            variant="outlined"
            fullWidth
            value={yearFilter || ''}
            onChange={(e: SelectChangeEvent<string>) => {
              const newValue = e.target.value || null
              setYearFilter(newValue)
              onChange({
                inputValue,
                level,
                yearFilter: newValue,
              })
            }}
          >
            <option value="">Year</option>
            {electionYears.map((value) => (
              <option value={value} key={value}>
                {value}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}
