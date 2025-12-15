import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { CandidateTiers } from './candidate-tiers.constant'
import { IsVerifiedOptions } from './is-verified-options.constant'

type ValueMapping = CandidateTiers | IsVerifiedOptions

interface CandidateFieldSelectProps {
  value: string
  onChange: (event: SelectChangeEvent<string>) => void
  valueMapping?: ValueMapping
}

export const CandidateFieldSelect = ({
  value,
  onChange,
  valueMapping,
}: CandidateFieldSelectProps): React.JSX.Element => (
  <FormControl size="small">
    <Select displayEmpty value={value} onChange={onChange}>
      {valueMapping && Object.keys(valueMapping).map((display) => (
        <MenuItem key={display} value={String(valueMapping[display as keyof ValueMapping])}>
          {display}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)
