'use client'
import { useState } from 'react'
import DashboardLayout from '../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import { createWebsite } from '../util/website.util'
import { useSnackbar } from 'helpers/useSnackbar'
import { useRouter } from 'next/navigation'
import { useWebsite } from './WebsiteProvider'
import { WEBSITE_STATUS } from '../util/website.util'
import EmptyState from './EmptyState'
import DraftState from './DraftState'
import PublishedState from './PublishedState'

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
      {website ? (
        website.status === WEBSITE_STATUS.unpublished ? (
          <DraftState />
        ) : (
          <PublishedState />
        )
      ) : (
        <EmptyState
          onClickCreate={handleCreate}
          createLoading={createLoading}
        />
      )}
    </DashboardLayout>
  )
}
