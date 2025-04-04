import { FormControl, MenuItem, Select } from '@mui/material'

export const CandidateFieldSelect = ({
  value,
  onChange,
  valueMapping = {},
}) => (
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
