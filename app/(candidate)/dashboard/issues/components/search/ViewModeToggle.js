'use client'
import { ButtonGroup } from '@mui/material'
import Button from '@shared/buttons/Button'
import { FaListUl } from 'react-icons/fa'
import { TbLayoutGrid } from 'react-icons/tb'

export default function ViewModeToggle({ viewMode, onViewModeChange }) {
  return (
    <div className="flex bg-neutral-light p-1 rounded-md">
      <ButtonGroup variant="outlined" size="small">
        <Button
          onClick={() => onViewModeChange('list')}
          color={viewMode === 'list' ? 'white' : 'neutral'}
          className="mr-2 flex items-center"
        >
          <FaListUl />
          <span className="ml-2">List</span>
        </Button>
        <Button
          onClick={() => onViewModeChange('board')}
          color={viewMode === 'board' ? 'white' : 'neutral'}
          className="flex items-center"
        >
          <TbLayoutGrid />
          <span className="ml-2">Board</span>
        </Button>
      </ButtonGroup>
    </div>
  )
}
