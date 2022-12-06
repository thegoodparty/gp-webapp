'use client';
import AlertDialog from '@shared/utils/AlertDialog';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditableTopIssue from './EditableTopIssue';

const deleteCandidatePosition = async (id, candidateId) => {
  const api = gpApi.campaign.candidatePosition.delete;
  const payload = { id, candidateId };
  return await gpFetch(api, payload);
};

export default function TopIssue(props) {
  const { index, candidate, candidatePosition, updatePositionsCallback } =
    props;
  const [editMode, setEditMode] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const deleteIssue = async () => {
    await deleteCandidatePosition(candidatePosition.id, candidate.id);
    updatePositionsCallback();
    handleCloseAlert();
  };

  const handleCloseAlert = () => setShowDeleteAlert(false);

  if (editMode) {
    return (
      <EditableTopIssue
        existingIssue={candidatePosition}
        existingOrder={index + 1}
        closeEditModeCallback={() => setEditMode(false)}
        {...props}
      />
    );
  }
  return (
    <>
      <div className="col-span-1" data-cy="position-index">
        <span>{index + 1}.</span>
      </div>
      <div className="col-span-3 break-word" data-cy="position-issue-name">
        {candidatePosition.topIssue?.name}
      </div>
      <div className="col-span-3 break-word" data-cy="position-pos-name">
        {candidatePosition.position?.name}
      </div>
      <div className="col-span-3 break-word" data-cy="position-description">
        {candidatePosition.description}
      </div>

      <div className="col-span-2 flex">
        <FaEdit className="cursor-pointer" onClick={() => setEditMode(true)} />{' '}
        &nbsp; &nbsp; &nbsp;{' '}
        <FaTrash
          className="cursor-pointer"
          onClick={() => setShowDeleteAlert(true)}
        />
      </div>
      <AlertDialog
        open={showDeleteAlert}
        handleClose={handleCloseAlert}
        title={'Delete Policy Issue?'}
        ariaLabel={'Delete Policy Issue?'}
        description={'Are you sure you want to delete this issue?'}
        handleProceed={deleteIssue}
      />
    </>
  );
}
