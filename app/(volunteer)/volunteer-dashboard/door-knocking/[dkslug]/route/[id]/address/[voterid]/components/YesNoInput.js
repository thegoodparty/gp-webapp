'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
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
        <SecondaryButton
          fullWidth
          size="medium"
          variant={`${value === 'yes' ? 'contained' : 'outlined'}`}
          onClick={() => {
            handleChange('yes');
          }}
        >
          Yes
        </SecondaryButton>
      </div>
      <div className=" col-span-6">
        <SecondaryButton
          fullWidth
          size="medium"
          variant={`${value === 'no' ? 'contained' : 'outlined'}`}
          onClick={() => {
            handleChange('no');
          }}
        >
          No
        </SecondaryButton>
      </div>
    </div>
  );
}
