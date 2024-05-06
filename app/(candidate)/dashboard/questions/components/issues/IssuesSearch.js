import { useState } from 'react';
import { Autocomplete } from '@mui/material';
import { theme } from 'tailwind.config';
import TextField from '@shared/inputs/TextField';

const filterOptions = (options, { inputValue }) => {
  if (options && typeof options.filter === 'function') {
    return options.filter((option) => {
      return option.name.toLowerCase().includes(inputValue.toLowerCase());
    });
  }
};

export const IssuesSearch = ({ issues, onInputChange = (v) => {} }) => {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    onInputChange(newInputValue);
  };

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      className="office-autocomplete"
      sx={{
        '& fieldset': {
          border: `2px solid ${theme.extend.colors.indigo[300]}`,
          borderRadius: '8px',
        },
      }}
      options={issues || []}
      clearOnBlur={false}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search for climate change, economic equality…"
        />
      )}
      getOptionLabel={({ name }) => name}
      filterOptions={filterOptions}
    />
  );
};
