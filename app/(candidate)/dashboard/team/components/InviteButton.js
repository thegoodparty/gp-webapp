'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput';
import H2 from '@shared/typography/H2';
import Modal from '@shared/utils/Modal';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';
import { BsPlusCircleFill } from 'react-icons/bs';

async function sendInvitation(email) {
  try {
    const api = gpApi.campaign.volunteerInvitation.create;

    const payload = {
      email,
      role: 'volunteer',
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

  const handleSave = async () => {
    if (canSave()) {
      await sendInvitation(email);
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
            <H2 className="mb-6">Add Teammates</H2>
            <EmailInput
              value={email}
              fullWidth
              onChangeCallback={(e) => setEmail(e.target.value)}
            />
            <div className="mt-16 flex justify-end">
              <div
                onClick={() => {
                  setShowModal(false);
                }}
                className="mr-3"
              >
                <PrimaryButton variant="outlined">Cancel</PrimaryButton>
              </div>
              <PrimaryButton
                disabled={!canSave()}
                type="submit"
                onClick={handleSave}
              >
                Save &amp; Continue
              </PrimaryButton>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
