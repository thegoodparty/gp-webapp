'use client'

import { memo, useState } from 'react'
import StatusChip from './StatusChip'
import Button from '@shared/buttons/Button'
import H5 from '@shared/typography/H5'
import Paper from '@shared/utils/Paper'
import Link from 'next/link'
import ShareModal from './ShareModal'
import { useWebsite } from './WebsiteProvider'

const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE || 'goodparty.org'

function WebsiteCard({ className = '' }) {
  const { website } = useWebsite()

  const url = `${BASE_URL}/c/${website.vanityPath}`
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
            href={`/c/${website.vanityPath}`}
            className="mt-1 text-gray-500 text-xs truncate"
            target="_blank"
          >
            {url}
          </Link>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0 self-start">
          <Button
            className="flex-1 min-w-[150px]"
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
