'use client'

import { memo, useMemo } from 'react'
import WebsiteContent from 'app/(candidateWebsite)/c/[vanityPath]/components/WebsiteContent'
import Paper from '@shared/utils/Paper'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useUser } from '@shared/hooks/useUser'

const WebsitePreview = memo(function WebsitePreview({
  website: propWebsite,
  className = '',
  zoomScale = 1,
}) {
  const [campaign] = useCampaign()
  const [user] = useUser()

  const website = useMemo(() => {
    if (propWebsite) {
      return {
        ...propWebsite,
        campaign: { ...campaign, user },
      }
    }
    return null
  }, [propWebsite, campaign, user])

  return (
    <Paper className={`!p-0 flex-grow h-full flex flex-col ${className}`}>
      <div className="p-4 border-b items-center gap-6 sticky hidden lg:flex">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-500 text-xs">Preview</span>
      </div>
      <div className="flex-1 overflow-y-auto rounded-xl">
        {campaign && website && (
          <div className="pointer-events-none">
            <WebsiteContent website={website} scale={zoomScale} />
          </div>
        )}
      </div>
    </Paper>
  )
})

export default WebsitePreview
