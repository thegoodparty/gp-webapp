import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@styleguide/components/ui/tooltip'
import { IconButton } from '@styleguide/components/ui/icon-button'
import { InfoIcon } from '@styleguide/components/ui/icons'
import React from 'react'

interface InputHelpIconProps {
  message: React.ReactNode
  showOnFocus?: boolean
  onOpen?: () => void
}

export const InputHelpIcon = ({
  message,
  showOnFocus = false,
  onOpen,
}: InputHelpIconProps): React.JSX.Element => (
  <div className="flex items-center">
    <Tooltip onOpenChange={(open) => open && onOpen?.()}>
      <TooltipTrigger asChild>
        <IconButton
          variant="ghost"
          size="small"
          className="cursor-help"
          tabIndex={showOnFocus ? 0 : -1}
          type="button"
        >
          <InfoIcon className="text-info h-6 w-6" />
        </IconButton>
      </TooltipTrigger>
      <TooltipContent>{message}</TooltipContent>
    </Tooltip>
  </div>
)
