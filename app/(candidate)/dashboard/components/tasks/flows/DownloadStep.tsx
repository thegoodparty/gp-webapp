'use client'
import { useMemo, useState } from 'react'
import H1 from '@shared/typography/H1'
import Button from '@shared/buttons/Button'
import { TASK_TYPES } from '../../../shared/constants/tasks.const'
import { useSnackbar } from 'helpers/useSnackbar'
import CopyScriptButton from '../CopyScriptButton'
import { buildTrackingAttrs, EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useSingleEffect } from '@shared/hooks/useSingleEffect'
import { doCreateOutReachEffectHandler } from 'app/(candidate)/dashboard/components/tasks/flows/util/doCreateOutReachEffectHandler.util'
import { downloadVoterList } from 'app/(candidate)/dashboard/outreach/util/downloadVoterList.util'
import { VoterFileFilters } from 'helpers/types'

const DOOR_KNOCKING_BLOG_URL =
  'https://goodparty.org/blog/tag/door-to-door-canvassing'
const PHONE_BANKING_BLOG_URL =
  'https://goodparty.org/blog/article/political-campaigns-phone-banking'

interface DownloadStepProps {
  type: string
  audience: VoterFileFilters
  scriptText: string
  onCreateOutreach?: () => Promise<void>
  voterCount?: number
}

export default function DownloadStep({
  type,
  audience,
  scriptText,
  onCreateOutreach = async () => {},
  voterCount = 0,
}: DownloadStepProps): React.JSX.Element {
  useSingleEffect(doCreateOutReachEffectHandler(onCreateOutreach), [])

  const [downloading, setDownloading] = useState(false)
  const { errorSnackbar } = useSnackbar()
  const blogUrl =
    type === TASK_TYPES.doorKnocking
      ? DOOR_KNOCKING_BLOG_URL
      : PHONE_BANKING_BLOG_URL

  const downloadTrackingAttrs = useMemo(
    () => buildTrackingAttrs('Download Voter List', { type }),
    [type],
  )

  const copyTrackingAttrs = useMemo(
    () => buildTrackingAttrs('Copy Script', { type }),
    [type],
  )

  const blogTrackingAttrs = useMemo(
    () => buildTrackingAttrs('Read Blog', { type }),
    [type],
  )

  const trackCompletionEvent = () => {
    trackEvent(
      type === TASK_TYPES.doorKnocking
        ? EVENTS.Outreach.DoorKnocking.Complete
        : EVENTS.Outreach.PhoneBanking.Complete,
      {
        medium: type,
        price: 0,
        voterContacts: voterCount || 0,
      },
    )
  }

  async function handleDownload() {
    trackCompletionEvent()
    await downloadVoterList(
      {
        voterFileFilter: audience,
        outreachType: type,
      },
      setDownloading,
      errorSnackbar,
    )
  }

  return (
    <div className="p-4">
      <H1 className="text-center mb-8">Download your materials</H1>
      <div className="flex flex-col gap-4 items-center">
        <CopyScriptButton
          scriptText={scriptText}
          trackingAttrs={copyTrackingAttrs}
          onCopy={trackCompletionEvent}
        />
        <Button
          size="large"
          color="secondary"
          onClick={handleDownload}
          disabled={downloading}
          loading={downloading}
          {...downloadTrackingAttrs}
        >
          Download voter list
        </Button>
        <Button
          href={blogUrl}
          onClick={trackCompletionEvent}
          target="_blank"
          size="large"
          color="neutral"
          {...blogTrackingAttrs}
        >
          Read more on our blog
        </Button>
      </div>
    </div>
  )
}
