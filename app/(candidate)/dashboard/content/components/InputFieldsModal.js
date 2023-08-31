'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import H2 from '@shared/typography/H2';
import Modal from '@shared/utils/Modal';

import { useState } from 'react';

import TextField from '@shared/inputs/TextField';

export default function InputFieldsModal({
  onSelectCallback,
  closeModalCallback,
  showModal,
  inputFields,
}) {
  const [inputState, setInputState] = useState({});

  const onChangeField = (key, value) => {
    setInputState({
      ...inputState,
      [key]: value,
    });
  };

  const handleCreate = () => {
    if (!canCreate) {
      return;
    }
    let additionalPrompt = 'additional info:\n';
    inputFields.forEach((field) => {
      additionalPrompt += `${field.title}: ${inputState[field.title]}\n`;
    });
    onSelectCallback(additionalPrompt);
    closeModalCallback();
    setInputState({});
  };

  const canCreate = () => {
    for (let i = 0; i < inputFields.length; i++) {
      const field = inputFields[i];
      if (!inputState[field.title] || inputState[field.title] === '') {
        return false;
      }
    }
    return true;
  };

  return (
    <Modal closeCallback={closeModalCallback} open={showModal}>
      <div className="lg:min-w-[400px] max-w-lg">
        <H2 className="pb-5 mb-5 border-b border-slate-500 text-center">
          Additional Inputs
        </H2>
        {inputFields.map((field) => (
          <div className="mb-6" key={field.title}>
            <TextField
              required
              type={field.isDate ? 'date' : 'text'}
              label={field.title}
              helperText={field.helperText}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={inputState[field.title] || ''}
              onChange={(e) => {
                onChangeField(field.title, e.target.value);
              }}
            />
          </div>
        ))}
        <TextField
          type="text"
          label="Additional instructions"
          helperText="you can ask anything here"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={inputState['Additional instructions']}
          onChange={(e) => {
            onChangeField('Additional instructions', e.target.value);
          }}
        />
        <div className="flex justify-center mt-6" onClick={handleCreate}>
          <PrimaryButton disabled={!canCreate()}>Create</PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
