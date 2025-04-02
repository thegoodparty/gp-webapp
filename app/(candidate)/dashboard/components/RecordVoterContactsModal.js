'use client';
import { useState } from 'react';
import Modal from '@shared/utils/Modal';
import H1 from '@shared/typography/H1';
import TextField from '@shared/inputs/TextField';
import Button from '@shared/buttons/Button';
import { VoterContactModalWrapper } from '../shared/VoterContactModalWrapper';
import { useVoterContacts } from '@shared/hooks/useVoterContacts';

const getEditedFields = (formState) =>
  Object.keys(formState).reduce(
    (acc, key) => ({
      ...acc,
      ...(Boolean(formState[key]) ? { [key]: parseInt(formState[key]) } : {}),
    }),
    {},
  );

const calculateIncrementedFields = (currentFields, editedFields) =>
  Object.keys(editedFields).reduce(
    (acc, k) => ({
      ...acc,
      [k]: (currentFields[k] || 0) + editedFields[k],
    }),
    {},
  );

export const RecordVoterContactsModal = ({ open = false, setOpen }) => {
  const [_, setRecordVoterGoals] = useVoterContacts();
  const [formState, setFormState] = useState({
    text: '',
    robocall: '',
    doorKnocking: '',
    phoneBanking: '',
    socialMedia: '',
    events: '',
  });

  const handleInputChange = (field) => (e) => {
    setFormState({
      ...formState,
      [field]: e.target.value,
    });
  };

  const handleSubmit = () => {
    setRecordVoterGoals((prev) => ({
      ...prev,
      ...calculateIncrementedFields(prev, getEditedFields(formState)),
    }));
    setOpen(false);
  };

  return (
    <Modal open={open} closeCallback={() => setOpen(false)}>
      <VoterContactModalWrapper>
        <div className="text-center">
          <H1>How many voters did you contact?</H1>
        </div>

        <div className="space-y-4">
          <TextField
            label="Text Messages Sent"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formState.text}
            onChange={handleInputChange('text')}
          />

          <TextField
            label="Robocalls Sent"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formState.robocall}
            onChange={handleInputChange('robocall')}
          />

          <TextField
            label="Doors Knocked"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formState.doorKnocking}
            onChange={handleInputChange('doorKnocking')}
          />

          <TextField
            label="Calls Made"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formState.phoneBanking}
            onChange={handleInputChange('phoneBanking')}
          />

          <TextField
            label="Social Post Views"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formState.socialMedia}
            onChange={handleInputChange('socialMedia')}
          />

          <TextField
            label="Voters Met At Events"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formState.events}
            onChange={handleInputChange('events')}
          />
        </div>

        <div className="flex justify-center">
          <Button
            color="secondary"
            size="large"
            onClick={handleSubmit}
            className="px-16"
          >
            Save
          </Button>
        </div>
      </VoterContactModalWrapper>
    </Modal>
  );
};
