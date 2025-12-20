'use client'

import PortalPanel from '@shared/layouts/PortalPanel'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import { partyResolver } from 'helpers/candidateHelper'
import { useMemo } from 'react'
import Link from 'next/link'
import Actions from './Actions'
import WarningButton from '@shared/buttons/WarningButton'
import Table from '@shared/utils/Table'

interface CandidateData {
  slug: string
  firstName: string
  lastName: string
  party: string
  campaignOnboardingSlug: string | null
}

interface Candidate {
  id: number
  isActive: boolean
  data: string
}

interface TableRow {
  id: number
  isActive: boolean
  slug: string
  firstName: string
  lastName: string
  party: string
  campaignOnboardingSlug: string | null
}

interface AdminAllCandidatesPageProps {
  pathname: string
  title: string
  candidates?: Candidate[]
}

export default function AdminAllCandidatesPage(
  props: AdminAllCandidatesPageProps,
): React.JSX.Element {
  const { candidates } = props
  console.log('candidates', candidates)

  const inputData: TableRow[] = []
  if (candidates) {
    candidates.map((candidateObj) => {
      const { data } = candidateObj
      const candidate: CandidateData = JSON.parse(data)
      const fields: TableRow = {
        id: candidateObj.id,
        isActive: candidateObj.isActive,
        slug: candidate.slug,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        party: partyResolver(candidate.party),
        campaignOnboardingSlug: candidate.campaignOnboardingSlug,
      }
      inputData.push(fields)
    })
  }
  const data = useMemo(() => inputData, [inputData])

  const columns = useMemo(
    () => [
      {
        id: 'actions',
        header: 'Actions',
        collapse: true,
        cell: ({ row }: { row: { original: TableRow } }) => {
          return <Actions {...row.original} />
        },
      },

      {
        id: 'slug',
        header: 'Slug',
        accessorKey: 'slug',
      },

      {
        id: 'isActive',
        header: 'Is Active',
        accessorKey: 'isActive',
        cell: ({ row }: { row: { original: TableRow } }) => {
          return <div>{row.original.isActive ? 'yes' : 'no'}</div>
        },
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
        id: 'campaignOnboardingSlug',
        header: 'Campaign Slug',
        accessorKey: 'campaignOnboardingSlug',
      },

      {
        id: 'party',
        header: 'Party',
        accessorKey: 'party',
      },
    ],
    [],
  )

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
  )
}
