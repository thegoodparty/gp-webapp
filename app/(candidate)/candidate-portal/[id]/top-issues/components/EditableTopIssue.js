'use client';

import React, { useState, useContext, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { FaSave } from 'react-icons/fa';
import TextField from '@shared/inputs/TextField';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';

const saveIssueCallback = () => {};
const updateIssueCallback = async (
  id,
  topIssueId,
  positionId,
  description,
  candidateId,
) => {
  const api = gpApi.campaign.candidatePosition.update;
  const payload = { id, topIssueId, positionId, description, candidateId };
  return await gpFetch(api, payload);
};

function EditableTopIssue({
  existingIssue,
  existingOrder,
  closeEditModeCallback,
  candidatePositions,
  topIssues,
  candidate,
  updatePositionsCallback,
}) {
  const order = existingOrder
    ? existingOrder
    : candidatePositions?.length + 1 || 1;

  const [state, setState] = useState({
    topic: existingIssue ? existingIssue.topIssue : '',
    position: existingIssue ? existingIssue.position : '',
    description: existingIssue ? existingIssue.description : '',
  });

  const [availableIssues, setAvailableIssues] = useState(topIssues);

  useEffect(() => {
    if (candidatePositions?.length > 0) {
      if (candidatePositions.length === topIssues.length) {
        setAvailableIssues([]);
      } else {
        const topIssuesById = {};
        topIssues.forEach((issue) => {
          topIssuesById[issue.id] = issue;
        });
        candidatePositions.forEach((position) => {
          delete topIssuesById[position.topIssue?.id];
        });

        setAvailableIssues(Object.values(topIssuesById));
      }
    } else if (topIssues) {
      setAvailableIssues(topIssues);
    }
  }, [candidatePositions, topIssues]);

  const save = () => {
    if (existingIssue) {
      updateIssueCallback(
        existingIssue.id,
        state.topic.id,
        state.position.id,
        state.description,
        candidate.id,
      );
      updatePositionsCallback();
      closeEditModeCallback();
    } else {
      saveIssueCallback(
        state.topic.id,
        state.position.id,
        state.description,
        candidate.id,
        order,
      );

      setState({
        topic: '',
        position: '',
        description: '',
      });
    }
  };

  const canSubmit = () =>
    state.topic !== '' && state.position !== '' && state.description !== '';

  const onChangeField = (value, key) => {
    const updatedState = {
      ...state,
      [key]: value,
    };
    if (key === 'topic') {
      updatedState.position = '';
    }
    setState(updatedState);
  };
  return (
    <>
      <div className="col-span-1">
        <span>{order}.</span>
      </div>
      <div className="col-span-3">
        <Autocomplete
          options={availableIssues}
          value={state.topic}
          getOptionLabel={(item) => item?.name}
          fullWidth
          renderInput={(params) => (
            <TextField {...params} label="Topic" variant="outlined" />
          )}
          onChange={(event, item) => {
            onChangeField(item, 'topic');
          }}
        />
      </div>
      <div className="col-span-3">
        <Autocomplete
          options={state.topic?.positions || []}
          value={state.position}
          getOptionLabel={(item) => item.name}
          fullWidth
          renderInput={(params) => (
            <TextField {...params} label="Position" variant="outlined" />
          )}
          onChange={(event, item) => {
            onChangeField(item, 'position');
          }}
        />
      </div>
      <div className="col-span-3">
        <TextField
          fullWidth
          primary
          label="Description"
          name="Description"
          value={state.description}
          onChange={(e) => {
            onChangeField(e.target.value, 'description');
          }}
        />
      </div>

      <div className="col-span-2">
        <BlackButtonClient onClick={save} disabled={!canSubmit()} fullWidth>
          <div className="flex text-sm items-center font-black">
            <FaSave /> &nbsp; {existingIssue ? 'UPDATE' : 'SAVE'}
          </div>
        </BlackButtonClient>
      </div>
    </>
  );
}

export default EditableTopIssue;
