import { useState } from 'react'
import { MdMoreVert } from 'react-icons/md'
import { Menu, MenuItem } from '@mui/material'

export const MoreMenu = ({ onClose = (menuItem) => {}, menuItems = [] }) => {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const showMenu = Boolean(menuAnchor)

  const handleMenuAnchorClick = ({ currentTarget }) => {
    setMenuAnchor(currentTarget)
  }

  const handleMenuClose = (menuItem) => {
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
          onClose: handleMenuClose,
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
