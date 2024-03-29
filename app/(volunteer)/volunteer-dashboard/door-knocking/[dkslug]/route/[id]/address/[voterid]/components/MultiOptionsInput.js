'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import { useState } from 'react';
import { FaCirclePlus } from 'react-icons/fa6';

export default function MultiOptionsInput({
  surveyKey,
  initialValue,
  onChange,
  options,
}) {
  const [value, setValue] = useState(initialValue);
  const [showInput, setShowInput] = useState(false);
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
        <div className="">
          {options.map((option, index) => (
            <div key={index} className="mb-4">
              <SecondaryButton
                fullWidth
                variant={`${value === option ? 'contained' : 'outlined'}`}
                onClick={() => {
                  handleChange(option);
                }}
              >
                <div className="text-left">{option}</div>
              </SecondaryButton>
            </div>
          ))}
          <div className="mt-12">
            <PrimaryButton fullWidth onClick={handleSave}>
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
