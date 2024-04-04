'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { candidateRoute, partyResolver } from 'helpers/candidateHelper';
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
import {
  IS_VERIFIED_OPTIONS_REVERSED
} from '../../victory-path/[slug]/components/is-verified-options.constant';
import {
  CANDIDATE_TIERS_REVERSED,
} from '../../victory-path/[slug]/components/candidate-tiers.constant';

const getDateCellContents = (origDate) => {
  let date;
  if (origDate) {
    date = dateUsHelper(origDate);
    if (date === undefined || date === 'Invalid Date') {
      const now = new Date();
      date = dateUsHelper(now);
    }
  }
  return date;
}

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
  // TODO: Build this array of keys w/ an Object.keys() of the `fields` object below
  //  so that we can just manage these keys/fields in one place instead of two.
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
      'level',
      'ballotLevel',
      'city',
      'zip',
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
      'isPro',
      'isVerified',
      'dateVerified',
      'tier',
      'didWin'
    ],
  ];

  const inputData = [];
  campaigns?.map((campaignObj) => {
    const { data } = campaignObj;
    const campaign = mapCampaignToCandidate(data);
    const { user, isPro, isVerified, didWin, tier } = campaignObj;
    const { currentStep, reportedVoterGoals, aiContent, details } = data || {};
    const { zip, level, ballotLevel } = details || {};

    let waitingForP2v =
      !data?.p2vStatus || data?.p2vStatus === 'Waiting' ? 'Yes' : 'No';

    if (!data?.details?.pledged) {
      waitingForP2v = 'n/a';
    }

    if (data.p2vNotNeeded) {
      waitingForP2v = 'Not Needed';
    }

    let runningForOffice = 'Exploring';
    if (data?.details?.knowRun && data.details.knowRun === 'yes') {
      runningForOffice = 'Yes';
    } else if (
      data?.details?.runForOffice &&
      data.details.runForOffice === 'yes'
    ) {
      runningForOffice = 'Yes';
    }

    let didWinDisplay;
    if (didWin === null) {
      didWinDisplay = 'N/A';
    } else if (didWin) {
      didWinDisplay = 'Yes';
    } else {
      didWinDisplay = 'No';
    }

    const fields = {
      id: campaignObj.id,
      isActive: campaignObj.isActive ? 'Yes' : 'No',
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
      level,
      ballotLevel,
      city: campaign.city,
      zip: zip || '',
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
      pledged: campaign?.pledged && campaign.pledged === true ? 'Yes' : 'No',
      knowRun: runningForOffice,
      isPro: isPro ? 'Yes' : 'No',
      isVerified: IS_VERIFIED_OPTIONS_REVERSED[isVerified],
      dateVerified: campaignObj.dateVerified === null ?
        'N/A' :
        new Date(campaignObj.dateVerified),
      tier: CANDIDATE_TIERS_REVERSED[tier],
      didWin: didWinDisplay
    };
    inputData.push(fields);
    let csvFields = fields;
    csvFields.lastVisited = dateUsHelper(fields.lastVisited);
    csvFields.createdAt = dateUsHelper(fields.createdAt);
    csvFields.updatedAt = dateUsHelper(fields.updatedAt);
    csvData.push(Object.values(csvFields));
  });

  const columns = [
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
      Header: 'Is Pro?',
      accessor: 'isPro',
    },
    {
      Header: 'Is Verified?',
      accessor: 'isVerified',
    },
    {
      Header: 'Verified Date',
      accessor: 'dateVerified',
      Cell: ({row}) => getDateCellContents(row?.original?.dateVerified),
    },
    {
      Header: 'Tier',
      accessor: 'tier',
    },
    {
      Header: 'Did Win?',
      accessor: 'didWin',
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
      Cell: ({row}) => getDateCellContents(row?.original?.createdAt),
    },
    {
      Header: 'Last Modified',
      accessor: (data) => {
        return data.updatedAt ? new Date(data.updatedAt) : new Date();
      },
      sortType: 'datetime',
      Cell: ({row}) =>  getDateCellContents(row?.original?.updatedAt),
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
      Header: 'BR Office Level',
      accessor: 'ballotLevel',
    },
    {
      Header: 'Enriched Office Level',
      accessor: 'level',
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
      Header: 'Zip',
      accessor: 'zip',
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
  ];

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
        <Table columns={columns} data={inputData} />
      </PortalPanel>
    </AdminWrapper>
  );
}
