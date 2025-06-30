'use client'

import { useMemo, useState, useEffect } from 'react'
import Body2 from '@shared/typography/Body2'
import H6 from '@shared/typography/H6'
import Paper from '@shared/utils/Paper'
import { LuInbox } from 'react-icons/lu'
import { useWebsite } from './WebsiteProvider'
import SimpleTable from '@shared/utils/SimpleTable'
import { dateUsHelper } from 'helpers/dateHelper'
import { formatToPhone } from 'helpers/numberHelper'
import Modal from '@shared/utils/Modal'
import H4 from '@shared/typography/H4'
import PaginationButtons from '../../voter-records/components/PaginationButtons'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useSnackbar } from 'helpers/useSnackbar'
import CopyToClipboardButton from '@shared/utils/CopyToClipboardButton'

const fetchContacts = async (pageNum = 1) => {
  return await clientFetch(apiRoutes.website.getContacts, {
    page: pageNum,
    sortBy: 'createdAt',
  })
}

export default function WebsiteInbox({}) {
  const { contacts, setContacts } = useWebsite()
  const [{ page, totalPages }, setPagination] = useState({
    page: 1,
    totalPages: null,
  })
  const [loading, setLoading] = useState(false)
  const [modalContact, setModalContact] = useState(null)
  const { errorSnackbar } = useSnackbar()

  useEffect(() => {
    loadContacts()

    async function loadContacts() {
      setLoading(true)
      const resp = await fetchContacts(page)
      if (resp.ok) {
        setContacts(resp.data.contacts)
        setPagination({
          page,
          totalPages: resp.data.totalPages,
        })
      } else {
        errorSnackbar('Failed to load contacts')
      }
      setLoading(false)
    }
  }, [page])

  const columns = useMemo(
    () => [
      {
        header: 'Date',
        accessorKey: 'createdAt',
        cell: ({ row }) => dateUsHelper(row.createdAt, 'long'),
      },
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Phone',
        accessorKey: 'phone',
        cell: ({ row }) => formatToPhone(row.phone),
      },
      {
        header: 'Message',
        accessorKey: 'message',
        cell: ({ row }) => (
          <span title={row.message} className="truncate block max-w-[200px]">
            {row.message}
          </span>
        ),
      },
    ],
    [],
  )

  function handlePageChange(page) {
    setPagination((current) => ({
      ...current,
      page,
    }))
  }

  function handleRowClick(row) {
    console.log(row)
    setModalContact(row)
  }

  if (!contacts || contacts.length === 0) {
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

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <H4 className="m-0">Your website form submissions</H4>
        <PaginationButtons
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          loading={loading}
        />
      </div>
      {contacts?.length > 0 && (
        <SimpleTable
          columns={columns}
          data={contacts}
          onRowClick={handleRowClick}
        />
      )}
      <ContactModal
        contact={modalContact}
        onClose={() => setModalContact(null)}
      />
    </div>
  )
}

function ContactModal({ contact, onClose }) {
  return (
    <Modal open={!!contact} closeCallback={onClose}>
      {contact && (
        <div className="p-8 [&>*]:!font-outfit">
          <ContactInfo
            label="Date"
            value={dateUsHelper(contact.createdAt)}
            copyButton={false}
          />
          <ContactInfo label="Name" value={contact.name} />
          <ContactInfo label="Email Address" value={contact.email} />
          <ContactInfo label="Phone Number" value={contact.phone || 'N/A'} />
          <ContactInfo
            label="Message"
            value={contact.message}
            divider={false}
          />
        </div>
      )}
    </Modal>
  )
}

function ContactInfo({ label, value, copyButton = true, divider = true }) {
  return (
    <>
      <div className="flex justify-between gap-2">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1">
            {label}
          </label>
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
