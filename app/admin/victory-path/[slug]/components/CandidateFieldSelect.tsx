import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material'

interface CandidateFieldSelectProps {
  value: string
  onChange: (event: SelectChangeEvent<string>) => void
  valueMapping?: Partial<Record<string, string>>
}

export const CandidateFieldSelect = ({
  value,
  onChange,
  valueMapping = {},
}: CandidateFieldSelectProps): React.JSX.Element => (
  <FormControl size="small">
    <Select displayEmpty value={value} onChange={onChange}>
      {Object.keys(valueMapping).map((display) => (
        <MenuItem key={display} value={valueMapping[display]}>
          {display}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)
