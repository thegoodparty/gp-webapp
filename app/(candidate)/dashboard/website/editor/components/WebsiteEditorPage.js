'use client'
import { useState } from 'react'
import DashboardLayout from '../../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useSnackbar } from '@shared/utils/Snackbar'
import EditForm from './EditForm'
import WebsitePreview from './WebsitePreview'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { objectToFormData } from 'helpers/formDataHelper'

function updateWebsite(content) {
  try {
    const formData = objectToFormData(content)
    return clientFetch(apiRoutes.website.update, formData)
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export default function WebsiteEditorPage({ pathname, preloadedWebsite }) {
  const [campaign] = useCampaign()
  const [website, setWebsite] = useState(preloadedWebsite)
  const [saveLoading, setSaveLoading] = useState(false)
  const { errorSnackbar } = useSnackbar()

  function handleChange(updatedContent) {
    setWebsite((current) => ({ ...current, content: updatedContent }))
  }

  async function handleSave(updatedContent) {
    setSaveLoading(true)
    const resp = await updateWebsite(updatedContent)
    setSaveLoading(false)
    if (!resp.ok) {
      console.error('Failed to update website', resp)
      errorSnackbar('Failed to update website')
    }
  }

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <div className="flex gap-4">
        <EditForm
          onChange={handleChange}
          onSave={handleSave}
          saveLoading={saveLoading}
          content={website.content}
        />
        <WebsitePreview website={website} campaign={campaign} />
      </div>
    </DashboardLayout>
  )
}
