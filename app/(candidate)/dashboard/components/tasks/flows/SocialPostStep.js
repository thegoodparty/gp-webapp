'use client'
import H1 from '@shared/typography/H1'
import Button from '@shared/buttons/Button'
import CopyScriptButton from '../CopyScriptButton'
import {
  FacebookLogo,
  InstagramLogo,
  NextdoorLogo,
  TwitterLogo,
} from '@shared/brand-logos'
import { buildTrackingAttrs } from 'helpers/analyticsHelper'
import { useMemo } from 'react'
import { useSingleEffect } from '@shared/hooks/useSingleEffect'
import { doCreateOutReachEffectHandler } from 'app/(candidate)/dashboard/components/tasks/flows/util/doCreateOutReachEffectHandler.util'

export default function SocialPostStep({
  type,
  scriptText,
  onCreateOutreach = async () => {},
}) {
  useSingleEffect(doCreateOutReachEffectHandler(onCreateOutreach), [])
  const copyTrackingAttrs = useMemo(
    () => buildTrackingAttrs('Copy Script', { type }),
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
      </div>
    </div>
  )
}
