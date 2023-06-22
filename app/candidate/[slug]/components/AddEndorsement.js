'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import ImageUpload from '@shared/inputs/ImageUpload';
import TextField from '@shared/inputs/TextField';
import H2 from '@shared/typography/H2';
import { revalidateCandidates } from 'helpers/cacheHelper';
import Image from 'next/image';
import { useState } from 'react';

export default function AddEndorsement(props) {
  const { candidate, campaign, isStaged, cancelCallback, saveCallback } = props;
  const [state, setState] = useState({
    name: '',
    image: '', //https://assets.goodparty.org/candidate-info/6d8418ad-999b-488f-875a-5551fcbca525.jpg
    content: '',
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
      endorsements.push(state);
      await saveCallback({
        ...campaign,
        endorsements,
      });
    } else {
      const endorsements = candidate.endorsements || [];
      console.log('here', endorsements);
      endorsements.push(state);
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
        Add endorsement
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
              customId="endorsement-upload"
              customElement={
                <div className="bg-primary text-slate-50 text-lg py-4 px-6 rounded-xl">
                  Upload Photo
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
      <div className="mt-14 flex justify-end">
        <div onClick={cancelCallback}>
          <SecondaryButton>Cancel</SecondaryButton>
        </div>
        <div onClick={save} className="ml-3">
          <PrimaryButton disabled={!canSave()}>Add endorsement</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
