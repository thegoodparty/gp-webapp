'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import Tooltip from '@mui/material/Tooltip';
import Table from '@shared/utils/Table';
import { useMemo, useState } from 'react';
import { formatToPhone } from 'helpers/numberHelper';
import gpApi, { isProd } from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import AlertDialog from '@shared/utils/AlertDialog';
import { FaTrash } from 'react-icons/fa';

import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import TextField from '@shared/inputs/TextField';
import TopIssuesList from './TopIssuesList';

export const createTopIssue = async (name) => {
  const api = gpApi.admin.topIssues.create;
  const payload = { name };
  return await gpFetch(api, payload);
};

export default function AdminTopIssuesPage(props) {
  const snackbarState = useHookstate(globalSnackbarState);

  const [addNewIssue, setAddNewIssue] = useState(false);
  const [topIssueName, setTopIssueName] = useState('');
  const handleCreate = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'creating issue',
        isError: false,
      };
    });
    await createTopIssue(topIssueName);
    setAddNewIssue(false);
    setTopIssueName('');
    window.location.reload();
  };

  return (
    <AdminWrapper {...props}>
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
          <div>
            <br />
            <br />
            <TextField
              fullWidth
              primary
              label="Top Issue Name"
              value={topIssueName}
              onChange={(e) => setTopIssueName(e.target.value)}
            />
            <br />
            <br />
            <div className="text-right">
              <BlackButtonClient
                disabled={topIssueName === ''}
                onClick={handleCreate}
                className="font-black"
              >
                <strong>Save New Top Issue</strong>
              </BlackButtonClient>
            </div>
          </div>
        )}
        <br />
        <br />
        <br />
        <TopIssuesList {...props} />
      </PortalPanel>
    </AdminWrapper>
  );
}
