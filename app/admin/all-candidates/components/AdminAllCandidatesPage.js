'use client';

import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { partyResolver } from 'helpers/candidateHelper';
import { useMemo } from 'react';
import Link from 'next/link';
import Actions from './Actions';
import WarningButton from '@shared/buttons/WarningButton';
import Table from '@shared/utils/Table';

export default function AdminAllCandidatesPage(props) {
  const { candidates } = props;
  console.log('candidates', candidates);

  const inputData = [];
  if (candidates) {
    candidates.map((candidateObj) => {
      const { data, isActive } = candidateObj;
      const candidate = JSON.parse(data);
      const fields = {
        id: candidateObj.id,
        isActive: candidateObj.isActive,
        slug: candidate.slug,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        party: partyResolver(candidate.party),
        campaignOnboardingSlug: candidate.campaignOnboardingSlug,
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
      Header: 'Is Active',
      accessor: 'isActive',
      Cell: ({ row }) => {
        return <div>{row.original.isActive ? 'yes' : 'no'}</div>;
      },
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
      Header: 'Campaign Slug',
      accessor: 'campaignOnboardingSlug',
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
