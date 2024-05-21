import { useState } from 'react';
import { Autocomplete, InputAdornment } from '@mui/material';
import { theme } from 'tailwind.config';
import TextField from '@shared/inputs/TextField';
import IconButton from '@mui/material/IconButton';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';

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
                    <CloseIcon />
                  </IconButton>
                )}
                {params.InputProps.endAdornment}
              </InputAdornment>
            ),
          }}
        />
      )}
      getOptionLabel={({ name }) => name}
      filterOptions={filterOptions}
    />
  );
};
