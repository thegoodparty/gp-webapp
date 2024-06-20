'use client';
import { useTopIssues } from './UseTopIssuesContext';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import React, { useState } from 'react';
import { SVGIconChooser } from './SVGIconChooser';
import TextField from '@shared/inputs/TextField';
import gpApi from '../../../../gpApi';
import gpFetch from '../../../../gpApi/gpFetch';
import { FaCaretDown, FaCaretRight } from 'react-icons/fa';
import PrimaryButton from '@shared/buttons/PrimaryButton';

export const createTopIssue = async (name, icon) => {
  const api = gpApi.admin.topIssues.create;
  const payload = {
    name,
    ...(icon ? { icon } : {}),
  };
  return await gpFetch(api, payload);
};
export const TopIssueCreator = ({}) => {
  const [topIssues, setTopIssues] = useTopIssues();
  const snackbarState = useHookstate(globalSnackbarState);
  const [addNewIssue, setAddNewIssue] = useState(false);
  const [topIssueName, setTopIssueName] = useState('');
  const [svgData, setSvgData] = useState(null);

  const handleCreate = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'creating issue',
        isError: false,
      };
    });
    setTopIssues([await createTopIssue(topIssueName, svgData), ...topIssues]);
    setAddNewIssue(false);
    setTopIssueName('');
  };

  return (
    <>
      <PrimaryButton
        onClick={() => {
          setAddNewIssue(!addNewIssue);
        }}
        className="font-black align-middle"
      >
        Add a Top Issue{' '}
        {addNewIssue ? (
          <FaCaretDown className="inline-block" />
        ) : (
          <FaCaretRight className="inline-block" />
        )}
      </PrimaryButton>

      {addNewIssue && (
        <div className="flex mt-4 items-center">
          <SVGIconChooser svgData={svgData} setSvgData={setSvgData} />
          <TextField
            className="mx-4"
            fullWidth
            primary
            label="Top Issue Name"
            value={topIssueName}
            onChange={(e) => setTopIssueName(e.target.value)}
          />
          <div className="text-right">
            <PrimaryButton
              disabled={topIssueName === ''}
              onClick={handleCreate}
              className="font-black"
            >
              Save
            </PrimaryButton>
          </div>
        </div>
      )}
    </>
  );
};
