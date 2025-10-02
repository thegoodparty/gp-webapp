'use client'
import TextField from '@shared/inputs/TextField'
import { RiSearch2Line } from 'react-icons/ri'

export default function SearchInput(props) {
  return (
    <TextField
      {...props}
      slotProps={{
        input: {
          startAdornment: (
            <RiSearch2Line className="text-gray-400 mr-4" size={20} />
          ),
          ...props.slot?.input,
        },
      }}
    />
  )
}
