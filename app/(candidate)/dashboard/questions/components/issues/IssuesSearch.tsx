import { useState, SyntheticEvent } from 'react'
import { Autocomplete, InputAdornment, FilterOptionsState } from '@mui/material'
import { theme } from 'tailwind.config'
import TextField from '@shared/inputs/TextField'
import IconButton from '@mui/material/IconButton'
import { IoCloseSharp } from 'react-icons/io5'

interface IssueOption {
  name: string
}

const filterOptions = (
  options: IssueOption[],
  { inputValue }: FilterOptionsState<IssueOption>,
): IssueOption[] => {
  if (options && typeof options.filter === 'function') {
    return options.filter((option) => {
      return option.name.toLowerCase().includes(inputValue.toLowerCase())
    })
  }
  return []
}

interface IssuesSearchProps {
  issues: IssueOption[]
  onInputChange?: (value: string) => void
}

export const IssuesSearch = ({
  issues,
  onInputChange = () => {},
}: IssuesSearchProps): React.JSX.Element => {
  const [value, setValue] = useState<IssueOption | null>(null)
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (
    _event: SyntheticEvent | null,
    newInputValue: string,
  ): void => {
    // TODO: We REALLY need to figure out why we're updating THREE different states here.
    //  seems like a bad code smell.
    !newInputValue && setValue(null)
    setInputValue(newInputValue)
    onInputChange(newInputValue)
  }

  return (
    <Autocomplete
      value={value || undefined}
      onChange={(_event: SyntheticEvent, newValue: IssueOption | null) => {
        setValue(newValue)
      }}
      inputValue={inputValue}
      onInputChange={(_e, v) => handleInputChange(null, v)}
      className="office-autocomplete"
      sx={{
        '& fieldset': {
          border: `2px solid ${theme.extend.colors.indigo[300]}`,
          borderRadius: '8px',
        },
      }}
      options={issues || []}
      disableClearable
      clearOnBlur={false}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search for climate change, economic equality…"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                {inputValue && (
                  <IconButton
                    onClick={(e) => handleInputChange(e, '')}
                    size="small"
                  >
                    <IoCloseSharp />
                  </IconButton>
                )}
                {params.InputProps.endAdornment}
              </InputAdornment>
            ),
          }}
        />
      )}
      getOptionLabel={({ name }: IssueOption) => name}
      filterOptions={filterOptions}
    />
  )
}
