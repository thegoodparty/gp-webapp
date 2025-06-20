'use client'
import { useState } from 'react'
import DashboardLayout from '../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import EmptyState from './EmptyState'
import { createWebsite } from '../util/websiteFetch.util'
import { useSnackbar } from 'helpers/useSnackbar'
import Button from '@shared/buttons/Button'
import Paper from '@shared/utils/Paper'
import H3 from '@shared/typography/H3'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import StatusChip from './StatusChip'
import { useRouter } from 'next/navigation'

export default function WebsitePage({ pathname, preloadedWebsite }) {
  const [campaign] = useCampaign()
  const router = useRouter()
  const [website, setWebsite] = useState(preloadedWebsite)
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
      {!website ? (
        <EmptyState
          onClickCreate={handleCreate}
          createLoading={createLoading}
        />
      ) : (
        <div>
          <H1>Website</H1>
          <Body2 className="mt-2">
            Manage your campaign&apos;s online presence
          </Body2>
          <Paper className="flex items-center gap-2 mt-4">
            <H3 className="m-0">Your campaign website </H3>
            <StatusChip status={website.status} />
            <Button
              className="ml-auto"
              color="secondary"
              href="/dashboard/website/editor"
            >
              Edit Site
            </Button>
          </Paper>
        </div>
      )}
    </DashboardLayout>
  )
}
