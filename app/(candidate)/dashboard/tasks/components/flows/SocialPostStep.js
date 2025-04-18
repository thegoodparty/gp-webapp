'use client'
import H1 from '@shared/typography/H1'
import Button from '@shared/buttons/Button'
import CopyScriptButton from '../CopyScriptButton'
import {
  InstagramLogo,
  FacebookLogo,
  TwitterLogo,
  NextdoorLogo,
} from '@shared/brand-logos'
import { buildTrackingAttrs } from 'helpers/fullStoryHelper'
import { useMemo } from 'react'

export default function SocialPostStep({ type, scriptText, closeCallback }) {
  const copyTrackingAttrs = useMemo(
    () => buildTrackingAttrs('Copy Script', { type }),
    [type],
  )

  const returnTrackingAttrs = useMemo(
    () => buildTrackingAttrs('Return to Dashboard', { type }),
    [type],
  )

  return (
    <div className="p-4 min-w-[600px]">
      <H1 className="text-center mb-8">Post to social media</H1>
      <div className="flex flex-col gap-4 items-center">
        <CopyScriptButton
          scriptText={scriptText}
          trackingAttrs={copyTrackingAttrs}
        />

        <div className="mx-auto my-6 h-[1px] w-[35%] bg-black/[0.12]"></div>
        <div className="flex-col md:grid grid-cols-2 gap-x-8 gap-y-4">
          <Button
            href="https://www.instagram.com/"
            target="_blank"
            className="flex items-center gap-2 min-w-[190px]"
            variant="text"
            size="large"
          >
            <InstagramLogo /> Instagram
          </Button>
          <Button
            href="https://www.facebook.com/"
            target="_blank"
            className="flex items-center gap-2 min-w-[190px]"
            variant="text"
            size="large"
          >
            <FacebookLogo /> Facebook
          </Button>
          <Button
            href="https://x.com/compose/post"
            target="_blank"
            className="flex items-center gap-2 min-w-[190px]"
            variant="text"
            size="large"
          >
            <TwitterLogo /> X
          </Button>
          <Button
            href="https://www.nextdoor.com/"
            target="_blank"
            className="flex items-center gap-2 min-w-[190px]"
            variant="text"
            size="large"
          >
            <NextdoorLogo /> Nextdoor
          </Button>
        </div>
        <div className="mx-auto my-6 h-[1px] w-[35%] bg-black/[0.12]"></div>
        <Button
          href="/dashboard"
          size="large"
          variant="text"
          onClick={closeCallback}
          {...returnTrackingAttrs}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}
