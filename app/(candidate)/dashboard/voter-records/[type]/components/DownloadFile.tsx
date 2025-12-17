'use client'
import { useState } from 'react'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import Button from '@shared/buttons/Button'
import { voterFileDownload } from 'helpers/voterFileDownload'

interface Campaign {
  slug: string
  data: {
    customVoterFiles?: []
  }
}

interface DownloadFileProps {
  type: string
  campaign: Campaign
  fileName: string
  isCustom: boolean
  index: number
}

export default function DownloadFile(props: DownloadFileProps): React.JSX.Element {
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

    const downloadType = isCustom ? 'custom' : type
    const filters = isCustom ? campaign.data.customVoterFiles?.[index] : undefined

    trackEvent('Download Voter File attempt', { type: downloadType })
    try {
      await voterFileDownload(downloadType, filters)
      trackEvent('Download Voter File Success', { type: downloadType })
    } catch (error) {
      trackEvent('Download Voter File Failure', {
        type: downloadType,
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
