import { fetchVoterFile } from 'app/(candidate)/dashboard/voter-records/components/VoterRecordsPage'
import { format } from 'date-fns'

export async function voterFileDownload(type, filters, fileName) {
  const res = await fetchVoterFile(type, filters || undefined)

  if (res.ok) {
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      fileName || `${type}-${format(new Date(), 'yyyy-MM-dd')}.csv`,
    )
    document.body.appendChild(link)
    link.click()

    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)
    return Promise.resolve()
  } else {
    return Promise.reject(res)
  }
}
