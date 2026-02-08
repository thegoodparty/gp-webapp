import { InputAdornment } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { MdInfoOutline } from 'react-icons/md'
import React from 'react'

interface InputHelpIconProps {
  message: React.ReactNode
  showOnFocus?: boolean
  onOpen?: () => void
}

export const InputHelpIcon = ({ message, showOnFocus = false, onOpen }: InputHelpIconProps): React.JSX.Element => (
  <InputAdornment position="end">
    <Tooltip
      disableFocusListener={!showOnFocus}
      title={message}
      onOpen={onOpen}
    >
      <IconButton className="cursor-help" edge="end">
        <MdInfoOutline className="text-info h-6 w-6" />
      </IconButton>
    </Tooltip>
  </InputAdornment>
)
