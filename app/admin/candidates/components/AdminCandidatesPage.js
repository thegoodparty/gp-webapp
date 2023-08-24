'use client';

import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { candidateRoute, partyResolver } from 'helpers/candidateHelper';
import { useMemo } from 'react';
import Table from '@shared/utils/Table';
import Link from 'next/link';
import { CSVLink } from 'react-csv';
import { IoIosPersonAdd } from 'react-icons/io';
import mapCampaignToCandidate from 'app/candidate/[slug]/edit/mapCampaignToCandidate';
import { dateUsHelper, dateWithTime } from 'helpers/dateHelper';
import Actions from './Actions';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import WarningButton from '@shared/buttons/WarningButton';
import { MdVisibilityOff } from 'react-icons/md';
import { BsFiletypeCsv } from 'react-icons/bs';

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

export default function AdminCandidatesPage(props) {
  const { campaigns } = props;
  const csvData = [
    [
      'id',
      'slug',
      'firstName',
      'lastName',
      'launched',
      'lastVisited',
      'party',
      'office',
      'city',
      'district',
      'state',
      'createdAt',
      'updatedAt',
      'email',
      'phone',
      'currentStep',
    ],
  ];

  const inputData = [];
  if (campaigns) {
    campaigns.map((campaignObj) => {
      const { data } = campaignObj;
      const campaign = mapCampaignToCandidate(data);
      const { user } = campaignObj;
      const { currentStep } = data || {};
      const fields = {
        id: campaignObj.id,
        slug: campaign.slug,
        firstName: campaign.firstName,
        lastName: campaign.lastName,
        launched: mapStatus(campaign.launchStatus),
        lastVisited: campaign.lastVisited,
        party: partyResolver(campaign.party),
        office:
          campaign.office === 'Other' ? campaign.otherOffice : campaign.office,
        city: campaign.city,
        district: campaign.district || 'n/a',
        state: campaign.state ? campaign.state.toUpperCase() : '?',
        createdAt: new Date(campaignObj.createdAt),
        updatedAt: new Date(campaignObj.updatedAt),
        email: user?.email || 'n/a',
        phone: user?.phone || 'n/a',
        currentStep,
      };
      inputData.push(fields);
      console.log('Object.values(fields)', Object.values(fields));
      csvData.push(Object.values(fields));
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
      Header: 'Profile',
      accessor: 'slug',
      Cell: ({ row }) => {
        const route = candidateRoute(row.original);
        return (
          <a
            href={route}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="underline"
          >
            {row.original.slug}
          </a>
        );
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
      Header: 'Launch Status',
      accessor: 'launched',
    },
    {
      Header: 'Path to Victory',
      accessor: 'victoryPath',
      Cell: ({ row }) => {
        return (
          <a
            href={`/admin/victory-path/${row.original.slug}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="underline"
          >
            Path to victory
          </a>
        );
      },
    },
    {
      Header: 'Review Link',
      accessor: 'reviewLink',
      Cell: ({ row }) => {
        const status = row.original.launched;
        if (status === 'Pending Review') {
          const route = `${candidateRoute(row.original)}/review`;
          return (
            <a
              href={route}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline"
            >
              Pending Review
            </a>
          );
        }
        return <span>n/a</span>;
      },
    },
    {
      Header: 'Onboarding Step',
      accessor: 'currentStep',
    },
    {
      Header: 'Last Visit',
      accessor: 'lastVisited',
      Cell: ({ row }) => {
        return row.original.lastVisited
          ? dateWithTime(row.original.lastVisited)
          : 'n/a';
      },
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
    {
      Header: 'Office',
      accessor: 'office',
    },
    {
      Header: 'District',
      accessor: 'district',
    },
    {
      Header: 'City',
      accessor: 'city',
    },
    {
      Header: 'State',
      accessor: 'state',
      collapse: true,
    },
    {
      Header: 'Email',
      accessor: 'email',
      Cell: ({ row }) => {
        return (
          <a href={`mailto:${row.original.email}`} className="underline">
            {row.original.email}
          </a>
        );
      },
    },
    {
      Header: 'Phone',
      accessor: 'phone',
      collapse: true,
    },
  ]);

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <div className="text-right">
          <Link href="/admin/add-candidate">
            <PrimaryButton size="medium">
              <div className="font-black flex items-center">
                <IoIosPersonAdd size={24} />{' '}
                <div className="ml-1"> Add a candidate</div>
              </div>
            </PrimaryButton>
          </Link>
          <Link href="/admin/all-candidates" className="mx-3">
            <WarningButton size="medium">
              <div className="font-black flex items-center">
                <MdVisibilityOff size={24} />{' '}
                <div className="ml-1">All candidates</div>
              </div>
            </WarningButton>
          </Link>
          <CSVLink
            data={csvData}
            filename={`candidates-${dateUsHelper(new Date())}.csv`}
          >
            <PrimaryButton size="medium">
              <div className="font-black flex items-center">
                <BsFiletypeCsv size={24} />
              </div>
            </PrimaryButton>
          </CSVLink>
        </div>
        <Table columns={columns} data={data} />
      </PortalPanel>
    </AdminWrapper>
  );
}
