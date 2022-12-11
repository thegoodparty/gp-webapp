'use client';

import { GoTrashcan } from 'react-icons/go';

import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { candidateRoute, partyResolver } from 'helpers/candidateHelper';
import { useMemo } from 'react';
import Table from './Table';
import Link from 'next/link';

const headerStyle = {
  fontWeight: 700,
  fontSize: '1.05em',
};

export default function AdminCandidatesPage(props) {
  const { candidates } = props;
  const inputData = [];
  candidates.map((candidate) => {
    const fields = {
      active: candidate.isActive ? 'Yes' : 'No',
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      party: partyResolver(candidate.party),
      chamber: candidate.chamber,
      office: candidate.race,
      state: candidate.state ? candidate.state.toUpperCase() : '?',
    };
    inputData.push(fields);
  });
  const data = useMemo(() => inputData);

  let str;
  let rowVal;
  let columnName;
  const customFilter = (query, row, column) => {
    str = query.value;
    columnName = query.id || column.Header.toLocaleLowerCase();
    rowVal = row._original[columnName];
    if (typeof str !== 'string') {
      str += '';
    }
    str = str.toLocaleLowerCase();
    if (typeof rowVal !== 'string') {
      rowVal += '';
    }
    rowVal = rowVal.toLocaleLowerCase();
    return rowVal.includes(str);
  };

  const columns = useMemo(() => [
    {
      Header: 'Id',
      accessor: 'id',
      collapse: true,
    },
    {
      Header: 'Active?',
      accessor: 'active',
      collapse: true,
    },
    {
      Header: 'First Name',
      accessor: 'firstName',
      Cell: ({ row }) => {
        const route = candidateRoute(row.original);
        return (
          <a
            href={route}
            target="_blank"
            rel="noopener noreferrer nofollow"
            style={{
              textDecoration: row.original.isHidden ? 'line-through' : '',
            }}
          >
            {row.original.firstName}
          </a>
        );
      },
    },
    {
      Header: 'Last Name',
      accessor: 'lastName',
    },
    {
      Header: 'Party',
      accessor: 'party',
    },
    {
      Header: 'Office',
      accessor: 'office',
    },
    {
      Header: 'State',
      accessor: 'state',
      collapse: true,
    },

    {
      Header: 'Delete',
      collapse: true,
      accessor: 'name',
      Cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <GoTrashcan
              onClick={() => {
                handleDeleteCandidate(row.original.id);
              }}
              style={{ color: 'red', cursor: 'pointer' }}
            />
          </div>
        );
      },
    },

    {
      Header: 'Portal',
      accessor: 'portal',
      headerStyle,
      Cell: ({ row }) => {
        const route = `/candidate-portal/${row.original.id}`;
        return (
          <div className="text-center">
            <Link href={route} className="underline">
              Candidate Portal
            </Link>
          </div>
        );
      },
    },
  ]);

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <Table columns={columns} data={data} />
      </PortalPanel>
    </AdminWrapper>
  );
}
