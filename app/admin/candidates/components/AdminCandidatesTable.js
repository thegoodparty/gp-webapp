'use client'
import { partyResolver } from 'helpers/candidateHelper'
import Table from '@shared/utils/Table'
import Link from 'next/link'
import { CSVLink } from 'react-csv'
import { dateUsHelper, dateWithTime } from 'helpers/dateHelper'
import Actions from './Actions'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { BsFiletypeCsv } from 'react-icons/bs'
import { formatPhoneNumber } from 'helpers/numberHelper'
import { dateColumnSort } from 'helpers/dateColumnSort'
import { IS_VERIFIED_OPTIONS_REVERSED } from '../../victory-path/[slug]/components/is-verified-options.constant'
import { CANDIDATE_TIERS_REVERSED } from '../../victory-path/[slug]/components/candidate-tiers.constant'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { UserAdminLink } from 'app/admin/shared/UserAdminLink'
import { useMemo, useState } from 'react'

const getDateCellContents = (origDate) => {
  let date
  if (origDate) {
    date = dateUsHelper(origDate)
    if (date === undefined || date === 'Invalid Date') {
      const now = new Date()
      date = dateUsHelper(now)
    }
  }
  return date
}

function mapStatus(status, isActive) {
  if (!status) {
    return 'No (Onboarding)'
  }
  if (status === 'launched') {
    return 'Live'
  }
  if (status === 'pending') {
    return 'Pending Review'
  }
  return 'No'
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
  ]

  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(25)

  const inputData = useMemo(() => {
    const resultArray = []
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
      } = campaign

      const { currentStep, reportedVoterGoals, hubSpotUpdates } = data || {}
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
      } = details || {}

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
      } = hubSpotUpdates || {}

      const lastVisited = user?.lastVisited

      let waitingForP2v =
        !pathToVictory?.data?.p2vStatus ||
        pathToVictory?.data?.p2vStatus === 'Waiting'
          ? 'Yes'
          : 'No'

      let viabilityScore = pathToVictory?.data?.viability?.score || 0

      if (!details?.pledged) {
        waitingForP2v = 'n/a'
      }

      if (data.p2vNotNeeded || pathToVictory?.data?.p2vNotNeeded) {
        waitingForP2v = 'Not Needed'
      }

      let runningForOffice = 'Exploring'
      if (details?.knowRun && details.knowRun === 'yes') {
        runningForOffice = 'Yes'
      } else if (details?.runForOffice && details.runForOffice === 'yes') {
        runningForOffice = 'Yes'
      }

      let didWinDisplay
      if (didWin === null) {
        didWinDisplay = 'N/A'
      } else if (didWin) {
        didWinDisplay = 'Yes'
      } else {
        didWinDisplay = 'No'
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
      }
      resultArray.push(fields)
      let csvFields = fields
      csvFields.lastVisited = dateUsHelper(fields.lastVisited)
      csvFields.createdAt = dateUsHelper(fields.createdAt)
      csvFields.updatedAt = dateUsHelper(fields.updatedAt)
      csvData.push(Object.values(csvFields))
    })
    return resultArray
  }, [campaigns])

  const pagedData = useMemo(() => {
    const start = pageIndex * pageSize
    return inputData.slice(start, start + pageSize)
  }, [inputData, pageIndex, pageSize])

  const columns = useMemo(
    () => [
      {
        id: 'actions',
        header: 'Actions',
        collapse: true,
        cell: ({ row }) => {
          return <Actions {...row.original} />
        },
      },
      {
        id: 'profile',
        header: 'Profile',
        accessorKey: 'slug',
      },
      {
        id: 'candidateUser',
        header: 'Candidate User',
        accessorKey: 'userName',
        cell: ({ row }) => (
          <UserAdminLink userId={row.original.candidateUserId}>
            {row.original.userName}
          </UserAdminLink>
        ),
      },
      {
        id: 'launchStatus',
        header: 'Launch Status',
        accessorKey: 'launched',
      },
      {
        id: 'isActive',
        header: 'Active (Live)',
        accessorKey: 'isActive',
      },
      {
        id: 'waitingForP2v',
        header: 'Waiting for P2V',
        accessorKey: 'waitingForP2v',
      },
      {
        id: 'p2vStatus',
        header: 'P2V Status',
        accessorKey: 'p2vStatus',
      },
      {
        id: 'viabilityScore',
        header: 'Viability Score',
        accessorKey: 'viabilityScore',
      },
      {
        id: 'running',
        header: 'Running',
        accessorKey: 'knowRun',
      },
      {
        id: 'hbPastCandidate',
        header: 'HB Past Candidate',
        accessorKey: 'hbPastCandidate',
      },
      {
        id: 'hbIncumbent',
        header: 'Hb Incumbent',
        accessorKey: 'hbIncumbent',
      },
      {
        id: 'hbCandidateExperienceLevel',
        header: 'Hb Candidate Experience Level',
        accessorKey: 'hbCandidateExperienceLevel',
      },
      {
        id: 'hbFinalViabilityRating',
        header: 'Hb Final Viability Rating',
        accessorKey: 'hbFinalViabilityRating',
      },
      {
        id: 'hbPrimaryElectionResult',
        header: 'Hb Primary Election Result',
        accessorKey: 'hbPrimaryElectionResult',
      },
      {
        id: 'hbElectionResults',
        header: 'Hb Election Results',
        accessorKey: 'hbElectionResults',
      },
      {
        id: 'hbProfessionalExperience',
        header: 'Hb Professional Experience',
        accessorKey: 'hbProfessionalExperience',
      },
      {
        id: 'hbP2pCampaigns',
        header: 'Hb P2p Campaigns',
        accessorKey: 'hbP2pCampaigns',
      },
      {
        id: 'hbP2pSent',
        header: 'Hb P2p Sent',
        accessorKey: 'hbP2pSent',
      },
      {
        id: 'hbConfirmedSelfFiler',
        header: 'Hb Confirmed Self Filer',
        accessorKey: 'hbConfirmedSelfFiler',
      },
      {
        id: 'hbVerifiedCandidates',
        header: 'Hb Verified Candidates',
        accessorKey: 'hbVerifiedCandidates',
      },
      {
        id: 'hbDateVerified',
        header: 'Hb Date Verified',
        accessorKey: 'hbDateVerified',
      },
      {
        id: 'hbProCandidate',
        header: 'Hb Pro Candidate',
        accessorKey: 'hbProCandidate',
      },
      {
        id: 'hbFilingDeadline',
        header: 'Hb Filing Deadline',
        accessorKey: 'hbFilingDeadline',
      },
      {
        id: 'hbOpponents',
        header: 'Hb Opponents',
        accessorKey: 'hbOpponents',
      },
      {
        id: 'firstName',
        header: 'First Name',
        accessorKey: 'firstName',
      },
      {
        id: 'lastName',
        header: 'Last Name',
        accessorKey: 'lastName',
      },
      {
        id: 'shortVersion',
        header: 'Short Version',
        accessorKey: 'shortVersion',
      },
      {
        id: 'isPro',
        header: 'Is Pro?',
        accessorKey: 'isPro',
      },
      {
        id: 'isVerified',
        header: 'Is Verified?',
        accessorKey: 'isVerified',
      },
      {
        id: 'dateVerified',
        header: 'Verified Date',
        accessorKey: 'dateVerified',
        cell: ({ row }) => getDateCellContents(row?.original?.dateVerified),
      },
      {
        id: 'tier',
        header: 'Tier',
        accessorKey: 'tier',
      },
      {
        id: 'didWin',
        header: 'Did Win?',
        accessorKey: 'didWin',
      },
      {
        id: 'victoryPath',
        header: 'Path to Victory',
        accessorKey: 'victoryPath',
        cell: ({ row }) => {
          return (
            <Link
              href={`/admin/victory-path/${row.original.slug}`}
              className="underline"
            >
              Path to victory
            </Link>
          )
        },
      },
      {
        id: 'email',
        header: 'Email',
        accessorKey: 'email',
        cell: ({ row }) => {
          return (
            <a href={`mailto:${row.original.email}`} className="underline">
              {row.original.email}
            </a>
          )
        },
      },
      {
        id: 'metrics',
        header: 'Metrics',
        accessorKey: 'metrics',
        cell: ({ row }) => {
          return (
            <a
              href={`/admin/candidate-metrics/${row.original.slug}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline"
            >
              Candidate Metrics
            </a>
          )
        },
      },
      {
        id: 'doorKnocking',
        header: 'Doors Knocked',
        accessorKey: 'doorKnocking',
      },
      {
        id: 'directMail',
        header: 'Direct Mail',
        accessorKey: 'directMail',
      },
      {
        id: 'calls',
        header: 'Phone Calls',
        accessorKey: 'calls',
      },
      {
        id: 'digitalAds',
        header: 'Digital Advertising',
        accessorKey: 'digitalAds',
      },
      {
        id: 'text',
        header: 'Texting',
        accessorKey: 'text',
      },
      {
        id: 'events',
        header: 'Events & Rallies',
        accessorKey: 'events',
      },
      {
        id: 'yardSigns',
        header: 'Yard Signs',
        accessorKey: 'yardSigns',
      },
      {
        id: 'aiDocsCreated',
        header: 'AI Docs Created',
        accessorKey: 'aiDocsCreated',
      },
      {
        id: 'phone',
        header: 'Phone',
        accessorKey: 'phone',
        collapse: true,
        cell: ({ row }) => {
          if (row.original.phone === 'n/a') {
            return 'n/a'
          }
          return (
            <a href={`tel:${row.original.phone}`} className="underline">
              {formatPhoneNumber(row.original.phone)}
            </a>
          )
        },
      },
      {
        id: 'currentStep',
        header: 'Onboarding Step',
        accessorKey: 'currentStep',
      },
      {
        id: 'lastVisited',
        header: 'Last Visit',
        accessorKey: 'lastVisited',
        sortingFn: (rowA, rowB) =>
          dateColumnSort(rowA.original.lastVisited, rowB.original.lastVisited),
        cell: ({ row }) => {
          return row.original.lastVisited
            ? dateWithTime(row.original.lastVisited)
            : 'n/a'
        },
      },
      {
        id: 'createdAt',
        header: 'Date Created',
        accessorFn: (row) =>
          row.createdAt ? new Date(row.createdAt) : new Date(),
        sortingFn: 'datetime',
        cell: ({ row }) => getDateCellContents(row?.original?.createdAt),
      },
      {
        id: 'updatedAt',
        header: 'Last Modified',
        accessorFn: (row) =>
          row.updatedAt ? new Date(row.updatedAt) : new Date(),
        sortingFn: 'datetime',
        cell: ({ row }) => getDateCellContents(row?.original?.updatedAt),
      },
      {
        id: 'party',
        header: 'Party',
        accessorKey: 'party',
      },
      {
        id: 'office',
        header: 'Office',
        accessorKey: 'office',
      },
      {
        id: 'ballotLevel',
        header: 'BR Office Level',
        accessorKey: 'ballotLevel',
      },
      {
        id: 'level',
        header: 'Enriched Office Level',
        accessorKey: 'level',
      },
      {
        id: 'primaryElectionDate',
        header: 'Primary Date',
        accessorFn: (row) =>
          row.primaryElectionDate
            ? new Date(row.primaryElectionDate)
            : new Date('1970-01-01'),
        sortingFn: (rowA, rowB) =>
          dateColumnSort(
            rowA.original.primaryElectionDate,
            rowB.original.primaryElectionDate,
          ),
        cell: ({ row }) => {
          return dateUsHelper(row.original.primaryElectionDate)
        },
      },
      {
        id: 'electionDate',
        header: 'Election Date',
        accessorFn: (row) =>
          row.electionDate
            ? new Date(row.electionDate)
            : new Date('1970-01-01'),
        sortingFn: (rowA, rowB) =>
          dateColumnSort(
            rowA.original.electionDate,
            rowB.original.electionDate,
          ),
        cell: ({ row }) => {
          return dateUsHelper(row.original.electionDate)
        },
      },
      {
        id: 'filingPeriodsStart',
        header: 'Filing Period Start',
        accessorFn: (row) =>
          row.electionDate
            ? new Date(row.filingPeriodsStart)
            : new Date('1970-01-01'),
        sortingFn: (rowA, rowB) =>
          dateColumnSort(
            rowA.original.filingPeriodsStart,
            rowB.original.filingPeriodsStart,
          ),
        cell: ({ row }) => {
          return dateUsHelper(row.original.filingPeriodsStart)
        },
      },
      {
        id: 'filingPeriodsEnd',
        header: 'Filing Period End',
        accessorFn: (row) =>
          row.electionDate
            ? new Date(row.filingPeriodsEnd)
            : new Date('1970-01-01'),
        sortingFn: (rowA, rowB) =>
          dateColumnSort(
            rowA.original.filingPeriodsEnd,
            rowB.original.filingPeriodsEnd,
          ),
        cell: ({ row }) => {
          return dateUsHelper(row.original.filingPeriodsEnd)
        },
      },
      {
        id: 'officeTermLength',
        header: 'Term Length',
        accessorKey: 'officeTermLength',
      },
      {
        id: 'district',
        header: 'District',
        accessorKey: 'district',
      },
      {
        id: 'zip',
        header: 'Zip',
        accessorKey: 'zip',
      },
      {
        id: 'city',
        header: 'City',
        accessorKey: 'city',
      },
      {
        id: 'state',
        header: 'State',
        accessorKey: 'state',
        collapse: true,
      },
      {
        id: 'campaignCommittee',
        header: 'Candidacy',
        accessorKey: 'campaignCommittee',
      },
      {
        id: 'website',
        header: 'Website',
        accessorKey: 'website',
        cell: ({ row }) => {
          if (!row.original.website) {
            return ''
          }
          return (
            <a
              href={row.original.website}
              className="underline"
              target="_blank"
            >
              Campaign Website <FaExternalLinkAlt />
            </a>
          )
        },
      },
      {
        id: 'pledged',
        header: 'Pledged',
        accessorKey: 'pledged',
      },
    ],
    [],
  )

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
      <Table
        columns={columns}
        data={pagedData}
        showPagination={true}
        defaultPageSize={pageSize}
        pageIndex={pageIndex}
        onPageIndexChange={setPageIndex}
        pageCount={Math.ceil(inputData.length / pageSize)}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
    </>
  )
}
