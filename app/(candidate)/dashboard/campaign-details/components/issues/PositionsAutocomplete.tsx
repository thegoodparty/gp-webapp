'use client'

import React, { useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@shared/inputs/TextField'

import H5 from '@shared/typography/H5'
import { Paper } from '@mui/material'
import { RiSearch2Line } from 'react-icons/ri'

interface TopIssue {
  name: string
}

interface Position {
  name: string
  topIssue?: TopIssue
}

interface PositionsAutocompleteProps {
  positions: Position[]
  updateCallback: (position: Position | null) => void
}

const comparePositions = (a: Position, b: Position) => {
  if (!a?.topIssue) {
    return -1
  }
  if (!b?.topIssue) {
    return 1
  }
  return a.topIssue?.name.localeCompare(b.topIssue?.name)
}

export default function PositionsAutocomplete({
  positions,
  updateCallback,
}: PositionsAutocompleteProps): React.JSX.Element {
  const sorted = positions.sort(comparePositions)
  const [inputValue, setInputValue] = useState('')

  const addPosition = (position: Position | null) => {
    updateCallback(position)
  }

  return (
    <div>
      <Autocomplete
        options={sorted}
        groupBy={(option) => {
          return option.topIssue?.name || ''
        }}
        getOptionLabel={(option) => option?.name}
        fullWidth
        PaperComponent={({ children }) => (
          <Paper style={{ background: '#242D3D' }}>{children}</Paper>
        )}
        popupIcon={<RiSearch2Line className="mr-2" />}
        inputValue={inputValue}
        onInputChange={(_, value) => setInputValue(value || '')}
        renderInput={(params) => <TextField {...params} label="Add Issue" />}
        renderGroup={(params) => (
          <div>
            <div className="bg-primary-dark p-2">
              <H5 className="text-gray-600">{params.group}</H5>
            </div>
            <div className="bg-primary-dark p-2 text-gray-300">
              {params.children}
            </div>
          </div>
        )}
        onChange={(_, item) => {
          addPosition(item)
        }}
      />
    </div>
  )
}
