import { memo } from 'react'
import WebsiteContent from 'app/(candidateWebsite)/c/[vanityPath]/components/WebsiteContent'
import Paper from '@shared/utils/Paper'
import Link from 'next/link'
import { WEBSITE_STATUS } from '../../util/website.util'

const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE || 'goodparty.org'

const WebsitePreview = memo(function WebsitePreview({
  website,
  campaign,
  className = '',
}) {
  const url = `${BASE_URL}/c/${website.vanityPath}${
    website.status === WEBSITE_STATUS.unpublished ? '/preview' : ''
  }`

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
          Preview: {url}
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        {campaign && website && (
          <WebsiteContent website={website} campaign={campaign} />
        )}
      </div>
    </Paper>
  )
})

export default WebsitePreview
