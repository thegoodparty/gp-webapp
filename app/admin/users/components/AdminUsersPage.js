'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import Tooltip from '@mui/material/Tooltip';
import Table from 'app/admin/candidates/components/Table';
import { useMemo } from 'react';
import { formatToPhone } from 'helpers/numberHelper';

export default function AdminUsersPage(props) {
  const { users } = props;

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
    </AdminWrapper>
  );
}
