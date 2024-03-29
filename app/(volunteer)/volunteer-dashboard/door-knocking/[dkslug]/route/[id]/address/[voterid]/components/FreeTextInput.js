'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';
import { useState } from 'react';
import { FaCirclePlus } from 'react-icons/fa6';

export default function FreeTextInput({
  surveyKey,
  initialValue = '',
  onChange,
}) {
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState(initialValue);
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleSave = () => {
    if (onChange) {
      onChange(surveyKey, value);
    }
  };

  return (
    <>
      {showInput ? (
        <div>
          <TextField
            autoFocus
            fullWidth
            label="Add Note"
            multiline
            rows={4}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <div className="mt-4">
            <PrimaryButton
              fullWidth
              onClick={handleSave}
              disabled={value === ''}
            >
              Save
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <PrimaryButton
          fullWidth
          variant="outlined"
          onClick={() => {
            setShowInput(true);
          }}
        >
          <div className="flex items-center">
            <FaCirclePlus />
            <div className="ml-2">Add</div>
          </div>
        </PrimaryButton>
      )}
    </>
  );
}
