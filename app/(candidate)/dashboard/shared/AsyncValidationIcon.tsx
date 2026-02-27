import { CircularProgress } from '@mui/material'
import { MdCancel, MdCheckCircle } from 'react-icons/md'
import { InputHelpIcon } from 'app/(candidate)/dashboard/shared/InputHelpIcon'
import React from 'react'

interface AsyncValidationIconProps {
  message: React.ReactNode
  loading?: boolean
  validated?: boolean | null
  onTooltipOpen?: () => void
}

export const AsyncValidationIcon = ({
  message,
  loading = false,
  validated = null,
  onTooltipOpen,
}: AsyncValidationIconProps): React.JSX.Element =>
  loading ? (
    <CircularProgress size={24} />
  ) : validated === true ? (
    <MdCheckCircle className="text-success" size={24} />
  ) : validated === false ? (
    <MdCancel className="text-error" size={24} />
  ) : (
    <InputHelpIcon showOnFocus message={message} onOpen={onTooltipOpen} />
  )
