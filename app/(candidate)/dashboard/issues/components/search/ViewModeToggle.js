'use client'
import { ButtonGroup } from '@mui/material'
import Button from '@shared/buttons/Button'
import { FaListUl } from 'react-icons/fa'
import { TbLayoutGrid } from 'react-icons/tb'

export default function ViewModeToggle({ value, onChange }) {
  return (
    <div className="flex bg-neutral-light p-1 rounded-md">
      <ButtonGroup variant="outlined" size="small">
        <Button
          onClick={() => onChange('list')}
          color={value === 'list' ? 'white' : 'neutral'}
          className="mr-2 flex items-center"
        >
          <FaListUl />
          <span className="ml-2">List</span>
        </Button>
        <Button
          onClick={() => onChange('board')}
          color={value === 'board' ? 'white' : 'neutral'}
          className="flex items-center"
        >
          <TbLayoutGrid />
          <span className="ml-2">Board</span>
        </Button>
      </ButtonGroup>
    </div>
  )
}
