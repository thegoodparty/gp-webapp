'use client';
import ErrorButton from '@shared/buttons/ErrorButton';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import ImageUpload from '@shared/inputs/ImageUpload';
import TextField from '@shared/inputs/TextField';
import H2 from '@shared/typography/H2';
import { revalidateCandidates } from 'helpers/cacheHelper';
import Image from 'next/image';
import { useState } from 'react';

export default function EditEndorsementModal(props) {
  const {
    candidate,
    campaign,
    isStaged,
    cancelCallback,
    saveCallback,
    endorsement,
    index,
  } = props;
  const [state, setState] = useState({
    name: endorsement.name,
    image: endorsement.image,
    content: endorsement.content,
  });

  const canSave = () => {
    return state.name !== '' && state.content !== '' && state.image !== '';
  };

  const handleUpload = (url) => {
    onChangeField('image', url);
  };

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const save = async () => {
    if (isStaged && campaign) {
      const endorsements = campaign.endorsements || [];
      endorsements[index] = state;
      await saveCallback({
        ...campaign,
        endorsements,
      });
    } else {
      const endorsements = candidate.endorsements || [];
      endorsements[index] = state;
      await saveCallback({
        ...candidate,
        endorsements,
      });
    }
    await revalidateCandidates();
    window.location.reload();
  };

  const handleDelete = async () => {
    if (isStaged && campaign) {
      const endorsements = campaign.endorsements || [];
      endorsements.splice(index, 1);
      await saveCallback({
        ...campaign,
        endorsements,
      });
    } else {
      const endorsements = candidate.endorsements || [];
      endorsements.splice(index, 1);
      await saveCallback({
        ...candidate,
        endorsements,
      });
    }
    await revalidateCandidates();
    window.location.reload();
  };
  return (
    <div className="bg-white rounded-xl w-[90vw] md:w-auto  lg:min-w-[740px]">
      <H2 className="text-center border-b border-slate-500 pb-5">
        Update endorsement
      </H2>
      <div className="flex items-center mb-14 mt-8">
        {state.image ? (
          <>
            <Image
              className="w-20 h-20 rounded-full object-cover object-center shadow-md  mr-5"
              width={80}
              height={80}
              src={state.image}
              alt="uploaded image"
            />

            <div
              onClick={() => {
                onChangeField('image', '');
              }}
            >
              <SecondaryButton>Change image</SecondaryButton>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-gray-400 mr-5" />
            <ImageUpload
              uploadCallback={handleUpload}
              maxFileSize={500000}
              customId="endorsement-upload-edit"
              customElement={
                <div className="bg-primary text-slate-50 text-lg py-4 px-6 rounded-xl">
                  Change Photo
                </div>
              }
            />
          </>
        )}
      </div>
      <TextField
        fullWidth
        value={state.name}
        placeholder="Jessica Jackson"
        label="Full Name"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => {
          onChangeField('name', e.target.value);
        }}
      />
      <TextField
        fullWidth
        className="mt-8"
        value={state.content}
        placeholder="Add your endorsement text"
        label="Endorsement text"
        InputLabelProps={{
          shrink: true,
        }}
        multiline
        rows={5}
        inputProps={{ maxLength: 400 }}
        onChange={(e) => {
          onChangeField('content', e.target.value);
        }}
      />
      <div className="mt-14 flex justify-between">
        <div onClick={handleDelete}>
          <ErrorButton>Delete</ErrorButton>
        </div>
        <div className="flex">
          <div onClick={cancelCallback}>
            <SecondaryButton>Cancel</SecondaryButton>
          </div>
          <div onClick={save} className="ml-3">
            <PrimaryButton disabled={!canSave()}>
              Update endorsement
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
