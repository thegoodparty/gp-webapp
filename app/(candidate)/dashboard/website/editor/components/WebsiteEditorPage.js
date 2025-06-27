'use client'
import { useState } from 'react'
import DashboardLayout from '../../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useSnackbar } from '@shared/utils/Snackbar'
import EditForm from './EditForm'
import WebsitePreview from './WebsitePreview'
import {
  updateWebsite,
  publishWebsite,
  unpublishWebsite,
  WEBSITE_STATUS,
  fetchWebsite,
} from '../../util/website.util'
import DomainForm from './DomainForm'

export default function WebsiteEditorPage({ pathname, preloadedWebsite }) {
  const [campaign] = useCampaign()
  const [website, setWebsite] = useState(preloadedWebsite)
  const [saveLoading, setSaveLoading] = useState(false)
  const { errorSnackbar } = useSnackbar()

  function handleContentChange(updatedContent) {
    setWebsite((current) => ({ ...current, content: updatedContent }))
  }

  function handleVanityPathChange(vanityPath) {
    setWebsite((current) => ({ ...current, vanityPath }))
  }

  async function handleRegisterSuccess() {
    const resp = await fetchWebsite()
    if (resp.ok) {
      setWebsite(resp.data)
    } else {
      console.error('Failed to reload website', resp)
      window.location.reload()
    }
  }

  async function handleSave(updatedContent) {
    setSaveLoading(true)
    const resp = await updateWebsite({
      ...updatedContent,
      vanityPath: website.vanityPath,
    })
    setSaveLoading(false)
    if (!resp.ok) {
      console.error('Failed to update website', resp)
      errorSnackbar('Failed to update website')
    }
  }

  async function handlePublish() {
    const resp = await publishWebsite()
    setWebsite((current) => ({ ...current, status: WEBSITE_STATUS.published }))
    if (!resp.ok) {
      console.error('Failed to publish website', resp)
      errorSnackbar('Failed to publish website')
    }
  }

  async function handleUnpublish() {
    const resp = await unpublishWebsite()
    setWebsite((current) => ({
      ...current,
      status: WEBSITE_STATUS.unpublished,
    }))
    if (!resp.ok) {
      console.error('Failed to unpublish website', resp)
      errorSnackbar('Failed to unpublish website')
    }
  }

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4">
          <DomainForm
            website={website}
            onVanityPathChange={handleVanityPathChange}
            onRegisterSuccess={handleRegisterSuccess}
          />
          <EditForm
            onChange={handleContentChange}
            onSave={handleSave}
            saveLoading={saveLoading}
            website={website}
            onPublish={handlePublish}
            onUnpublish={handleUnpublish}
          />
        </div>
        <WebsitePreview website={website} campaign={campaign} />
      </div>
    </DashboardLayout>
  )
}
