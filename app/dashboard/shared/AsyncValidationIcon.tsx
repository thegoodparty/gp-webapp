import {
  LoaderCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@styleguide/components/ui/icons'
import { InputHelpIcon } from 'app/dashboard/shared/InputHelpIcon'
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
    <LoaderCircleIcon className="animate-spin" size={24} />
  ) : validated === true ? (
    <CheckCircleIcon className="text-success" size={24} />
  ) : validated === false ? (
    <XCircleIcon className="text-error" size={24} />
  ) : (
    <InputHelpIcon showOnFocus message={message} onOpen={onTooltipOpen} />
  )
