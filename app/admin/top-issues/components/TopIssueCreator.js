import { useTopIssues } from './UseTopIssuesContext';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import React, { useState } from 'react';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { SVGIconChooser } from '@shared/buttons/SVGIconChooser';
import TextField from '@shared/inputs/TextField';
import gpApi from '../../../../gpApi';
import gpFetch from '../../../../gpApi/gpFetch';

export const createTopIssue = async (name, icon) => {
  const api = gpApi.admin.topIssues.create;
  const payload = {
    name,
    ...(
      icon ? { icon } : {}
    ),
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
    setTopIssues([
      await createTopIssue(topIssueName, svgData),
      ...topIssues,
    ]);
    setAddNewIssue(false);
    setTopIssueName('');
  };

  return <>
    <BlackButtonClient
      onClick={() => {
        setAddNewIssue(true);
      }}
      className="font-black"
    >
      Add a Top Issue
    </BlackButtonClient>

    {addNewIssue && (
      <div className="flex mt-4 items-center">
        <SVGIconChooser
          svgData={svgData}
          setSvgData={setSvgData} />
        <TextField
          className="mx-4"
          fullWidth
          primary
          label="Top Issue Name"
          value={topIssueName}
          onChange={(e) => setTopIssueName(e.target.value)}
        />
        <div className="text-right">
          <BlackButtonClient
            disabled={topIssueName === ''}
            onClick={handleCreate}
            className="font-black"
          >
            <strong>Save</strong>
          </BlackButtonClient>
        </div>
      </div>
    )}
  </>;
};
