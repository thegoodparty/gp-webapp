import { useState, ChangeEvent } from 'react'
import TextField from '@shared/inputs/TextField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@styleguide'

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
            value={level}
            onValueChange={(value) => {
              setLevel(value)
              onChange({
                inputValue,
                level: value,
                yearFilter,
              })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Election Level" />
            </SelectTrigger>
            <SelectContent>
              {['local', 'county', 'state', 'federal'].map((value) => (
                <SelectItem value={value} key={value}>
                  {value} office
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-12 lg:col-span-2">
          <Select
            value={yearFilter || ''}
            onValueChange={(value) => {
              const newValue = value || null
              setYearFilter(newValue)
              onChange({
                inputValue,
                level,
                yearFilter: newValue,
              })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {electionYears.map((value) => (
                <SelectItem value={String(value)} key={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
