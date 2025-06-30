import { memo } from 'react'
import StatusChip from './StatusChip'
import Button from '@shared/buttons/Button'
import H5 from '@shared/typography/H5'
import Paper from '@shared/utils/Paper'
import Link from 'next/link'
import { WEBSITE_STATUS } from '../util/websiteFetch.util'

function WebsiteStatus({ website, className = '' }) {
  const isPublished = website.status === WEBSITE_STATUS.published
  const url = `goodparty.org/c/${website.vanityPath}`

  return (
    <Paper
      className={`flex items-center justify-between gap-6 !p-4 !rounded-lg ${className}`}
    >
      <div>
        <div className="flex items-center gap-3">
          <H5 className="m-0">Your campaign website</H5>
          <StatusChip status={website.status} />
        </div>
        {isPublished && (
          <Link
            href={`/c/${website.vanityPath}`}
            className="mt-1 text-gray-500 text-xs truncate"
            target="_blank"
          >
            {url}
          </Link>
        )}
      </div>
      <div className="flex gap-4">
        {isPublished ? (
          <>
            <Button disabled>Share</Button>
            <Button color="neutral" href="/dashboard/website/editor">
              Edit website
            </Button>
          </>
        ) : (
          <Button color="secondary" href="/dashboard/website/editor">
            Complete and publish
          </Button>
        )}
      </div>
    </Paper>
  )
}

export default memo(WebsiteStatus)
