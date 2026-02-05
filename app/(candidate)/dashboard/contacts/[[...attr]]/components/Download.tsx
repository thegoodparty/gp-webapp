'use client'
import { IconButton } from 'goodparty-styleguide'
import { useContactsTable } from '../hooks/ContactsTableProvider'
import { fetchContactsCsv, type SegmentResponse } from './shared/ajaxActions'
import { dateUsHelper } from 'helpers/dateHelper'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import {
  isCustomSegment,
  findCustomSegment,
  filterOnlyTrueValues,
} from './shared/segments.util'
import { useShowContactProModal } from '../hooks/ContactProModal'
import { Lock } from '@mui/icons-material'
import { LuDownload } from 'react-icons/lu'

export default function Download() {
  const showProUpgradeModal = useShowContactProModal()
  const { customSegments, currentSegment, canUseProFeatures } =
    useContactsTable()

  const handleDownload = async (): Promise<void> => {
    if (!canUseProFeatures) {
      showProUpgradeModal(true)
      return
    }
    const res = await fetchContactsCsv(currentSegment)

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

  const generateProperties = (): Record<
    string,
    string | number | boolean | null | undefined
  > => {
    if (!currentSegment || !isCustomSegment(customSegments, currentSegment)) {
      return {
        filters: null,
        isCustomSegment: false,
        isDefaultSegment: true,
        segment: currentSegment,
      }
    }
    const filterValues = filters()
    return {
      filters: filterValues ? JSON.stringify(filterValues) : null,
      isCustomSegment: true,
      isDefaultSegment: false,
    }
  }

  const filters = (): string[] | null => {
    if (!currentSegment || !isCustomSegment(customSegments, currentSegment)) {
      return null
    }
    const allFilters = findCustomSegment(customSegments, currentSegment) as
      | SegmentResponse
      | undefined
    if (!allFilters) {
      return null
    }
    const filterRecord: Record<string, boolean> = {}
    for (const [key, value] of Object.entries(allFilters)) {
      if (
        key !== 'id' &&
        key !== 'value' &&
        key !== 'name' &&
        typeof value === 'boolean'
      ) {
        filterRecord[key] = value
      }
    }
    return filterOnlyTrueValues(filterRecord)
  }

  return (
    <>
      <IconButton
        variant="outline"
        onClick={handleDownload}
        className="hidden md:flex"
      >
        {!canUseProFeatures ? <Lock /> : <LuDownload />}
      </IconButton>
    </>
  )
}
