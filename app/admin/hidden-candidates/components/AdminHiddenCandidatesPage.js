'use client';

import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { candidateRoute, partyResolver } from 'helpers/candidateHelper';
import { useMemo } from 'react';
import Link from 'next/link';
import { IoIosPersonAdd } from 'react-icons/io';
import mapCampaignToCandidate from 'app/candidate/[slug]/edit/mapCampaignToCandidate';
import { dateUsHelper, dateWithTime } from 'helpers/dateHelper';
import Actions from './Actions';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import WarningButton from '@shared/buttons/WarningButton';
import { MdVisibilityOff } from 'react-icons/md';
import Table from 'app/admin/candidates/components/Table';

function mapStatus(status, isActive) {
  if (!status) {
    return 'No (Onboarding)';
  }
  if (status === 'launched') {
    return 'Live';
  }
  if (status === 'pending') {
    return 'Pending Review';
  }
  return 'No';
}

export default function AdminHiddenCandidatesPage(props) {
  const { candidates } = props;

  const inputData = [];
  if (candidates) {
    candidates.map((candidateObj) => {
      const { data, createdAt, updatedAt } = candidateObj;
      const candidate = JSON.parse(data);
      const { currentStep } = data || {};
      const fields = {
        id: candidateObj.id,
        slug: candidate.slug,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        party: partyResolver(candidate.party),
        createdAt,
        updatedAt,
      };
      inputData.push(fields);
    });
  }
  const data = useMemo(() => inputData);

  const columns = useMemo(() => [
    {
      Header: 'Actions',
      collapse: true,
      accessor: 'actions',
      Cell: ({ row }) => {
        return <Actions {...row.original} />;
      },
    },

    {
      Header: 'Slug',
      accessor: 'slug',
    },
    {
      Header: 'First Name',
      accessor: 'firstName',
    },
    {
      Header: 'Last Name',
      accessor: 'lastName',
    },

    {
      Header: 'Date Created',
      accessor: 'createdAt',
      sortType: 'datetime',
      Cell: ({ row }) => {
        return dateUsHelper(row.original.createdAt);
      },
    },
    {
      Header: 'Last Update',
      accessor: 'updatedAt',
      sortType: 'datetime',
      Cell: ({ row }) => {
        return dateUsHelper(row.original.updatedAt);
      },
    },

    {
      Header: 'Party',
      accessor: 'party',
    },
  ]);

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <div className="text-right">
          <Link href="/admin/candidates">
            <WarningButton>
              <div className="font-black flex items-center">
                <MdVisibilityOff size={24} />{' '}
                <div className="ml-1">Back to candidates</div>
              </div>
            </WarningButton>
          </Link>
        </div>
        <Table columns={columns} data={data} />
      </PortalPanel>
    </AdminWrapper>
  );
}
