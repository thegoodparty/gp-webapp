'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput';
import PhoneInput, { isValidPhone } from '@shared/inputs/PhoneInput';
import TextField from '@shared/inputs/TextField';
import Modal from '@shared/utils/Modal';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { partyRace } from 'helpers/candidateHelper';
import { getUserCookie } from 'helpers/cookieHelper';
import Image from 'next/image';
import { useState } from 'react';

const claim = async (name, email, phone, candidateId) => {
  const api = gpApi.campaign.claim;
  const payload = {
    name,
    email,
    phone,
    uri: window.location.href,
    candidateId,
  };
  try {
    await gpFetch(api, payload);
    return true;
  } catch (e) {
    return false;
  }
};

export default function ClaimModal({ candidate }) {
  const claiming = false;
  const [showModal, setShowModal] = useState(false);
  const user = getUserCookie(true);
  const [state, setState] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    phone: user ? user.phone : '',
    formSent: false,
  });
  const { image, firstName, lastName } = candidate;

  const onChangeField = (event, key) => {
    setState({
      ...state,
      [key]: event.target.value,
    });
  };

  const canSubmit = () => {
    return (
      isValidEmail(state.email) &&
      state.name.length > 2 &&
      (state.phone === '' || isValidPhone(state.phone))
    );
  };

  const submitForm = async () => {
    if (canSubmit()) {
      const res = await claim(
        state.name,
        state.email,
        state.phone,
        candidate.id,
      );
      if (res) {
        setState({
          ...state,
          formSent: true,
        });
      }
    }
  };

  const showSuccess = claiming === false && state.formSent;

  return (
    <>
      <div className="mt-3 text-zinc-500" data-cy="candidate-claimed">
        Is this you?{' '}
        <span
          className="underline cursor-pointer text-black"
          onClick={() => setShowModal(true)}
          data-cy="candidate-claim-page"
        >
          Claim this page
        </span>
      </div>
      <Modal closeCallback={() => setShowModal(false)} open={showModal}>
        <div className="p-4" style={{ maxWidth: '600px', minWidth: '300px' }}>
          <h3 className="text-3xl font-black mb-9">Claim this campaign</h3>
          <div className="row">
            {image && (
              <div className="h-8 w-8 relative mr-3">
                <Image
                  src={image}
                  layout="fill"
                  alt="Claim campaign"
                  className="object-cover rounded-full object-center"
                />
              </div>
            )}
            <div>
              <strong>
                {firstName} {lastName}
              </strong>
              <br />
              <div className="pt-1 text-neutral-400">
                {partyRace(candidate, false)}
              </div>
            </div>
          </div>

          <div className="mt-6 mb-12 border-t border-t-gray-200" />
          {showSuccess ? (
            <div className="text-center">
              <span role="img" aria-label="Party" className="text-3xl">
                🎉
              </span>
              <h3 className="text-3xl font-black mb-9">Thank you!</h3>
              <div>
                Someone will be reaching out to
                <br />
                you from our team shortly.
              </div>

              <div
                className="mt-12 underline cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                Back to campaign
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={(e) => e.preventDefault()}>
              <TextField
                fullWidth
                primary
                label="Name"
                value={state.name}
                onChange={(e) => onChangeField(e, 'name')}
                error={state.name != '' && state.name.length < 2}
              />
              <br />
              <br />
              <br />
              <EmailInput
                onChangeCallback={(e) => onChangeField(e, 'email')}
                value={state.email}
              />
              <br />
              <br />
              <br />
              <PhoneInput
                onChangeCallback={(value) =>
                  onChangeField({ target: { value } }, 'phone')
                }
                value={state.phone}
              />
              <br />
              <br />
              <BlackButtonClient
                disabled={!canSubmit()}
                onClick={submitForm}
                id="claim-campaign-modal"
                type="submit"
              >
                Submit
              </BlackButtonClient>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}
