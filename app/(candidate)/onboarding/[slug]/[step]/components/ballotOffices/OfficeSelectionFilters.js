import { useState } from 'react'
import TextField from '@shared/inputs/TextField'
import { Select } from '@mui/material'

export const OfficeSelectionFilters = ({ electionYears = [], onChange }) => {
  const [inputValue, setInputValue] = useState('')
  const [level, setLevel] = useState('')
  const [yearFilter, setYearFilter] = useState(null)

  return (
    <div className="bg-white pt-4 pb-2">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6 pt-1">
          <TextField
            label="Search"
            value={inputValue}
            fullWidth
            onChange={(e) => {
              setInputValue(e.currentTarget.value)
              onChange({
                inputValue: e.currentTarget.value,
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
            onChange={(e) => {
              setLevel(e.currentTarget.value)
              onChange({
                inputValue,
                level: e.currentTarget.value,
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
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(e.currentTarget.value)
              onChange({
                inputValue,
                level,
                yearFilter: e.currentTarget.value,
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
