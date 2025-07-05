'use client'
import TextField from '@shared/inputs/TextField'
import { RiSearch2Line } from 'react-icons/ri'

export default function SearchInput({ value, onChange, totalCount = 0 }) {
  return (
    <TextField
      fullWidth
      placeholder={`Search ${totalCount} issues`}
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <RiSearch2Line className="text-gray-400 mr-4" size={20} />
        ),
      }}
    />
  )
}
