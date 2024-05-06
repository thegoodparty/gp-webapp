'use client';
import { partyResolver } from 'helpers/candidateHelper';
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
import { IS_VERIFIED_OPTIONS_REVERSED } from '../../victory-path/[slug]/components/is-verified-options.constant';
import { CANDIDATE_TIERS_REVERSED } from '../../victory-path/[slug]/components/candidate-tiers.constant';
import { FaExternalLinkAlt } from 'react-icons/fa';

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
};

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

export default function AdminCandidatesTable(props) {
  const { campaigns } = props;
  console.log('campaigns table', campaigns);
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
      'website',
      'primaryElectionDate',
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
      'didWin',
    ],
  ];

  const inputData = [];
  campaigns?.map((campaign) => {
    const { data, user, isPro, isVerified, didWin, tier, aiContent, details } =
      campaign;
    // const campaign = mapCampaignToCandidate(data);
    const { currentStep, reportedVoterGoals } = data || {};
    const { zip, level, website, ballotLevel, office, otherOffice } =
      details || {};

    let waitingForP2v =
      !data?.p2vStatus || data?.p2vStatus === 'Waiting' ? 'Yes' : 'No';

    if (!details?.pledged) {
      waitingForP2v = 'n/a';
    }

    if (data.p2vNotNeeded) {
      waitingForP2v = 'Not Needed';
    }

    let runningForOffice = 'Exploring';
    if (details?.knowRun && details.knowRun === 'yes') {
      runningForOffice = 'Yes';
    } else if (details?.runForOffice && details.runForOffice === 'yes') {
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
      id: campaign.id,
      isActive: campaign.isActive ? 'Yes' : 'No',
      slug: campaign.slug,
      firstName: user?.firstName ? user.firstName : user?.name || 'n/a',
      lastName: user?.lastName ? user.lastName : 'n/a',
      userName: `${user?.firstName} ${user?.lastName}`,
      launched: mapStatus(details?.launchStatus),
      lastVisited: details?.lastVisited,
      party: partyResolver(details?.party),
      office: office === 'Other' ? otherOffice : office,
      officeTermLength: details?.officeTermLength,
      level,
      ballotLevel,
      city: details?.city,
      zip: zip || '',
      district: details?.district || 'n/a',
      state: details?.state ? details?.state.toUpperCase() : '?',
      createdAt: new Date(campaign.createdAt),
      updatedAt: new Date(campaign.updatedAt),
      email: user?.email || 'n/a',
      phone: user?.phone || 'n/a',
      currentStep,
      shortVersion: details?.filedStatement,
      campaignCommittee: details?.campaignCommittee,
      website: website || '',
      primaryElectionDate: details?.primaryElectionDate,
      electionDate: details?.electionDate,
      doorKnocking: reportedVoterGoals?.doorKnocking || 0,
      calls: reportedVoterGoals?.calls || 0,
      digital: reportedVoterGoals?.digital || 0,
      aiDocsCreated: aiContent ? Object.keys(aiContent).length : 0,
      waitingForP2v,
      pledged: details?.pledged && details.pledged === true ? 'Yes' : 'No',
      knowRun: runningForOffice,
      isPro: isPro ? 'Yes' : 'No',
      isVerified: IS_VERIFIED_OPTIONS_REVERSED[isVerified],
      dateVerified:
        campaign.dateVerified === null
          ? 'N/A'
          : new Date(campaign.dateVerified),
      tier: CANDIDATE_TIERS_REVERSED[tier],
      didWin: didWinDisplay,
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
      Cell: ({ row }) => getDateCellContents(row?.original?.dateVerified),
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
      Cell: ({ row }) => getDateCellContents(row?.original?.createdAt),
    },
    {
      Header: 'Last Modified',
      accessor: (data) => {
        return data.updatedAt ? new Date(data.updatedAt) : new Date();
      },
      sortType: 'datetime',
      Cell: ({ row }) => getDateCellContents(row?.original?.updatedAt),
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
      Header: 'Primary Date',
      accessor: (data) =>
        data.primaryElectionDate
          ? new Date(data.primaryElectionDate)
          : new Date('1970-01-01'),
      sortDescFirst: true,
      sortType: (rowA, rowB) =>
        dateColumnSort(
          rowA.original.primaryElectionDate,
          rowB.original.primaryElectionDate,
        ),
      Cell: ({ row }) => {
        return dateUsHelper(row.original.primaryElectionDate);
      },
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
      Header: 'Website',
      accessor: 'website',
      Cell: ({ row }) => {
        if (!row.original.website) {
          return '';
        }
        return (
          <a href={row.original.website} className="underline" target="_blank">
            Campaign Website <FaExternalLinkAlt />
          </a>
        );
      },
    },
    {
      Header: 'Pledged',
      accessor: 'pledged',
    },
  ];

  return (
    <>
      <div className="text-right">
        {/* <Link href="/admin/add-candidate">
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
        </Link> */}
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
    </>
  );
}
