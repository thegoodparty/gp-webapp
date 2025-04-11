'use client'
import { useState } from 'react'
import H1 from '@shared/typography/H1'
import Button from '@shared/buttons/Button'
import { TASK_TYPES } from '../../constants/tasks.const'
import { fetchVoterFile } from 'app/(candidate)/dashboard/voter-records/components/VoterRecordsPage'
import { useSnackbar } from 'helpers/useSnackbar'
import { format } from 'date-fns'
import CopyScriptButton from '../CopyScriptButton'

const DOOR_KNOCKING_BLOG_URL =
  'https://goodparty.org/blog/tag/door-to-door-canvassing'
const PHONE_BANKING_BLOG_URL = 'https://goodparty.org/blog/tag/phone-banking'

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

  async function handleDownload() {
    setDownloading(true)
    const selectedAudience = Object.keys(audience).filter(
      (key) => audience[key] === true,
    )
    const res = await fetchVoterFile(type, {
      filters: selectedAudience,
    })

    if (res.ok) {
      // Read the response as Blob
      const blob = await res.blob()
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `${type}-${format(new Date(), 'yyyy-MM-dd')}.csv`,
      )
      document.body.appendChild(link)
      link.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } else {
      errorSnackbar('Error downloading voter file')
    }
    setDownloading(false)
  }

  return (
    <div className="p-4 min-w-[500px]">
      <H1 className="text-center mb-8">Download your materials</H1>
      <div className="flex flex-col gap-4 items-center">
        <CopyScriptButton scriptText={scriptText} />
        <Button
          size="large"
          color="secondary"
          onClick={handleDownload}
          disabled={downloading}
          loading={downloading}
        >
          Download voter list
        </Button>
        <Button href={blogUrl} target="_blank" size="large" color="neutral">
          Read more on our blog
        </Button>

        <Button
          href="/dashboard"
          size="large"
          variant="text"
          className="mt-8"
          onClick={closeCallback}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}
