'use client'
import { useMemo, useState } from 'react'
import H1 from '@shared/typography/H1'
import Button from '@shared/buttons/Button'
import { TASK_TYPES } from '../../../shared/constants/tasks.const'
import { useSnackbar } from 'helpers/useSnackbar'
import CopyScriptButton from '../CopyScriptButton'
import { voterFileDownload } from 'helpers/voterFileDownload'
import { buildTrackingAttrs } from 'helpers/analyticsHelper'

const DOOR_KNOCKING_BLOG_URL =
  'https://goodparty.org/blog/tag/door-to-door-canvassing'
const PHONE_BANKING_BLOG_URL =
  'https://goodparty.org/blog/article/political-campaigns-phone-banking'

export default function DownloadStep({
  type,
  audience,
  scriptText,
  closeCallback,
}) {
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

  const returnTrackingAttrs = useMemo(
    () => buildTrackingAttrs('Return to Dashboard', { type }),
    [type],
  )

  async function handleDownload() {
    setDownloading(true)
    const selectedAudience = Object.keys(audience).filter(
      (key) => audience[key] === true,
    )

    try {
      await voterFileDownload(type, { filters: selectedAudience })
    } catch (error) {
      errorSnackbar('Error downloading voter file')
    }

    setDownloading(false)
  }

  return (
    <div className="p-4 min-w-[500px]">
      <H1 className="text-center mb-8">Download your materials</H1>
      <div className="flex flex-col gap-4 items-center">
        <CopyScriptButton
          scriptText={scriptText}
          trackingAttrs={copyTrackingAttrs}
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
          target="_blank"
          size="large"
          color="neutral"
          {...blogTrackingAttrs}
        >
          Read more on our blog
        </Button>

        <Button
          href="/dashboard"
          size="large"
          variant="text"
          className="mt-8"
          onClick={closeCallback}
          {...returnTrackingAttrs}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}
