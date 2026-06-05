'use client'

import { memo, useState } from 'react'
import StatusChip from './StatusChip'
import { Button } from '@styleguide'
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

interface WebsiteCardProps {
  className?: string
}

function WebsiteCard({
  className = '',
}: WebsiteCardProps): React.JSX.Element | null {
  const { website } = useWebsite()
  const [shareModalOpen, setShareModalOpen] = useState(false)

  if (!website) {
    return null
  }

  const { vanityPath, status, domain } = website

  const url = getWebsiteUrl(
    vanityPath,
    status === WEBSITE_STATUS.unpublished,
    domain,
  )

  return (
    <>
      <Paper className={`!p-4 lg:!p-6 !rounded-lg ${className}`}>
        <div className="md:flex gap-4 justify-between">
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
              variant="outline"
              onClick={() => setShareModalOpen(true)}
            >
              Share
            </Button>
            <Button
              asChild
              className="flex-1 min-w-[150px] flex justify-center items-center"
              variant="secondary"
            >
              <Link href="/dashboard/website/editor">Edit website</Link>
            </Button>
          </div>
        </div>
        {!isDomainActive(domain ?? undefined) && (
          <Button
            asChild
            className="mt-4 gap-2 w-full flex justify-center items-center"
            variant="outline"
          >
            <Link
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
            </Link>
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
