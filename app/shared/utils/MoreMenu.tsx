import { useState } from 'react'
import { MdMoreVert } from 'react-icons/md'
import { Menu, MenuItem, MenuItemProps } from '@mui/material'

interface MoreMenuItem extends Omit<MenuItemProps, 'onClick'> {
  label: string
  onClick?: () => void
}

interface MoreMenuProps {
  onClose?: (menuItem?: MoreMenuItem) => void
  menuItems?: MoreMenuItem[]
}

export const MoreMenu = ({ onClose = () => {}, menuItems = [] }: MoreMenuProps): React.JSX.Element => {
  const [menuAnchor, setMenuAnchor] = useState<Element | null>(null)
  const showMenu = Boolean(menuAnchor)

  const handleMenuAnchorClick = ({ currentTarget }: React.MouseEvent<SVGElement> | React.KeyboardEvent<SVGElement>) => {
    setMenuAnchor(currentTarget)
  }

  const handleMenuClose = (menuItem?: MoreMenuItem) => {
    setMenuAnchor(null)
    onClose(menuItem)
  }

  return (
    <>
      <MdMoreVert
        role="button"
        tabIndex={0}
        onClick={handleMenuAnchorClick}
        onKeyDown={(e) =>
          (e.key === 'Enter' || e.key === ' ') && handleMenuAnchorClick(e)
        }
        className="text-2xl cursor-pointer"
      />
      <Menu
        {...{
          anchorEl: menuAnchor,
          open: showMenu,
          autoFocus: false,
          onClose: () => handleMenuClose(),
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        }}
      >
        {menuItems.map((menuItem, index) => {
          const { onClick = () => {}, label = '', ...rest } = menuItem
          return (
            <MenuItem
              key={index}
              onClick={() => {
                handleMenuClose()
                onClick()
              }}
              {...rest}
            >
              {label}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

