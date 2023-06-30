'use client';

import { GoTrashcan } from 'react-icons/go';

import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { candidateRoute, partyResolver } from 'helpers/candidateHelper';
import { useMemo, useState } from 'react';
import Table from './Table';
import Link from 'next/link';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import AlertDialog from '@shared/utils/AlertDialog';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { IoIosPersonAdd } from 'react-icons/io';

export const deleteCandidate = async (id) => {
  const api = gpApi.admin.deleteCandidate;
  const payload = { id };
  return await gpFetch(api, payload);
};

export default function AdminCandidatesPage(props) {
  const { candidates } = props;
  const snackbarState = useHookstate(globalSnackbarState);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(false);

  const inputData = [];
  if (candidates) {
    candidates.map((candidate) => {
      const fields = {
        active: candidate.isActive ? 'Yes' : 'No',
        id: candidate.id,
        slug: candidate.slug,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        party: partyResolver(candidate.party),
        chamber: candidate.chamber,
        office: candidate.race,
        state: candidate.state ? candidate.state.toUpperCase() : '?',
      };
      inputData.push(fields);
    });
  }
  const data = useMemo(() => inputData);

  const handleDeleteCandidate = (id) => {
    setCandidateToDelete(id);
    setShowDeleteAlert(true);
  };

  const handleProceedDelete = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Deleting candidate...',
        isError: false,
      };
    });
    await deleteCandidate(candidateToDelete);
    window.location.reload();
  };

  const handleCloseAlert = () => {
    setCandidateToDelete(false);
    setShowDeleteAlert(false);
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
  ]);

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <div className="text-right">
          <Link href="/admin/add-candidate">
            <BlackButtonClient>
              <div className="font-black flex items-center">
                <IoIosPersonAdd size={24} />{' '}
                <div className="ml-1"> Add a candidate</div>
              </div>
            </BlackButtonClient>
          </Link>
        </div>
        <Table columns={columns} data={data} />
      </PortalPanel>
      <AlertDialog
        title="Delete Candidate?"
        description="This can't be undone, and you will have to deal with it in your afterlife"
        open={showDeleteAlert}
        handleClose={handleCloseAlert}
        handleProceed={handleProceedDelete}
      />
    </AdminWrapper>
  );
}
