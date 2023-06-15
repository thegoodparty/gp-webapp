'use client';
import ErrorButton from '@shared/buttons/ErrorButton';
import InfoButton from '@shared/buttons/InfoButton';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';
import Body1 from '@shared/typography/Body1';
import H2 from '@shared/typography/H2';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';

export async function deleteCandidatePosition(id) {
  try {
    const api = gpApi.campaign.candidatePosition.delete;
    const payload = {
      id,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at saveCandidatePosition', e);
    return false;
  }
}

export async function updateCandidatePosition(id, description) {
  try {
    const api = gpApi.campaign.candidatePosition.update;
    const payload = {
      id,
      description,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at saveCandidatePosition', e);
    return false;
  }
}

export default function EditCandidatePosition({
  candidatePosition,
  index,
  updatePositionsCallback,
}) {
  const [edit, setEdit] = useState(false);
  const [description, setDescription] = useState(candidatePosition.description);

  const handleDelete = async () => {
    await deleteCandidatePosition(candidatePosition.id);
    updatePositionsCallback();
  };

  const handleSave = async () => {
    await updateCandidatePosition(candidatePosition.id, description);
    updatePositionsCallback();
    setEdit(false);
  };
  return (
    <div className="border-2 py-5 px-8 mb-5 rounded-xl border-dashed border-slate-900 min-h-[150px] bg-slate-100">
      <H2 className="mb-5">Issue {index + 1}</H2>
      <div className="rounded-full bg-primary py-2 px-3 text-slate-50 inline-block">
        <Body1>{candidatePosition.position.name}</Body1>
      </div>
      {edit ? (
        <div className="bg-slate-200 py-4 px-5 mt-7 rounded-lg">
          <TextField
            placeholder="Write 1 or 2 sentences about your position on this issue"
            multiline
            rows={6}
            inputProps={{ maxLength: 1000 }}
            fullWidth
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <div className="text-right mt-4">
            <div
              className="mr-2 inline-block"
              onClick={() => {
                setEdit(false);
              }}
            >
              <ErrorButton size="medium">Cancel</ErrorButton>
            </div>
            <div className="inline-block" onClick={handleSave}>
              <PrimaryButton size="medium" disabled={description === ''}>
                Save
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-200 py-4 px-5 mt-7 rounded-lg">
          {candidatePosition.description}
        </div>
      )}
      {!edit && (
        <div className="mt-2 text-right">
          <div className="mr-2 inline-block" onClick={handleDelete}>
            <ErrorButton size="small">Delete</ErrorButton>
          </div>
          <div
            onClick={() => {
              setEdit(true);
            }}
            className="inline-block"
          >
            <InfoButton className="inline-block" size="small">
              Edit
            </InfoButton>
          </div>
        </div>
      )}
    </div>
  );
}
