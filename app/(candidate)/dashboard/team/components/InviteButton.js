'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Button from '@shared/buttons/Button';
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput';
import Modal from '@shared/utils/Modal';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';
import { BsPlusCircleFill } from 'react-icons/bs';
import Body2 from '@shared/typography/Body2';
import { MenuItem, Select } from '@mui/material';
import H1 from '@shared/typography/H1';

async function sendInvitation(email, role) {
  try {
    const api = gpApi.campaign.volunteerInvitation.create;

    const payload = {
      email,
      role: role || 'volunteer',
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at sendInvitation', e);
    return {};
  }
}

export default function InviteButton({ reloadInvitationsCallback }) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('manager');

  const handleSave = async () => {
    if (canSave()) {
      await sendInvitation(email, role);
      await reloadInvitationsCallback();
      setShowModal(false);
    }
  };
  const canSave = () => {
    return isValidEmail(email);
  };
  return (
    <>
      <PrimaryButton
        onClick={() => {
          setShowModal(true);
        }}
      >
        <div className="flex items-center">
          <BsPlusCircleFill /> <div className="ml-2">Add</div>
        </div>
      </PrimaryButton>
      <Modal
        open={showModal}
        closeCallback={() => {
          setShowModal(false);
        }}
      >
        <div className="w-[90vw] max-w-xl">
          <form noValidate onSubmit={(e) => e.preventDefault()}>
            <header className="text-center">
              <H1 className="mb-4">Add Team Member</H1>
              <Body2 className="mb-8">
                Send an invite via email to join the team
              </Body2>
            </header>
            <EmailInput
              className="mb-6"
              value={email}
              fullWidth
              onChangeCallback={(e) => setEmail(e.target.value)}
            />
            <Select
              value={role}
              onChange={(v) => setRole(v)}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="manager">Campaign Manager</MenuItem>
            </Select>
            <div className="mt-16 flex flex-col md:flex-row justify-between">
              <Button
                className="w-full md:min-w-[33%] md:max-w-[33%] mb-4 md:mb-0"
                onClick={() => setShowModal(false)}
                size="large"
                color="neutral"
                variant="contained"
              >
                Cancel
              </Button>
              <Button
                className="w-full md:min-w-[33%] md:max-w-[33%]"
                size="large"
                color="primary"
                disabled={!canSave()}
                type="submit"
                onClick={handleSave}
              >
                Add
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
