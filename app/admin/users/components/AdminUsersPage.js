'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import Tooltip from '@mui/material/Tooltip';
import Table from 'app/admin/candidates/components/Table';
import { useMemo, useState } from 'react';
import { formatToPhone } from 'helpers/numberHelper';
import gpApi, { isProd } from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import AlertDialog from '@shared/utils/AlertDialog';
import { FaTrash } from 'react-icons/fa';

import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

export const deleteUserCallback = async (id) => {
  const api = gpApi.admin.deleteUser;
  const payload = { id };
  return await gpFetch(api, payload);
};

export default function AdminUsersPage(props) {
  const { users } = props;
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const snackbarState = useHookstate(globalSnackbarState);

  const handleDeleteUser = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Deleting User...',
        isError: false,
      };
    });
    await deleteUserCallback(selectedUser);
    setShowDeleteAlert(false);
    window.location.reload();
  };
  const handleOpenAlert = (user) => {
    setSelectedUser(user);
    setShowDeleteAlert(true);
  };

  const handleCloseAlert = () => setShowDeleteAlert(false);

  const inputData = [];

  users.map((user) => {
    const fields = {
      ...user,
      isAdmin: user.isAdmin ? 'admin' : user.candidate ? 'candidate' : 'no',
    };

    inputData.push(fields);
  });

  const data = useMemo(() => inputData);

  let columns = useMemo(() => [
    {
      Header: 'Id',
      accessor: 'id',

      collapse: true,
    },
    {
      Header: 'Delete',
      collapse: true,
      Cell: ({ row }) => (
        <div className="text-center text-red-600 cursor-pointer">
          {isProd ? (
            'Disabled'
          ) : (
            <FaTrash
              size={24}
              onClick={() => handleOpenAlert(row.original.id)}
            />
          )}
        </div>
      ),
    },
    {
      Header: 'Name',
      accessor: 'name',
    },

    {
      Header: 'Email',
      accessor: 'email',

      Cell: ({ row }) => (
        <Tooltip title={row.original.email}>
          <a href={`mailto:${row.original.email}`}>{row.original.email}</a>
        </Tooltip>
      ),
    },

    {
      Header: 'Phone',
      accessor: 'phone',

      Cell: ({ row }) => (
        <Tooltip title={row.original.phone}>
          <a href={`tel:${row.original.phone}`}>
            {formatToPhone(row.original.phone)}
          </a>
        </Tooltip>
      ),
    },

    {
      Header: 'Zip',
      accessor: 'zip',
    },

    {
      Header: 'Admin?',
      accessor: 'isAdmin',

      collapse: true,
    },
  ]);

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <Table
          data={data}
          columns={columns}
          defaultPageSize={25}
          showPagination
          filterable
        />
      </PortalPanel>
      {!isProd && (
        <AlertDialog
          open={showDeleteAlert}
          handleClose={handleCloseAlert}
          title={'Delete User'}
          ariaLabel={'Delete User'}
          description={'Are you sure you want to delete the user?'}
          handleProceed={handleDeleteUser}
        />
      )}
    </AdminWrapper>
  );
}
