'use client'

import { memo, useState } from 'react'
import StatusChip from './StatusChip'
import Button from '@shared/buttons/Button'
import H5 from '@shared/typography/H5'
import Paper from '@shared/utils/Paper'
import Link from 'next/link'
import ShareModal from './ShareModal'
import { useWebsite } from './WebsiteProvider'
import { getWebsiteUrl, WEBSITE_STATUS } from '../util/website.util'

function WebsiteCard({ className = '' }) {
  const { website } = useWebsite()

  const url = getWebsiteUrl(
    website.vanityPath,
    website.status === WEBSITE_STATUS.unpublished,
  )
  const [shareModalOpen, setShareModalOpen] = useState(false)

  return (
    <>
      <Paper
        className={`md:flex gap-4 justify-between !p-4 lg:!p-6 !rounded-lg ${className}`}
      >
        <div>
          <H5>
            <StatusChip status={website.status} />
            <span className="block mt-1">Your campaign website</span>
          </H5>

          <Link
            href={url}
            className="mt-1 text-gray-500 text-xs truncate"
            target="_blank"
          >
            {url}
          </Link>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0 self-start">
          <Button
            className="flex-1 min-w-[150px]"
            variant="outlined"
            onClick={() => setShareModalOpen(true)}
          >
            Share
          </Button>
          <Button
            className="flex-1 min-w-[150px] flex justify-center items-center"
            color="neutral"
            href="/dashboard/website/editor"
          >
            Edit website
          </Button>
        </div>
      </Paper>
      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={url}
      />
    </>
  )
}

export default memo(WebsiteCard)
