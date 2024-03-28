import { FormControl, MenuItem, Select } from '@mui/material';

const IS_VERIFIED_OPTIONS = {
  Review: null,
  Yes: true,
  No: false,
};
export const IsVerifiedSelect = ({ value, onChange }) => <FormControl
  size="small">
  <Select
    displayEmpty
    value={value}
    onChange={onChange}>
    {
      Object.keys(IS_VERIFIED_OPTIONS)
      .map(isVerifiedDisplay => <MenuItem
        key={isVerifiedDisplay}
        value={IS_VERIFIED_OPTIONS[isVerifiedDisplay]}>
        {isVerifiedDisplay}
      </MenuItem>)
    }
  </Select>
</FormControl>;
