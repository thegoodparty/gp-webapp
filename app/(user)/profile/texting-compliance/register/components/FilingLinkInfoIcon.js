import { useState } from 'react'
import { MdInfoOutline } from 'react-icons/md'
import Popover from '@mui/material/Popover'

export const FilingLinkInfoIcon = () => {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const handleIconClick = (e) => {
    setAnchorEl(e.currentTarget)
    setOpen(true)
  }
  const closePopover = () => {
    setAnchorEl(null)
    setOpen(false)
  }
  return (
    <>
      <MdInfoOutline
        onClick={handleIconClick}
        key="info"
        className="text-lg text-info h-6 w-6 cursor-pointer"
      />
      <Popover
        {...{
          open,
          onClose: closePopover,
          anchorEl,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        }}
      >
        <p className="text-sm text-gray-600 max-w-36 p-4">
          Find this on your local government election website
        </p>
      </Popover>
    </>
  )
}
