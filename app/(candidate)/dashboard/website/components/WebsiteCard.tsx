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
import { BsGlobe } from 'react-icons/bs'
import Body1 from '@shared/typography/Body1'
import { isDomainActive } from '../util/domain.util'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

type WebsiteCardProps = {
  className?: string
}

function WebsiteCard({ className = '' }: WebsiteCardProps): React.JSX.Element {
  const { website } = useWebsite()

  const { vanityPath, status, domain } = website || {}

  const url = getWebsiteUrl(
    String(vanityPath || ''),
    status === WEBSITE_STATUS.unpublished,
    domain,
  )
  const [shareModalOpen, setShareModalOpen] = useState(false)

  return (
    <>
      <Paper className={`!p-4 lg:!p-6 !rounded-lg ${className}`}>
        <div className="md:flex gap-4 justify-between">
          <div>
            <H5>
              <StatusChip status={website?.status} />
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
        </div>
        {!isDomainActive(domain || undefined) && (
          <Button
            className="mt-4 gap-2 w-full flex justify-center items-center"
            color="neutral"
            variant="outlined"
            href="/dashboard/website/domain"
            onClick={() =>
              trackEvent(EVENTS.CandidateWebsite.StartedDomainSelection)
            }
          >
            <BsGlobe size={20} />
            {domain?.name ? (
              <Body1>Continue domain setup for {domain?.name}</Body1>
            ) : (
              <Body1>Add a domain</Body1>
            )}
          </Button>
        )}
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
