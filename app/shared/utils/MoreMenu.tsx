import { useState } from 'react'
import { noop } from './noop'
import { EllipsisVerticalIcon } from '@styleguide/components/ui/icons'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@styleguide/components/ui/dropdown-menu'

interface MoreMenuItem {
  label: string
  onClick?: () => void
}

interface MoreMenuProps {
  onClose?: (menuItem?: MoreMenuItem) => void
  menuItems?: MoreMenuItem[]
}

export const MoreMenu = ({
  onClose = noop,
  menuItems = [],
}: MoreMenuProps): React.JSX.Element => {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      onClose()
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="More options"
          className="cursor-pointer"
        >
          <EllipsisVerticalIcon className="size-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {menuItems.map((menuItem, index) => {
          const { onClick = noop, label } = menuItem
          return (
            <DropdownMenuItem
              key={index}
              onClick={() => {
                handleOpenChange(false)
                onClick()
              }}
            >
              {label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
