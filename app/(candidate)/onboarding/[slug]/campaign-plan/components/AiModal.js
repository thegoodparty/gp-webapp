'use client';
import Pill from '@shared/buttons/Pill';

import Modal from '@shared/utils/Modal';
import Image from 'next/image';

import { useState } from 'react';
import { FaRedo } from 'react-icons/fa';
import TextField from '@shared/inputs/TextField';
import { Select } from '@mui/material';
import AlertDialog from '@shared/utils/AlertDialog';

const knobs = [
  {
    key: 'tone',
    label: 'Change Tone',
    prompt: 'Please change the tone to be more',
    options: ['assertive', 'diplomatic', 'conciliatory', 'optimistic'],
  },
  {
    key: 'style',
    label: 'Change Style',
    prompt: 'Please change the style to be',
    options: ['formal', 'complex', 'humorous', 'personal'],
  },
  {
    key: 'length',
    label: 'Change Length',
    prompt: 'Please make the response length',
    options: ['concise', 'average', 'verbose'],
  },
];

export default function AiModal({ submitCallback, showWarning }) {
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [state, setState] = useState({
    improveQuery: '',
    tone: '',
    style: '',
    length: '',
  });

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const handleSubmit = () => {
    setShowModal(false);
    submitCallback(state.improveQuery);
  };

  const onChangeKnob = (key, value, index) => {
    let query = state.improveQuery;
    const knob = knobs[index];

    // first remove the input from that knob if it exists
    const existingPrompt = state[key];
    if (existingPrompt !== '') {
      query = query.replace(`${knob.prompt} ${existingPrompt}. `, '');
    }

    if (value !== '') {
      query += `${knob.prompt} ${value}. `;
    }

    setState({
      ...state,
      [key]: value,
      improveQuery: query,
    });
  };

  const handleRegenerate = () => {
    if (showWarning) {
      setShowAlert(true);
    } else {
      setShowModal(true);
    }
  };

  const handleProceed = () => {
    setShowAlert(false);
    setShowModal(true);
  };

  return (
    <>
      <div onClick={handleRegenerate} className="mr-3">
        <Pill outlined>
          <div className="flex items-center">
            <FaRedo />
            <div className="ml-2">Refine</div>
          </div>
        </Pill>
      </div>
      <Modal closeCallback={() => setShowModal(false)} open={showModal}>
        <div className="p-4" style={{ maxWidth: '960px', minWidth: '300px' }}>
          <h3 className="text-3xl font-black mb-9 flex items-center justify-center">
            <Image
              src="/images/campaign/ai-icon.svg"
              alt="GP-AI"
              width={48}
              height={48}
            />
            <div className="ml-3">Refine your campaign plan</div>
          </h3>
          <div className="my-10">
            <div className="w-full grid grid-cols-12 gap-3">
              {knobs.map((knob, index) => (
                <div className="col-span-12 lg:col-span-4" key={knob.label}>
                  <Select
                    native
                    value={state[knob.key]}
                    label={knob.label}
                    fullWidth
                    variant="outlined"
                    onChange={(e) =>
                      onChangeKnob(knob.key, e.target.value, index)
                    }
                  >
                    <option value="">{knob.label}</option>

                    {knob.options.map((op) => (
                      <option value={op} key={op}>
                        {op}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <TextField
              label="Ask the Good Party AI to add, remove, or change something"
              onChange={(e) => onChangeField('improveQuery', e.target.value)}
              value={state.improveQuery}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex justify-center items-center mt-3">
          <div
            className="mr-6 cursor-pointer hover:underline"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </div>
          <div onClick={handleSubmit}>
            <Pill>Submit</Pill>
          </div>
        </div>
      </Modal>
      <AlertDialog
        open={showAlert}
        handleClose={() => setShowAlert(false)}
        title="Warning - you will lose all changes"
        ariaLabel="Warning - you will lose all changes"
        description="You edited the plan. This will delete your edits and generate a new plan. Are you sure you want to proceed?"
        handleProceed={handleProceed}
      />
    </>
  );
}
