'use client'
import { ButtonGroup } from '@mui/material'
import Button from '@shared/buttons/Button'
import { FaListUl } from 'react-icons/fa'
import { TbLayoutGrid } from 'react-icons/tb'
import { VIEW_MODES } from '../../shared/constants'

export default function ViewModeToggle({ value, onChange }) {
  return (
    <div className="flex bg-neutral-light p-1 rounded-md">
      <ButtonGroup variant="outlined" size="small">
        <Button
          onClick={() => onChange(VIEW_MODES.LIST)}
          color={value === VIEW_MODES.LIST ? 'white' : 'neutral'}
          className="mr-2 flex items-center"
        >
          <FaListUl />
          <span className="ml-2">List</span>
        </Button>
        <Button
          onClick={() => onChange(VIEW_MODES.BOARD)}
          color={value === VIEW_MODES.BOARD ? 'white' : 'neutral'}
          className="flex items-center"
        >
          <TbLayoutGrid />
          <span className="ml-2">Board</span>
        </Button>
      </ButtonGroup>
    </div>
  )
}
