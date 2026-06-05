'use client'

import { Combobox } from '@styleguide'

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
  const sorted = [...positions].sort(comparePositions)

  return (
    <div>
      <Combobox
        options={sorted}
        value={null}
        onChange={updateCallback}
        getOptionLabel={(option) => option.name}
        groupBy={(option) => option.topIssue?.name || ''}
        placeholder="Add Issue"
        clearable
      />
    </div>
  )
}
