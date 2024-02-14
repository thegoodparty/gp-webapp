'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import Tooltip from '@mui/material/Tooltip';
import Table from '@shared/utils/Table';

import { useMemo } from 'react';
import { formatToPhone } from 'helpers/numberHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

import { dateUsHelper, dateWithTime } from 'helpers/dateHelper';
import Actions from './Actions';

export const deleteUserCallback = async (id) => {
  const api = gpApi.admin.deleteUser;
  const payload = { id };
  return await gpFetch(api, payload);
};

export default function AdminUsersPage(props) {
  const users = props.users || [];

  const inputData = [];

  users.map((user) => {
    let metaData = user.metaData;
    if (metaData) {
      metaData = JSON.parse(metaData);
    }
    const fields = {
      ...user,
      userType: user.isAdmin ? 'admin' : user.candidate ? 'candidate' : 'user',
      lastVisited: new Date(metaData?.lastVisited),
      createdAt: new Date(user.createdAt),
    };

    inputData.push(fields);
  });

  const data = useMemo(() => inputData);

  let columns = useMemo(() => [
    {
      Header: 'Actions',
      collapse: true,
      accessor: 'actions',
      Cell: ({ row }) => {
        return <Actions {...row.original} />;
      },
    },

    {
      Header: 'Name',
      accessor: 'name',
      Cell: ({ row }) => {
        return (
          <>
            {row.original.firstName} {row.original.lastName}
          </>
        );
      },
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
      Header: 'Last Visit',
      accessor: 'lastVisited',
      sortType: 'datetime',
      Cell: ({ row }) => {
        return row.original.lastVisited &&
          row.original.lastVisited?.toString() !== 'Invalid Date'
          ? dateWithTime(row.original.lastVisited)
          : 'n/a';
      },
    },

    {
      Header: 'Date Created',
      accessor: 'createdAt',
      sortType: 'datetime',
      Cell: ({ row }) => {
        return row.original.createdAt?.toString() !== 'Invalid Date'
          ? dateUsHelper(row.original.createdAt)
          : 'n/a';
      },
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
      Header: 'User Type',
      accessor: 'userType',

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
    </AdminWrapper>
  );
}
