'use client'
import { Button } from 'goodparty-styleguide'
import { useCustomSegments } from '../hooks/CustomSegmentsProvider'
import { fetchContactsCsv } from './ajaxActions'
import { dateUsHelper } from 'helpers/dateHelper'

export default function Download() {
  const [, , , querySegment] = useCustomSegments()

  const handleDownload = async () => {
    const res = await fetchContactsCsv(querySegment)

    if (res.ok) {
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const dateStr = dateUsHelper(new Date()).replace(/ /g, '_')
      link.setAttribute('download', `contacts_${dateStr}.csv`)
      document.body.appendChild(link)
      link.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } else {
      console.error('Failed to download contacts', res)
    }
  }

  return (
    <div className="absolute md:right-36 top-14 md:top-4 flex items-center gap-4">
      <Button variant="outline" onClick={handleDownload}>
        Download
      </Button>
    </div>
  )
}
