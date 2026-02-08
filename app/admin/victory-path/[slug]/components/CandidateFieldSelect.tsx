import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { CANDIDATE_TIERS } from './candidate-tiers.constant'
import { IS_VERIFIED_OPTIONS } from './is-verified-options.constant'

type ValueMapping = typeof CANDIDATE_TIERS | typeof IS_VERIFIED_OPTIONS
type SelectValue = string | boolean | null

interface CandidateFieldSelectProps {
  value: SelectValue
  onChange: (event: SelectChangeEvent<SelectValue>) => void
  valueMapping?: ValueMapping
}

export const CandidateFieldSelect = ({
  value,
  onChange,
  valueMapping,
}: CandidateFieldSelectProps): React.JSX.Element => (
  <FormControl size="small">
    <Select displayEmpty value={value} onChange={onChange}>
      {valueMapping && Object.entries(valueMapping).map(([display, val]) => (
        <MenuItem key={display} value={val}>
          {display}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)
