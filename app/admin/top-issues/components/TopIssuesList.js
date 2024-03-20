'use client';

import React, { useState } from 'react';
import { BsArrowRightShort } from 'react-icons/bs';
import { FaCaretDown, FaCaretRight, FaEdit, FaTrash } from 'react-icons/fa';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import TextField from '@shared/inputs/TextField';
import AlertDialog from '@shared/utils/AlertDialog';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { TopIssueDisplay } from './TopIssueDisplay';
import { useTopIssues } from './UseTopIssuesContext';
import PrimaryButton from '@shared/buttons/PrimaryButton';

const createPositionCallback = async (name, topIssueId) => {
  const api = gpApi.admin.position.create;
  const payload = { name, topIssueId };
  return await gpFetch(api, payload);
};

const deletePositionCallback = async (id) => {
  const api = gpApi.admin.position.delete;
  const payload = { id };
  return await gpFetch(api, payload);
};

const deleteTopIssueCallback = async (id) => {
  const api = gpApi.admin.topIssues.delete;
  const payload = { id };
  return await gpFetch(api, payload);
};

const editPositionCallback = async (id, name) => {
  const api = gpApi.admin.position.update;
  const payload = { id, name };
  return await gpFetch(api, payload);
};

export const updateTopIssue = async (issue) => {
  return await gpFetch(gpApi.admin.topIssues.update, issue);
}

export default function TopIssuesList() {
  const [topIssues, setTopIssues] = useTopIssues()
  const [addNewPosition, setAddNewPosition] = useState(false);
  const [editPosition, setEditPosition] = useState(false);
  const [positionName, setPositionName] = useState('');
  const [showPositionDeleteAlert, setShowPositionDeleteAlert] = useState(false);
  const [showIssueDeleteAlert, setShowIssueDeleteAlert] = useState(false);

  const snackbarState = useHookstate(globalSnackbarState);
  const savePosition = async (id) => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saving...',
        isError: false,
      };
    });
    await createPositionCallback(positionName, id);
    setAddNewPosition(false);
    setPositionName('');
    window.location.reload();
  };

  const savePositionEdit = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saving...',
        isError: false,
      };
    });
    await editPositionCallback(editPosition.id, editPosition.name);
    setEditPosition(false);
    window.location.reload();
  };

  const handleDeletePosition = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Deleting...',
        isError: false,
      };
    });
    await deletePositionCallback(showPositionDeleteAlert);
    setShowPositionDeleteAlert(false);
    window.location.reload();
  };

  const handleDeleteIssue = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Deleting...',
        isError: false,
      };
    });
    await deleteTopIssueCallback(showIssueDeleteAlert);
    setTopIssues(topIssues.filter(({id}) => id !== showIssueDeleteAlert))
    setShowIssueDeleteAlert(false);
  };

  return (
    <div>
      {
        topIssues.map((issue) => (
          <div className="py-3 mb-3 border-t border-t-stone-500" key={issue.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TopIssueDisplay issue={issue} />
              </div>
              <div className="flex items-center">
                <PrimaryButton
                  onClick={() => {
                    setAddNewPosition(addNewPosition ? false : issue.id);
                  }}
                >
                  Add a position for {issue.name}&nbsp;{
                    addNewPosition ?
                      <FaCaretDown className="inline-block" /> :
                      <FaCaretRight className="inline-block" />
                  }
                </PrimaryButton>{' '}
                <div
                  className="text-red-600 inline-block ml-4 bg-stone-300 rounded-full p-4 w-12 h-12 text-center cursor-pointer"
                  onClick={() => {
                    setShowIssueDeleteAlert(issue.id);
                  }}
                >
                  <FaTrash />
                </div>
              </div>
            </div>
            {addNewPosition === issue.id && (
              <div>
                <br />
                <br />
                <TextField
                  fullWidth
                  primary
                  label="Position Name"
                  value={positionName}
                  onChange={(e) => setPositionName(e.target.value)}
                />
                <br />
                <br />
                <div className="text-right">
                  <BlackButtonClient
                    disabled={positionName === ''}
                    onClick={() => {
                      savePosition(issue.id);
                    }}
                  >
                    Save New Position
                  </BlackButtonClient>
                </div>
              </div>
            )}
            {issue.positions?.length > 0 && (
              <div>
                <br />
                <u>Positions:</u>
              </div>
            )}
            {issue.positions?.map((position) => (
              <div className="py-3 pb-6" key={position.id}>
                <BsArrowRightShort className="inline-block" /> &nbsp; &nbsp;
                {editPosition && editPosition.id === position.id ? (
                  <div className="inline-block">
                    <TextField
                      primary
                      label="Edit Position"
                      variant="outlined"
                      value={editPosition.name}
                      onChange={(e) =>
                        setEditPosition({
                          ...editPosition,
                          name: e.target.value,
                        })
                      }
                    />
                    &nbsp; &nbsp;
                    <BlackButtonClient
                      onClick={savePositionEdit}>Save</BlackButtonClient>
                  </div>
                ) : (
                  <>
                    {position.name}
                    <div
                      onClick={() => {
                        setShowPositionDeleteAlert(position.id);
                      }}
                      className="text-red-600 inline-flex ml-4 bg-stone-300 rounded-full p-1  items-center justify-center w-6 h-6 text-xs text-center cursor-pointer"
                    >
                      <FaTrash />
                    </div>
                    <div
                      className="text-red-600 inline-flex ml-4 bg-stone-300 rounded-full p-1  items-center justify-center w-6 h-6 text-xs text-center cursor-pointer"
                      onClick={() => {
                        setEditPosition(position);
                      }}
                    >
                      <FaEdit />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))
      }
      <AlertDialog
        open={showPositionDeleteAlert}
        handleClose={() => setShowPositionDeleteAlert(false)}
        title={'Delete Position?'}
        ariaLabel={'Delete Position?'}
        description={'Are you sure you want to delete this position?'}
        handleProceed={handleDeletePosition}
      />
      <AlertDialog
        open={showIssueDeleteAlert}
        handleClose={() => setShowIssueDeleteAlert(false)}
        title={'Delete Issue?'}
        ariaLabel={'Delete Issue?'}
        description={
          'This will delete all the positions and candidate positions related to this issue'
        }
        handleProceed={handleDeleteIssue}
      />
    </div>
  );
}
