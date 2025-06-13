'use client'
import { useState } from 'react'
import DashboardLayout from '../../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import WebsitePreview from './WebsitePreview'
import EditForm from './EditForm'

export default function WebsiteEditorPage({ pathname, preloadedWebsite }) {
  const [campaign] = useCampaign()
  const [website, setWebsite] = useState(preloadedWebsite)

  function handleChange(updatedContent) {
    console.log('save', updatedContent)

    setWebsite({
      ...website,
      content: updatedContent,
    })
  }

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <div className="flex gap-4">
        <EditForm onChange={handleChange} content={website.content} />
        <WebsitePreview website={website} campaign={campaign} />
      </div>
    </DashboardLayout>
  )
}
