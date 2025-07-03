'use client'
import { FormControl, Select, MenuItem } from '@mui/material'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'newIssue', label: 'New Issue' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'inProgress', label: 'In Progress' },
  { value: 'wontDo', label: "Won't Do" },
  { value: 'completed', label: 'Completed' },
]

export default function StatusFilter({ value, onChange }) {
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
