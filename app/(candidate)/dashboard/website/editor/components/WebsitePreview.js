'use client'

import { memo, useMemo } from 'react'
import WebsiteContent from 'app/(candidateWebsite)/c/[vanityPath]/components/WebsiteContent'
import Paper from '@shared/utils/Paper'
import Link from 'next/link'
import { getWebsiteUrl } from '../../util/website.util'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useUser } from '@shared/hooks/useUser'

const WebsitePreview = memo(function WebsitePreview({
  website: propWebsite,
  className = '',
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

  const url = getWebsiteUrl(website)

  return (
    <Paper className={`!p-0 flex-grow h-full flex flex-col ${className}`}>
      <div className="p-4 border-b items-center gap-6 sticky hidden lg:flex">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <Link
          href={`${url}`}
          className="text-gray-500 text-xs truncate"
          target="_blank"
        >
          {url}
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        {campaign && website && (
          <div className="pointer-events-none">
            <WebsiteContent website={website} scale={0.5} />
          </div>
        )}
      </div>
    </Paper>
  )
})

export default WebsitePreview
