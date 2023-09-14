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
import InputFieldsModal from './InputFieldsModal';
import TemplateList from './TemplatesList';

export async function fetchInputFields(subKey) {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'promptInputFields',
    subKey,
  };
  return await gpFetch(api, payload, 3600);
}

export default function NewContentFlow(props) {
  const { prompts, onSelectCallback, sections, isProcessing } = props;
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selected, setSelected] = useState('');
  const [inputFields, setInputFields] = useState([]);

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

  const handleAdditionalInput = (additionalPrompt) => {
    const chat = [{ role: 'user', content: additionalPrompt }];
    const key = findKey();
    onSelectCallback(key, chat);
    setShowModal2(false);
    setInputFields([]);
  };

  const handelSelect = async (key) => {
    setSelected(key);
    await onSelectPrompt();
  };

  const closeModal = () => {
    setSelected(false);
    setShowModal(false);
    setShowModal2(false);
  };

  return (
    <div>
      <div className="mb-7 inline-block" onClick={() => setShowModal(true)}>
        <PrimaryButton>+ New Content</PrimaryButton>
      </div>

      <Modal closeCallback={closeModal} open={showModal}>
        <div className="w-[calc(90vw-64px)]">
          <H2 className="pb-5 mb-5 border-b border-slate-500 text-center">
            Select a Template
          </H2>
          <TemplateList
            {...props}
            onSelectCallback={handelSelect}
            selectedKey={selected}
          />

          <div className="mt-16 flex w-full justify-end">
            <div onClick={closeModal}>
              <SecondaryButton disabled={isProcessing} size="medium">
                Cancel
              </SecondaryButton>
            </div>
          </div>
        </div>
      </Modal>

      <InputFieldsModal
        onSelectCallback={handleAdditionalInput}
        closeModalCallback={closeModal}
        showModal={showModal2 && selected}
        inputFields={inputFields}
      />
    </div>
  );
}
