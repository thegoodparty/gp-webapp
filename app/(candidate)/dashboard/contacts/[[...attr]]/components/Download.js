'use client'
import { IconButton } from 'goodparty-styleguide'
import { useCustomSegments } from '../hooks/CustomSegmentsProvider'
import { fetchContactsCsv } from './shared/ajaxActions'
import { dateUsHelper } from 'helpers/dateHelper'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { isCustomSegment, findCustomSegment } from './shared/segments.util'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useShowContactProModal } from '../hooks/ContactProModal'
import { Lock } from '@mui/icons-material'
import { LuDownload } from 'react-icons/lu'

export default function Download() {
  const [campaign] = useCampaign()
  const showProUpgradeModal = useShowContactProModal()
  const [customSegments, , , querySegment] = useCustomSegments()

  const handleDownload = async () => {
    if (!campaign?.isPro) {
      showProUpgradeModal(true)
      return
    }
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
      const properties = generateProperties()

      trackEvent(EVENTS.Contacts.Download, properties)
    } else {
      console.error('Failed to download contacts', res)
    }
  }

  const generateProperties = () => {
    if (!isCustomSegment(customSegments, querySegment)) {
      return {
        filters: null,
        isCustomSegment: false,
        isDefaultSegment: true,
        segment: querySegment,
      }
    }
    return {
      filters: filters(),
      isCustomSegment: true,
      isDefaultSegment: false,
    }
  }

  const filters = () => {
    if (!isCustomSegment(customSegments, querySegment)) {
      return null
    }
    const allFilters = findCustomSegment(customSegments, querySegment)
    return filterOnlyTrueValues(allFilters)
  }

  return (
    <>
      <IconButton
        variant="outline"
        onClick={handleDownload}
        className="hidden md:flex"
      >
        {!campaign?.isPro ? <Lock /> : <LuDownload />}
      </IconButton>
    </>
  )
}
