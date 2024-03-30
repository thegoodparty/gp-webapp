'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';
import Modal from '@shared/utils/Modal';
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
      setShowInput(false);
      onChange(surveyKey, value);
    }
  };

  return (
    <>
      {value ? (
        <>
          <div className="py-2 px-4 text-sm  rounded-lg border border-slate-300 bg-yellow-50">
            {value}
          </div>
          <div
            className="mt-2 text-sm underline cursor-pointer"
            onClick={() => {
              setShowInput(true);
            }}
          >
            Change
          </div>
        </>
      ) : (
        <PrimaryButton
          fullWidth
          variant="outlined"
          onClick={() => {
            setShowInput(true);
          }}
          size="medium"
        >
          <div className="flex items-center">
            <FaCirclePlus />
            <div className="ml-2">Add</div>
          </div>
        </PrimaryButton>
      )}
      <Modal
        open={showInput}
        closeCallback={() => {
          setShowInput(false);
        }}
      >
        <div className=" min-w-[80vw]">
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
      </Modal>
    </>
  );
}
