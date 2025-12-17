'use client'
import TextField from '@shared/inputs/TextField'
import { RiSearch2Line } from 'react-icons/ri'
import { TextFieldProps } from '@mui/material'

export default function SearchInput(props: TextFieldProps): React.JSX.Element {
  return (
    <TextField
      {...props}
      slotProps={{
        input: {
          startAdornment: (
            <RiSearch2Line className="text-gray-400 mr-4" size={20} />
          ),
          ...props.slotProps?.input,
        },
      }}
    />
  )
}
