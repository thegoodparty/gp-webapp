import { useState } from 'react';
import Modal from '@shared/utils/Modal';
import H1 from '@shared/typography/H1';
import TextField from '@shared/inputs/TextField';
import Button from '@shared/buttons/Button';
import { VoterContactModalWrapper } from '../shared/VoterContactModalWrapper';

export const RecordVoterContactsModal = ({ open = false, setOpen }) => {
  const [formData, setFormData] = useState({
    textMessagesSent: '',
    robocallsSent: '',
    doorsKnocked: '',
    callsMade: '',
    socialPostViews: '',
    votersMetAtEvents: '',
  });

  const handleInputChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // TODO: Handle form submission
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
            value={formData.textMessagesSent}
            onChange={handleInputChange('textMessagesSent')}
          />

          <TextField
            label="Robocalls Sent"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formData.robocallsSent}
            onChange={handleInputChange('robocallsSent')}
          />

          <TextField
            label="Doors Knocked"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formData.doorsKnocked}
            onChange={handleInputChange('doorsKnocked')}
          />

          <TextField
            label="Calls Made"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formData.callsMade}
            onChange={handleInputChange('callsMade')}
          />

          <TextField
            label="Social Post Views"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formData.socialPostViews}
            onChange={handleInputChange('socialPostViews')}
          />

          <TextField
            label="Voters Met At Events"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formData.votersMetAtEvents}
            onChange={handleInputChange('votersMetAtEvents')}
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
