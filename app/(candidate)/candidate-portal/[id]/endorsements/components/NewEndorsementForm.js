import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import ImageUpload from '@shared/inputs/ImageUpload';
import TextField from '@shared/inputs/TextField';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { isValidUrl } from 'helpers/linkhelper';

const addEndorsement = async (id, title, summary, link, image) => {
  const api = gpApi.campaign.endorsement.create;
  const payload = { candidateId: id, title, summary, link, image };
  return await gpFetch(api, payload);
};

const updateEndorsement = async (endorsement, candidateId) => {
  const api = gpApi.campaign.endorsement.update;
  const payload = { endorsement, candidateId };
  return await gpFetch(api, payload);
};

const initialState = {
  title: '',
  summary: '',
  link: '',
  image: '',
};
function NewEndorsementForm({
  closeAdd,
  existingEndorsement,
  id,
  updateEndorsements,
  candidate,
  updateEndorsementCallback,
}) {
  const [state, setState] = useState(initialState);
  const snackbarState = useHookstate(globalSnackbarState);

  useEffect(() => {
    if (existingEndorsement) {
      setState(existingEndorsement);
    }
  }, [existingEndorsement]);

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const onSave = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saving Endorsement...',
        isError: false,
      };
    });

    if (existingEndorsement) {
      await updateEndorsement(state, candidate.id);
      updateEndorsementCallback();
    } else {
      await addEndorsement(
        id,
        state.title,
        state.summary,
        state.link,
        state.image,
      );
      closeAdd();
    }
    updateEndorsements();
    setState(initialState);
  };

  const canSubmit = () =>
    state.summary !== '' &&
    state.title !== '' &&
    (state.link === '' || isValidUrl(state.link));

  const handleUploadImage = (image) => {
    if (image) {
      setState({
        ...state,
        image,
      });
    }
  };
  return (
    <div className="p-6">
      <div className="lg:w-[60%]">
        <form noValidate onSubmit={(e) => e.preventDefault()}>
          <TextField
            style={{ width: '100%' }}
            label="Title"
            onChange={(e) => onChangeField('title', e.target.value)}
            value={state.title}
          />
          <br />
          <br />
          <TextField
            style={{ width: '100%' }}
            label="Summary"
            multiline
            rows={3}
            onChange={(e) => onChangeField('summary', e.target.value)}
            value={state.summary}
          />
          <br />
          <br />
          <TextField
            style={{ width: '100%' }}
            label="Link"
            onChange={(e) => onChangeField('link', e.target.value)}
            value={state.link}
            error={state.link != '' && !isValidUrl(state.link)}
            helperText={
              state.link != '' && !isValidUrl(state.link)
                ? 'Your link is not valid. Make sure it starts with http or https.'
                : ''
            }
          />
          <br />
          <br />
          {state.image ? (
            <>
              Endorsement Image
              <br />
              <div className="w-60 h-40 relative">
                <Image fill src={state.image} className="object-cover" />
              </div>
              <div
                className="mt-3 cursor-pointer underline"
                onClick={() => onChangeField('image', '')}
              >
                Change Image
              </div>
            </>
          ) : (
            <div
              className="border rounded py-5 px-4 flex items-center justify-between"
              style={{ borderColor: 'rgb(0, 0, 0, 0.2)' }}
            >
              <div>Endorsement Image</div>
              <ImageUpload
                uploadCallback={(image) => handleUploadImage(image)}
                customElement={<div className="underline">Upload</div>}
              />
            </div>
          )}
          <br />
          <br />
          <div className="text-right">
            <BlackButtonClient
              disabled={!canSubmit()}
              onClick={onSave}
              type="submit"
            >
              <strong>Save</strong>
            </BlackButtonClient>
          </div>
        </form>
      </div>
    </div>
  );
}

NewEndorsementForm.propTypes = {};

export default NewEndorsementForm;
