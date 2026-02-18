'use client'

import { useState } from 'react'
import { Button } from 'goodparty-styleguide'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { usePoll } from '../../shared/hooks/PollProvider'

export default function DownloadResults() {
  const [poll] = usePoll()
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const res = await clientFetch(
        apiRoutes.polls.downloadResponses,
        { pollId: poll.id },
        { returnFullResponse: true },
      )

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${poll.name}-responses.csv`)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(link)
      } else {
        console.error('Failed to download poll responses', res)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={loading}>
      {loading ? 'Downloading...' : 'Download results'}
    </Button>
  )
}
