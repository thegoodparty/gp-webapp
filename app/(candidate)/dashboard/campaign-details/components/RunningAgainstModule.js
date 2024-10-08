'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { useState } from 'react';
import TextField from '@shared/inputs/TextField';
import { Select } from '@mui/material';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { FaTrash } from 'react-icons/fa';

const partyOptions = [
  'Independent',
  'Democrat Party',
  'Republican Party',
  'Green Party',
  'Libertarian Party',
  'Forward Party',
  'Other',
];

export default function RunningAgainstModule({
  campaign,
  handleSave,
  smallButton = false,
}) {
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    handleSave(state);
  };

  let initialState = {
    runningAgainst: [],
    newName: '',
    newDesc: '',
    newParty: '',
  };
  const shortVersion = campaign?.details?.filedStatement == 'yes';
  if (campaign?.details?.runningAgainst) {
    initialState.runningAgainst = campaign.details.runningAgainst;
  }

  const [state, setState] = useState(initialState);

  const canSave = () => {
    if (
      state.newName !== '' &&
      (state.newDesc === '' || state.newParty === '')
    ) {
      return false;
    }

    if (
      state.newDesc !== '' &&
      (state.newName === '' || state.newParty === '')
    ) {
      return false;
    }

    if (
      state.newParty !== '' &&
      (state.newName === '' || state.newDesc === '')
    ) {
      return false;
    }

    if (
      state.newName === '' &&
      state.newDesc === '' &&
      state.newParty === '' &&
      state.runningAgainst.length === 0
    ) {
      return false;
    }

    return true;
  };

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const handleAddAnother = () => {
    if (state.newName === '' || state.newDesc === '' || state.newParty === '') {
      return;
    }
    const newAgainst = state.runningAgainst;
    newAgainst.push({
      name: state.newName,
      description: state.newDesc,
      party: state.newParty,
    });

    setState({
      runningAgainst: newAgainst,
      newName: '',
      newDesc: '',
      newParty: '',
    });
  };

  const removeAgainst = (index) => {
    const newAgainst = state.runningAgainst;
    newAgainst.splice(index, 1);
    onChangeField('runningAgainst', newAgainst);
  };

  return (
    <div>
      {state.runningAgainst?.map((against, index) => (
        <div
          className="my-6 border rounded-xl p-4 border-gray-400 flex justify-between"
          key={against.name}
        >
          <div>
            <div className="font-bold mb-2">{against.name}</div>
            <div>{against.party}</div>
            <div>{against.description}</div>
          </div>

          <div
            className=" text-red cursor-pointer"
            onClick={() => {
              removeAgainst(index);
            }}
          >
            <FaTrash />
          </div>
        </div>
      ))}
      <TextField
        label="Name"
        fullWidth
        required
        value={state.newName}
        onChange={(e) => {
          onChangeField('newName', e.target.value);
        }}
      />
      <div className="mt-6">
        <Select
          native
          value={state.newParty}
          label="Opponent Party affiliation"
          fullWidth
          required
          variant="outlined"
          onChange={(e) => {
            onChangeField('newParty', e.target.value);
          }}
        >
          <option value="">Select Opponent Party</option>
          {partyOptions.map((op) => (
            <option value={op} key={op}>
              {op}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-6">
        <TextField
          label="Describe them"
          placeholder="EXAMPLE: Republican hotel owner"
          multiline
          rows={6}
          fullWidth
          required
          value={state.newDesc}
          onChange={(e) => {
            onChangeField('newDesc', e.target.value);
          }}
        />
      </div>
      <div
        className="mt-4 underline text-blue-600 cursor-pointer"
        onClick={handleAddAnother}
      >
        Add Another
      </div>
      {smallButton ? (
        <div className="flex justify-end my-8">
          <div
            onClick={() => {
              if (canSave()) {
                handleSave(state);
              }
            }}
          >
            <PrimaryButton disabled={!canSave()}>
              <div>Save</div>
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <div className="flex justify-center  my-8">
          <BlackButtonClient onClick={save} disabled={!canSave() || saving}>
            <div>
              {shortVersion ? 'VIEW DASHBOARD' : 'GENERATE CAMPAIGN PLAN'}
            </div>
          </BlackButtonClient>
        </div>
      )}
    </div>
  );
}
