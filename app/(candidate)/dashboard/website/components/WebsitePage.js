'use client'
import { useState } from 'react'
import DashboardLayout from '../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import EmptyState from './EmptyState'
import { createWebsite } from '../util/websiteFetch.util'
import { useSnackbar } from 'helpers/useSnackbar'
import WebsiteStatus from './WebsiteStatus'
import { useRouter } from 'next/navigation'
import WebsiteInbox from './WebsiteInbox'
import { useWebsite } from './WebsiteProvider'

export default function WebsitePage({ pathname }) {
  const router = useRouter()
  const [campaign] = useCampaign()
  const { website, setWebsite } = useWebsite()
  const [createLoading, setCreateLoading] = useState(false)
  const { errorSnackbar } = useSnackbar()

  async function handleCreate() {
    setCreateLoading(true)
    const resp = await createWebsite()
    if (resp.ok) {
      router.push(`/dashboard/website/editor`)
    } else {
      setWebsite(null)
      errorSnackbar('Failed to create website')
      setCreateLoading(false)
    }
  }

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <WebsiteStatus className="mb-6 lg:mb-8" website={website} />
      {website ? (
        <WebsiteInbox />
      ) : (
        <EmptyState
          onClickCreate={handleCreate}
          createLoading={createLoading}
        />
      )}
    </DashboardLayout>
  )
}
