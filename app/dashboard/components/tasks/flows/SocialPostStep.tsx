'use client'
import H1 from '@shared/typography/H1'
import { Button } from '@styleguide'
import Link from 'next/link'
import CopyScriptButton from '../CopyScriptButton'
import {
  FacebookLogo,
  InstagramLogo,
  NextdoorLogo,
  TwitterLogo,
} from '@shared/brand-logos'
import { buildTrackingAttrs, EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useMemo } from 'react'
import { useSingleEffect } from '@shared/hooks/useSingleEffect'
import { doCreateOutReachEffectHandler } from 'app/dashboard/components/tasks/flows/util/doCreateOutReachEffectHandler.util'
import { OUTREACH_TYPES } from 'app/dashboard/outreach/constants'
import { noopAsync } from '@shared/utils/noop'

interface SocialPostStepProps {
  scriptText: string
  onCreateOutreach?: () => Promise<void>
}

export default function SocialPostStep({
  scriptText,
  onCreateOutreach = noopAsync,
}: SocialPostStepProps): React.JSX.Element {
  useSingleEffect(doCreateOutReachEffectHandler(onCreateOutreach), [])
  const copyTrackingAttrs = useMemo(
    () =>
      buildTrackingAttrs('Copy Script', { type: OUTREACH_TYPES.socialMedia }),
    [OUTREACH_TYPES.socialMedia],
  )

  const trackCompletionEvent = () =>
    trackEvent(EVENTS.Outreach.SocialMedia.Complete, {
      medium: OUTREACH_TYPES.socialMedia,
      price: 0,
      voterContacts: 0,
    })

  return (
    <div className="p-4 min-w-[600px]">
      <H1 className="text-center mb-8">Post to social media</H1>
      <div className="flex flex-col gap-4 items-center">
        <CopyScriptButton
          scriptText={scriptText}
          trackingAttrs={copyTrackingAttrs}
          onCopy={trackCompletionEvent}
        />

        <div className="mx-auto my-6 h-[1px] w-[35%] bg-black/[0.12]"></div>
        <div className="flex-col md:grid grid-cols-2 gap-x-8 gap-y-4">
          <Button
            asChild
            variant="ghost"
            size="large"
            className="flex items-center gap-2 min-w-[190px]"
          >
            <Link
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackCompletionEvent}
            >
              <InstagramLogo /> Instagram
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="large"
            className="flex items-center gap-2 min-w-[190px]"
          >
            <Link
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackCompletionEvent}
            >
              <FacebookLogo /> Facebook
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="large"
            className="flex items-center gap-2 min-w-[190px]"
          >
            <Link
              href="https://x.com/compose/post"
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackCompletionEvent}
            >
              <TwitterLogo /> X
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="large"
            className="flex items-center gap-2 min-w-[190px]"
          >
            <Link
              href="https://www.nextdoor.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackCompletionEvent}
            >
              <NextdoorLogo /> Nextdoor
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
