'use client'
import { FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { ISSUE_STATUSES } from '../../shared/constants'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: ISSUE_STATUSES.ACCEPTED, label: 'Accepted' },
  { value: ISSUE_STATUSES.IN_PROGRESS, label: 'In Progress' },
  { value: ISSUE_STATUSES.WONT_DO, label: "Won't Do" },
  { value: ISSUE_STATUSES.COMPLETED, label: 'Completed' },
]

interface StatusFilterProps {
  value: string
  onChange: (event: SelectChangeEvent<string>) => void
}

export default function StatusFilter({
  value,
  onChange,
}: StatusFilterProps): React.JSX.Element {
  return (
    <FormControl>
      <Select value={value} onChange={onChange}>
        {STATUS_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
