'use client'
import { useState } from 'react'
import { fetchVoterFile } from '../../components/VoterRecordsPage'
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper'
import Button from '@shared/buttons/Button'

export default function DownloadFile(props) {
  const [loading, setLoading] = useState(false)
  const { type, campaign, fileName, isCustom, index } = props

  const handleDownload = async () => {
    if (loading) {
      return
    }
    trackEvent(EVENTS.VoterData.FileDetail.ClickDownloadCSV, {
      type,
      file: fileName,
    })
    setLoading(true)
    let response
    if (isCustom) {
      trackEvent('Download Voter File attempt', { type: 'custom' })
      const customFilters = campaign.data.customVoterFiles[index]
      response = await fetchVoterFile('custom', customFilters)
    } else {
      response = await fetchVoterFile(type)
      trackEvent('Download Voter File attempt', { type })
    }

    if (response) {
      // Read the response as Blob
      const blob = await response.blob()
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${fileName}.csv`)
      document.body.appendChild(link)
      link.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
      trackEvent('Download Voter File Success', { type })
    } else {
      trackEvent('Download Voter File Failure', {
        type,
        slug: props.campaign.slug,
      })
    }
    setLoading(false)
  }

  return (
    <div className="mt-3 md:mt-0">
      <Button
        size="large"
        className="w-full"
        disabled={loading}
        onClick={handleDownload}
        loading={loading}
      >
        Download CSV
      </Button>
    </div>
  )
}
