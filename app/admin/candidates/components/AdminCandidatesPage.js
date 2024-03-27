'use client';

import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { candidateRoute, partyResolver } from 'helpers/candidateHelper';
import { useMemo } from 'react';
import Table from '@shared/utils/Table';
import Link from 'next/link';
import { CSVLink } from 'react-csv';
import { IoIosPersonAdd } from 'react-icons/io';
import mapCampaignToCandidate from './mapCampaignToCandidate';
import { dateUsHelper, dateWithTime } from 'helpers/dateHelper';
import Actions from './Actions';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import WarningButton from '@shared/buttons/WarningButton';
import { MdVisibilityOff } from 'react-icons/md';
import { BsFiletypeCsv } from 'react-icons/bs';
import { formatToPhone } from 'helpers/numberHelper';
import { dateColumnSort } from 'helpers/dateColumnSort';

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
      'isActive',
      'slug',
      'firstName',
      'lastName',
      'userName',
      'launched',
      'lastVisited',
      'party',
      'office',
      'officeTermLength',
      'city',
      'district',
      'state',
      'createdAt',
      'updatedAt',
      'email',
      'phone',
      'currentStep',
      'shortVersion',
      'campaignCommittee',
      'electionDate',
      'doorKnocking',
      'calls',
      'digital',
      'aiDocsCreated',
      'waitingForP2v',
      'pledged',
      'knowRun',
    ],
  ];

  const inputData = [];
  if (campaigns) {
    campaigns.map((campaignObj) => {
      const { data } = campaignObj;
      const campaign = mapCampaignToCandidate(data);
      const { user, isPro, isVerified, didWin } = campaignObj;
      const { currentStep, reportedVoterGoals, aiContent } = data || {};

      let waitingForP2v =
        !data?.p2vStatus || data?.p2vStatus === 'Waiting' ? 'yes' : 'no';

      if (!data?.details?.pledged) {
        waitingForP2v = 'n/a';
      }

      if (data.p2vNotNeeded) {
        waitingForP2v = 'Not Needed';
      }

      let runningForOffice = 'Exploring';
      if (data?.details?.knowRun && data.details.knowRun === 'yes') {
        runningForOffice = 'yes';
      } else if (
        data?.details?.runForOffice &&
        data.details.runForOffice === 'yes'
      ) {
        runningForOffice = 'yes';
      }

      const fields = {
        id: campaignObj.id,
        isActive: campaignObj.isActive ? 'yes' : 'no',
        slug: campaign.slug,
        firstName: user?.firstName ? user.firstName : user?.name || 'n/a',
        lastName: user?.lastName ? user.lastName : 'n/a',
        userName: `${user?.firstName} ${user?.lastName}`,
        launched: mapStatus(campaign.launchStatus),
        lastVisited: campaign.lastVisited,
        party: partyResolver(campaign.party),
        office:
          campaign.office === 'Other' ? campaign.otherOffice : campaign.office,
        officeTermLength: campaign.officeTermLength,
        city: campaign.city,
        district: campaign.district || 'n/a',
        state: campaign.state ? campaign.state.toUpperCase() : '?',
        createdAt: new Date(campaignObj.createdAt),
        updatedAt: new Date(campaignObj.updatedAt),
        email: user?.email || 'n/a',
        phone: user?.phone || 'n/a',
        currentStep,
        shortVersion: campaign.filedStatement,
        campaignCommittee: campaign.campaignCommittee,
        electionDate: campaign.electionDate,
        doorKnocking: reportedVoterGoals?.doorKnocking || 0,
        calls: reportedVoterGoals?.calls || 0,
        digital: reportedVoterGoals?.digital || 0,
        aiDocsCreated: aiContent ? Object.keys(aiContent).length : 0,
        waitingForP2v,
        pledged: campaign?.pledged && campaign.pledged === true ? 'yes' : 'no',
        knowRun: runningForOffice,
        isPro: isPro ? 'yes' : 'no',
        isVerified: isVerified ? 'yes' : 'no',
        didWin: didWin ? 'yes' : 'no',
      };
      inputData.push(fields);
      let csvFields = fields;
      csvFields.lastVisited = dateUsHelper(fields.lastVisited);
      csvFields.createdAt = dateUsHelper(fields.createdAt);
      csvFields.updatedAt = dateUsHelper(fields.updatedAt);
      csvData.push(Object.values(csvFields));
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
    // todo - remove later
    {
      Header: 'User Name',
      accessor: 'userName',
    },
    {
      Header: 'Launch Status',
      accessor: 'launched',
    },
    {
      Header: 'Active (Live)',
      accessor: 'isActive',
    },
    {
      Header: 'Waiting for P2V',
      accessor: 'waitingForP2v',
    },
    {
      Header: 'Running',
      accessor: 'knowRun',
    },
    {
      Header: 'Path to Victory',
      accessor: 'victoryPath',
      Cell: ({ row }) => {
        return (
          <Link
            href={`/admin/victory-path/${row.original.slug}`}
            className="underline"
          >
            Path to victory
          </Link>
        );
      },
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
      Header: 'Metrics',
      accessor: 'metrics',
      Cell: ({ row }) => {
        return (
          <a
            href={`/admin/candidate-metrics/${row.original.slug}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="underline"
          >
            Candidate Metrics
          </a>
        );
      },
    },
    {
      Header: 'Is Pro?',
      accessor: 'isPro',
    },
    {
      Header: 'Is Verified?',
      accessor: 'isVerified',
    },
    {
      Header: 'Did Win?',
      accessor: 'didWin',
    },
    {
      Header: 'Door Knocked',
      accessor: 'doorKnocking',
    },
    {
      Header: 'Calls Made',
      accessor: 'calls',
    },
    {
      Header: 'Online Impressions',
      accessor: 'digital',
    },
    {
      Header: 'AI Docs Created',
      accessor: 'aiDocsCreated',
    },

    {
      Header: 'Phone',
      accessor: 'phone',
      collapse: true,
      Cell: ({ row }) => {
        if (row.original.phone === 'n/a') {
          return 'n/a';
        }
        return (
          <a href={`tel:${row.original.phone}`} className="underline">
            {formatToPhone(row.original.phone)}
          </a>
        );
      },
    },
    {
      Header: 'Onboarding Step',
      accessor: 'currentStep',
    },
    {
      Header: 'Last Visit',
      accessor: 'lastVisited',
      sortDescFirst: true,
      sortType: (rowA, rowB) =>
        dateColumnSort(rowA.original.lastVisited, rowB.original.lastVisited),
      Cell: ({ row }) => {
        return row.original.lastVisited
          ? dateWithTime(row.original.lastVisited)
          : 'n/a';
      },
    },
    {
      Header: 'Date Created',
      accessor: (data) => {
        return data.createdAt ? new Date(data.createdAt) : new Date();
      },
      sortType: 'datetime',
      Cell: ({ row }) => {
        let createdAt;
        if (row.original.createdAt) {
          createdAt = dateUsHelper(row.original.createdAt);
          if (createdAt === undefined || createdAt === 'Invalid Date') {
            const now = new Date();
            createdAt = dateUsHelper(now);
          }
        }
        return createdAt;
      },
    },
    {
      Header: 'Last Modified',
      accessor: (data) => {
        return data.updatedAt ? new Date(data.updatedAt) : new Date();
      },
      sortType: 'datetime',
      Cell: ({ row }) => {
        let updatedAt;
        if (row.original.updatedAt) {
          updatedAt = dateUsHelper(row.original.updatedAt);
          if (updatedAt === undefined || updatedAt === 'Invalid Date') {
            const now = new Date();
            updatedAt = dateUsHelper(now);
          }
        }
        return updatedAt;
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
      Header: 'Election Date',
      // TODO: Just abstract out this bit and use for other datetime columns as well
      accessor: (data) =>
        data.electionDate
          ? new Date(data.electionDate)
          : new Date('1970-01-01'),
      sortDescFirst: true,
      sortType: (rowA, rowB) =>
        dateColumnSort(rowA.original.electionDate, rowB.original.electionDate),
      Cell: ({ row }) => {
        return dateUsHelper(row.original.electionDate);
      },
    },
    {
      Header: 'Term Length',
      accessor: 'officeTermLength',
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
      Header: 'Candidacy',
      accessor: 'campaignCommittee',
    },
    {
      Header: 'Pledged',
      accessor: 'pledged',
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
