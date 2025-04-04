'use client';
import { partyResolver } from 'helpers/candidateHelper';
import Table from '@shared/utils/Table';
import Link from 'next/link';
import { CSVLink } from 'react-csv';
import { dateUsHelper, dateWithTime } from 'helpers/dateHelper';
import Actions from './Actions';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { BsFiletypeCsv } from 'react-icons/bs';
import { formatToPhone } from 'helpers/numberHelper';
import { dateColumnSort } from 'helpers/dateColumnSort';
import { IS_VERIFIED_OPTIONS_REVERSED } from '../../victory-path/[slug]/components/is-verified-options.constant';
import { CANDIDATE_TIERS_REVERSED } from '../../victory-path/[slug]/components/candidate-tiers.constant';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { UserAdminLink } from 'app/admin/shared/UserAdminLink';

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

export default function AdminCandidatesTable({ campaigns }) {
  // TODO: Build this array of keys w/ an Object.keys() of the `fields` object below
  //  so that we can just manage these keys/fields in one place instead of two.
  const csvData = [
    [
      'id',
      'candidateUserId',
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
      'directMail',
      'calls',
      'digitalAds',
      'text',
      'events',
      'yardSigns',
      'aiDocsCreated',
      'waitingForP2v',
      'p2vStatus',
      'pledged',
      'knowRun',
      'isPro',
      'isVerified',
      'dateVerified',
      'tier',
      'didWin',
      'filingPeriodsStart',
      'filingPeriodsEnd',
      'hbPastCandidate',
      'hbIncumbent',
      'hbCandidateExperienceLevel',
      'hbFinalViabilityRating',
      'hbPrimaryElectionResult',
      'hbElectionResults',
      'hbProfessionalExperience',
      'hbP2pCampaigns',
      'hbP2pSent',
      'hbConfirmedSelfFiler',
      'hbVerifiedCandidates',
      'hbDateVerified',
      'hbProCandidate',
      'hbFilingDeadline',
      'hbOpponents',
    ],
  ];

  const inputData = [];
  campaigns?.map((campaign) => {
    const {
      data,
      user,
      isPro,
      isVerified,
      didWin,
      tier,
      aiContent,
      details,
      pathToVictory,
      createdAt,
      updatedAt,
    } = campaign;

    const { currentStep, reportedVoterGoals, hubSpotUpdates } = data || {};
    const {
      zip,
      level,
      website,
      ballotLevel,
      office,
      otherOffice,
      filingPeriodsStart,
      filingPeriodsEnd,
      primaryElectionDate,
      campaignCommittee,
    } = details || {};

    const {
      past_candidate,
      incumbent,
      candidate_experience_level,
      final_viability_rating,
      primary_election_result,
      election_results,
      professional_experience,
      p2p_campaigns,
      p2p_sent,
      confirmed_self_filer,
      verified_candidates,
      date_verified,
      pro_candidate,
      filing_deadline,
      opponents,
    } = hubSpotUpdates || {};

    const lastVisited = user?.lastVisited;

    let waitingForP2v =
      !pathToVictory?.data?.p2vStatus ||
      pathToVictory?.data?.p2vStatus === 'Waiting'
        ? 'Yes'
        : 'No';

    let viabilityScore = pathToVictory?.data?.viability?.score || 0;

    if (!details?.pledged) {
      waitingForP2v = 'n/a';
    }

    if (data.p2vNotNeeded || pathToVictory?.data?.p2vNotNeeded) {
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
      candidateUserId: user?.id,
      isActive: campaign.isActive ? 'Yes' : 'No',
      slug: campaign.slug,
      firstName: user?.firstName ? user.firstName : user?.name || 'n/a',
      lastName: user?.lastName ? user.lastName : 'n/a',
      userName: `${user?.firstName} ${user?.lastName}`,
      launched: mapStatus(details?.launchStatus),
      lastVisited,
      party: partyResolver(details?.party),
      office: office === 'Other' ? otherOffice : office,
      officeTermLength: details?.officeTermLength,
      level,
      ballotLevel,
      city: details?.city,
      zip: zip || '',
      district: details?.district || 'n/a',
      state: details?.state ? details?.state.toUpperCase() : '?',
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
      email: user?.email || 'n/a',
      phone: user?.phone || 'n/a',
      currentStep,
      shortVersion: details?.filedStatement,
      campaignCommittee,
      website: website || '',
      primaryElectionDate: primaryElectionDate,
      electionDate: details?.electionDate,
      doorKnocking: reportedVoterGoals?.doorKnocking || 0,
      directMail: reportedVoterGoals?.directMail || 0,
      calls: reportedVoterGoals?.calls || 0,
      digitalAds: reportedVoterGoals?.digitalAds || 0,
      text: reportedVoterGoals?.text || 0,
      events: reportedVoterGoals?.events || 0,
      yardSigns: reportedVoterGoals?.yardSigns || 0,
      aiDocsCreated: aiContent ? Object.keys(aiContent).length : 0,
      waitingForP2v,
      p2vStatus: pathToVictory?.data?.p2vStatus,
      viabilityScore,
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
      filingPeriodsStart: filingPeriodsStart,
      filingPeriodsEnd: filingPeriodsEnd,
      hbPastCandidate: past_candidate,
      hbIncumbent: incumbent,
      hbCandidateExperienceLevel: candidate_experience_level,
      hbFinalViabilityRating: final_viability_rating,
      hbPrimaryElectionResult: primary_election_result,
      hbElectionResults: election_results,
      hbProfessionalExperience: professional_experience,
      hbP2pCampaigns: p2p_campaigns,
      hbP2pSent: p2p_sent,
      hbConfirmedSelfFiler: confirmed_self_filer,
      hbVerifiedCandidates: verified_candidates,
      hbDateVerified: date_verified,
      hbProCandidate: pro_candidate,
      hbFilingDeadline: filing_deadline,
      hbOpponents: opponents,
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
    {
      Header: 'Candidate User',
      accessor: 'userName',
      Cell: ({ row }) => (
        <UserAdminLink userId={row.original.candidateUserId}>
          {row.original.userName}
        </UserAdminLink>
      ),
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
      Header: 'P2V Status',
      accessor: 'p2vStatus',
    },
    {
      Header: 'Viability Score',
      accessor: 'viabilityScore',
    },
    {
      Header: 'Running',
      accessor: 'knowRun',
    },

    { Header: 'HB Past Candidate', accessor: 'hbPastCandidate' },
    { Header: 'Hb Incumbent', accessor: 'hbIncumbent' },
    {
      Header: 'Hb Candidate Experience Level',
      accessor: 'hbCandidateExperienceLevel',
    },
    { Header: 'Hb Final Viability Rating', accessor: 'hbFinalViabilityRating' },
    {
      Header: 'Hb Primary Election Result',
      accessor: 'hbPrimaryElectionResult',
    },
    { Header: 'Hb Election Results', accessor: 'hbElectionResults' },
    {
      Header: 'Hb Professional Experience',
      accessor: 'hbProfessionalExperience',
    },
    { Header: 'Hb P2p Campaigns', accessor: 'hbP2pCampaigns' },
    { Header: 'Hb P2p Sent', accessor: 'hbP2pSent' },
    { Header: 'Hb Confirmed Self Filer', accessor: 'hbConfirmedSelfFiler' },
    { Header: 'Hb Verified Candidates', accessor: 'hbVerifiedCandidates' },
    { Header: 'Hb Date Verified', accessor: 'hbDateVerified' },
    { Header: 'Hb Pro Candidate', accessor: 'hbProCandidate' },
    { Header: 'Hb Filing Deadline', accessor: 'hbFilingDeadline' },
    { Header: 'Hb Opponents', accessor: 'hbOpponents' },
    {
      Header: 'First Name',
      accessor: 'firstName',
    },
    {
      Header: 'Last Name',
      accessor: 'lastName',
    },
    {
      Header: 'Short Version',
      accessor: 'shortVersion',
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
      Header: 'Doors Knocked',
      accessor: 'doorKnocking',
    },
    {
      Header: 'Direct Mail',
      accessor: 'directMail',
    },
    {
      Header: 'Phone Calls',
      accessor: 'calls',
    },
    {
      Header: 'Digital Advertising',
      accessor: 'digitalAds',
    },
    {
      Header: 'Texting',
      accessor: 'text',
    },
    {
      Header: 'Events & Rallies',
      accessor: 'events',
    },
    {
      Header: 'Yard Signs',
      accessor: 'yardSigns',
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
      Header: 'Filing Period Start',
      accessor: (data) =>
        data.electionDate
          ? new Date(data.filingPeriodsStart)
          : new Date('1970-01-01'),
      sortDescFirst: true,
      sortType: (rowA, rowB) =>
        dateColumnSort(
          rowA.original.filingPeriodsStart,
          rowB.original.filingPeriodsStart,
        ),
      Cell: ({ row }) => {
        return dateUsHelper(row.original.filingPeriodsStart);
      },
    },
    {
      Header: 'Filing Period End',
      accessor: (data) =>
        data.electionDate
          ? new Date(data.filingPeriodsEnd)
          : new Date('1970-01-01'),
      sortDescFirst: true,
      sortType: (rowA, rowB) =>
        dateColumnSort(
          rowA.original.filingPeriodsEnd,
          rowB.original.filingPeriodsEnd,
        ),
      Cell: ({ row }) => {
        return dateUsHelper(row.original.filingPeriodsEnd);
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
        <CSVLink data={csvData} filename={`candidates.csv`}>
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
