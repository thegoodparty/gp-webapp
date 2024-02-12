'use client';
import TextField from '@shared/inputs/TextField';
import Body1 from '@shared/typography/Body1';
import { useState } from 'react';
import { validateZip } from 'app/(entrance)/login/components/LoginPage';
import Modal from '@shared/utils/Modal';
import H2 from '@shared/typography/H2';
import PrimaryButton from '@shared/buttons/PrimaryButton';

export default function ZipChanger({ zip, updateZipCallback }) {
  const [editMode, setEditMode] = useState(false);
  const [updatedZip, setUpdatedZip] = useState(zip);
  const isValid = validateZip(updatedZip);

  const handleToggle = async () => {
    if (!editMode) {
      setEditMode(true);
    } else {
      if (isValid) {
        setEditMode(false);
        await updateZipCallback(updatedZip);
      }
    }
  };

  return (
    <div className="">
      <Body1 className="font-semibold  text-left">
        Offices available in
        <span
          className="inline-block ml-2 text-purple-400 font-medium cursor-pointer underline"
          onClick={handleToggle}
        >
          {updatedZip}
        </span>
      </Body1>
      <Modal open={editMode} closeCallback={handleToggle}>
        <H2 className="my-6">What Zip Code are you running in?</H2>
        <TextField
          value={updatedZip}
          fullWidth
          onChange={(e) => {
            setUpdatedZip(e.target.value);
          }}
          error={!isValid}
        />
        <div className="mt-6 text-center" onClick={handleToggle}>
          <PrimaryButton disabled={!isValid}>Save</PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}
