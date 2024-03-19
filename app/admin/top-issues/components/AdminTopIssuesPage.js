'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import React, { useState } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import TextField from '@shared/inputs/TextField';
import TopIssuesList from './TopIssuesList';
import { SVGIconChooser } from '@shared/buttons/SVGIconChooser';

export const createTopIssue = async (name, icon) => {
  const api = gpApi.admin.topIssues.create;
  const payload = {
    name,
    ...(
      icon ? {icon} : {}
    )
  };
  return await gpFetch(api, payload);
};

export default function AdminTopIssuesPage({
  topIssues: initTopIssues = [], ...rest
}) {
  const [topIssues, setTopIssues] = useState(initTopIssues)
  const snackbarState = useHookstate(globalSnackbarState);
  const [addNewIssue, setAddNewIssue] = useState(true);
  const [topIssueName, setTopIssueName] = useState('');
  const [svgData, setSvgData] = useState(null)
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
      ...topIssues
    ])
    setAddNewIssue(false);
    setTopIssueName('');
  };

  return (
    <AdminWrapper {...rest}>
      <PortalPanel color="#2CCDB0">
        <BlackButtonClient
          onClick={() => {
            setAddNewIssue(true);
          }}
          className="font-black"
        >
          Add a Top Issue
        </BlackButtonClient>

        {addNewIssue && (
          <div  className="flex mt-4 items-center" >
            <SVGIconChooser {...{
              svgData,
              setSvgData
            }} />
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
        <br />
        <br />
        <br />
        <TopIssuesList {...{
          topIssues,
          setTopIssues
        }} />
      </PortalPanel>
    </AdminWrapper>
  );
}
