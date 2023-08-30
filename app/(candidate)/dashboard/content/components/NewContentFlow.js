'use client';

import { Select } from '@mui/material';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import H2 from '@shared/typography/H2';
import H6 from '@shared/typography/H6';
import Modal from '@shared/utils/Modal';

import { useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import TextField from '@shared/inputs/TextField';

export async function fetchInputFields(subKey) {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'promptInputFields',
    subKey,
  };
  return await gpFetch(api, payload, 120);
}

export default function NewContentFlow({
  prompts,
  onSelectCallback,
  sections,
  isProcessing,
}) {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selected, setSelected] = useState('');
  const [inputFields, setInputFields] = useState([]);
  const [inputState, setInputState] = useState({});

  const onSelectPrompt = async () => {
    if (selected !== '') {
      const { content } = await fetchInputFields(selected);
      if (!content) {
        const key = findKey();
        onSelectCallback(key);
      } else {
        setInputFields(content);
        setShowModal2(true);
      }
      setShowModal(false);
    }
  };

  const findKey = () => {
    if (!sections[selected]) {
      return selected;
    }
    for (let i = 2; i < 20; i++) {
      if (!sections[`${selected}${i}`]) {
        return `${selected}${i}`;
      }
    }
    return `${selected}21`;
  };

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
    const chat = [{ role: 'user', content: additionalPrompt }];
    const key = findKey();
    onSelectCallback(key, chat);
    setShowModal2(false);
    setInputFields([]);
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
    <div>
      <div className="mb-7 inline-block" onClick={() => setShowModal(true)}>
        <PrimaryButton>+ New Content</PrimaryButton>
      </div>

      <Modal closeCallback={() => setShowModal(false)} open={showModal}>
        <div className="lg:min-w-[740px]">
          <H2 className="pb-5 mb-5 border-b border-slate-500 text-center">
            Create content
          </H2>
          <H6 className="mt-14 mb-2">Select a template</H6>
          <Select
            native
            value={selected}
            required
            variant="outlined"
            fullWidth
            onChange={(e) => {
              setSelected(e.target.value);
            }}
          >
            <option value="">Select an option</option>
            {prompts.map((prompt) => (
              <option key={prompt.key} value={prompt.key}>
                {prompt.title}
              </option>
            ))}
          </Select>
          <div className="mt-16 flex w-full justify-end">
            <div
              onClick={() => {
                setShowModal(false);
              }}
            >
              <SecondaryButton disabled={isProcessing}>Cancel</SecondaryButton>
            </div>
            <div className="ml-3" onClick={onSelectPrompt}>
              <PrimaryButton disabled={isProcessing || selected === ''}>
                {isProcessing ? <CircularProgress size={20} /> : 'Create'}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Modal>

      <Modal closeCallback={() => setShowModal2(false)} open={showModal2}>
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
          <div className="flex justify-center" onClick={handleCreate}>
            <PrimaryButton disabled={!canCreate()}>Create</PrimaryButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
