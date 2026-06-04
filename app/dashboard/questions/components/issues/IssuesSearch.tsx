import { noop } from '@shared/utils/noop'
import { useState } from 'react'
import { Combobox } from '@styleguide'

interface IssueOption {
  name?: string
}

interface IssuesSearchProps {
  issues: IssueOption[]
  onInputChange?: (value: string) => void
}

export const IssuesSearch = ({
  issues,
  onInputChange = noop,
}: IssuesSearchProps): React.JSX.Element => {
  const [value, setValue] = useState<IssueOption | null>(null)

  const handleInputChange = (newInputValue: string): void => {
    !newInputValue && setValue(null)
    onInputChange(newInputValue)
  }

  return (
    <Combobox
      options={issues || []}
      value={value}
      onChange={(newValue) => setValue(newValue)}
      getOptionLabel={(o) => o.name || ''}
      onInputChange={handleInputChange}
      placeholder="Search for climate change, economic equality…"
      searchPlaceholder="Search for climate change, economic equality…"
      clearable
    />
  )
}
