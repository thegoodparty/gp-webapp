'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Body2 from '@shared/typography/Body2'
import H6 from '@shared/typography/H6'
import Paper from '@shared/utils/Paper'
import { LuInbox } from 'react-icons/lu'
import { useWebsite, Contact } from './WebsiteProvider'
import SimpleTable from '@shared/utils/SimpleTable'
import { dateUsHelper } from 'helpers/dateHelper'
import { formatDisplayPhoneNumber } from 'helpers/numberHelper'
import ResponsiveModal from '@shared/utils/ResponsiveModal'
import H4 from '@shared/typography/H4'
import PaginationButtons from '../../voter-records/components/PaginationButtons'
import { clientFetch, ApiResponse } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useSnackbar } from 'helpers/useSnackbar'
import CopyToClipboardButton from '@shared/utils/CopyToClipboardButton'

interface WebsiteContactsResponse {
  contacts: Contact[]
  totalPages: number
}

const fetchContacts = async (
  pageNum: number = 1,
): Promise<ApiResponse<WebsiteContactsResponse>> => {
  return await clientFetch<WebsiteContactsResponse>(
    apiRoutes.website.getContacts,
    {
      page: pageNum,
      sortBy: 'createdAt',
    },
  )
}

export default function WebsiteInbox(): React.JSX.Element {
  const { contacts, setContacts } = useWebsite()
  const [{ page, totalPages }, setPagination] = useState<{ page: number; totalPages: number | null }>({
    page: 1,
    totalPages: null,
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [modalContact, setModalContact] = useState<Contact | null>(null)
  const { errorSnackbar } = useSnackbar()

  useEffect(() => {
    loadContacts()

    async function loadContacts() {
      setLoading(true)
      const resp = await fetchContacts(page)
      if (resp.ok) {
        const data = resp.data
        setContacts(data.contacts)
        setPagination({
          page,
          totalPages: data.totalPages,
        })
      } else {
        errorSnackbar('Failed to load contacts')
      }
      setLoading(false)
    }
  }, [page, setContacts, errorSnackbar])

  const columns = useMemo(
    () => [
      {
        header: 'Date',
        accessorKey: 'createdAt' as const,
        cell: ({ row }: { row: Contact }) =>
          dateUsHelper((row.createdAt as string | number) ?? '', 'long'),
      },
      {
        header: 'Name',
        accessorKey: 'name' as const,
      },
      {
        header: 'Email',
        accessorKey: 'email' as const,
      },
      {
        header: 'Phone',
        accessorKey: 'phone' as const,
        cell: ({ row }: { row: Contact }) =>
          formatDisplayPhoneNumber(String(row.phone ?? '')),
      },
      {
        header: 'Message',
        accessorKey: 'message' as const,
        cell: ({ row }: { row: Contact }) => (
          <span title={row.message || ''} className="truncate block max-w-[200px]">
            {row.message}
          </span>
        ),
      },
    ],
    [],
  )

  function handlePageChange(nextPage: number) {
    setPagination((current) => ({
      ...current,
      page: nextPage,
    }))
  }

  function handleRowClick(row: Contact) {
    setModalContact(row)
  }

  if (!contacts || (Array.isArray(contacts) && contacts.length === 0)) {
    return (
      <Paper className="border-dashed text-center !p-6">
        <LuInbox className="inline mb-1" size={24} />
        <H6>No form submissions yet</H6>
        <Body2 className="text-gray-500 text-xs !font-outfit">
          Your website contact form submissions will appear here.
        </Body2>
      </Paper>
    )
  }

  const tableData = Array.isArray(contacts) ? contacts : ([] as Contact[])

  return (
    <div>
      <div className="flex flex-row justify-between items-start mb-2">
        <H4 className="m-0">Your website form submissions</H4>
        <PaginationButtons
          currentPage={page}
          totalPages={totalPages ?? 1}
          onPageChange={handlePageChange}
          loading={loading}
        />
      </div>
      {tableData.length > 0 && (
        <SimpleTable<Contact>
          columns={columns}
          data={tableData}
          onRowClick={(row) => handleRowClick(row)}
        />
      )}
      <ContactModal contact={modalContact} onClose={() => setModalContact(null)} />
    </div>
  )
}

function ContactModal({
  contact,
  onClose,
}: {
  contact: Contact | null
  onClose: () => void
}): React.JSX.Element {
  return (
    <ResponsiveModal open={!!contact} onClose={onClose}>
      {contact && (
        <div className="p-8 [&>*]:!font-outfit">
          <ContactInfo
            label="Date"
            value={dateUsHelper(String(contact.createdAt ?? ''))}
            copyButton={false}
          />
          <ContactInfo label="Name" value={String(contact.name ?? '')} />
          <ContactInfo label="Email Address" value={String(contact.email ?? '')} />
          <ContactInfo label="Phone Number" value={String(contact.phone ?? 'N/A')} />
          <ContactInfo
            label="Message"
            value={String(contact.message ?? '')}
            divider={false}
          />
        </div>
      )}
    </ResponsiveModal>
  )
}

function ContactInfo({
  label,
  value,
  copyButton = true,
  divider = true,
}: {
  label: string
  value: string
  copyButton?: boolean
  divider?: boolean
}): React.JSX.Element {
  return (
    <>
      <div className="flex justify-between gap-2">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1">{label}</label>
          <Body2>{value}</Body2>
        </div>
        {copyButton && (
          <CopyToClipboardButton
            copyText={value}
            size="small"
            color="neutral"
            variant="outlined"
          >
            Copy
          </CopyToClipboardButton>
        )}
      </div>
      {divider && <div className="my-4 h-[1px] bg-black/[0.12]"></div>}
    </>
  )
}
