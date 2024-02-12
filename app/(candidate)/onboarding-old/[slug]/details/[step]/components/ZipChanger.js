'use client';
import TextField from '@shared/inputs/TextField';
import Body1 from '@shared/typography/Body1';
import { useState } from 'react';
import { validateZip } from 'app/(entrance)/login/components/LoginPage';

export default function ZipChanger({ zip, updateZipCallback }) {
  const [editMode, setEditMode] = useState(false);
  const [updatedZip, setUpdatedZip] = useState(zip);
  const isValid = validateZip(updatedZip);

  const handleToggle = async () => {
    if (!editMode) {
      setEditMode(true);
    } else {
      if (isValid) {
        //vallback here
        setEditMode(false);
        await updateZipCallback(updatedZip);
      }
    }
  };

  return (
    <div className="">
      <Body1 className="font-semibold mt-16  mb-4 ">
        Where do you want to run?{' '}
        <span
          className="inline-block ml-2 text-blue-600 font-medium cursor-pointer hover:underline"
          onClick={handleToggle}
        >
          {editMode ? <>{isValid ? 'save' : 'invalid'}</> : 'change'}
        </span>
      </Body1>
      {editMode ? (
        <TextField
          value={updatedZip}
          fullWidth
          onChange={(e) => {
            setUpdatedZip(e.target.value);
          }}
          error={!isValid}
        />
      ) : (
        <div className="bg-slate-50 p-4 rounded text-indigo-50 font-semibold">
          {updatedZip}
        </div>
      )}
    </div>
  );
}
