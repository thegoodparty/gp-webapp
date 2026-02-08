'use client'
import { useState } from 'react'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import Button from '@shared/buttons/Button'
import { voterFileDownload } from 'helpers/voterFileDownload'
import { Campaign } from 'helpers/types'

interface DownloadFileProps {
  type: string
  campaign: Campaign
  fileName: string | undefined
  isCustom: boolean
  index: number
}

const DownloadFile = (props: DownloadFileProps): React.JSX.Element => {
  const [loading, setLoading] = useState(false)
  const { type, campaign, fileName, isCustom, index } = props

  const handleDownload = async () => {
    if (loading) {
      return
    }
    trackEvent(EVENTS.VoterData.FileDetail.ClickDownloadCSV, {
      type,
      file: fileName || '',
    })
    setLoading(true)

    const downloadType = isCustom ? 'custom' : type
    const customFiles = campaign.data?.customVoterFiles
    const filters = isCustom && customFiles ? customFiles[index] : undefined

    trackEvent('Download Voter File attempt', { type: downloadType })
    try {
      await voterFileDownload(downloadType, filters)
      trackEvent('Download Voter File Success', { type: downloadType })
    } catch (error) {
      trackEvent('Download Voter File Failure', {
        type: downloadType,
        slug: campaign.slug,
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

export default DownloadFile
