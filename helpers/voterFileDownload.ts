import { fetchVoterFile, CustomFilters } from 'app/(candidate)/dashboard/voter-records/components/VoterRecordsPage'
import { format } from 'date-fns'

export const voterFileDownload = async (
  type: string,
  filters: CustomFilters | undefined,
  fileName?: string,
): Promise<void> => {
  const res = await fetchVoterFile(type, filters)

  if (res && res.ok && res.blob) {
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
  }
  return Promise.reject(res)
}

