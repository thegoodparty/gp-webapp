'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { useState } from 'react';

export default function YesNoInput({ surveyKey, initialValue, onChange }) {
  const [value, setValue] = useState(initialValue);
  const handleChange = (newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(surveyKey, newValue);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className=" col-span-6">
        <PrimaryButton
          fullWidth
          variant={`${value === 'yes' ? 'contained' : 'outlined'}`}
          onClick={() => {
            handleChange('yes');
          }}
        >
          Yes
        </PrimaryButton>
      </div>
      <div className=" col-span-6">
        <PrimaryButton
          fullWidth
          variant={`${value === 'no' ? 'contained' : 'outlined'}`}
          onClick={() => {
            handleChange('no');
          }}
        >
          No
        </PrimaryButton>
      </div>
    </div>
  );
}
