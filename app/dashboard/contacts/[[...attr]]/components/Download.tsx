'use client'
import { IconButton } from '@styleguide'
import { useContactsTable } from '../hooks/ContactsTableProvider'
import { type SegmentResponse } from './shared/contacts-types'
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

  // Trigger the contacts CSV download via a top-level browser navigation so
  // bytes stream directly to disk. Avoids buffering the entire response (up
  // to ~700 MB for a 1M-row district) into a JS Blob, which would OOM mid-
  // tier laptops and show no download progress. Auth + the
  // `x-organization-slug` header are added automatically by Next.js
  // middleware in `helpers/handleApiRequestRewrite.ts` when the request
  // passes through `/api/v1/...`.
  const handleDownload = (): void => {
    if (!canUseProFeatures) {
      showProUpgradeModal(true)
      return
    }

    const query = new URLSearchParams()
    if (currentSegment) {
      query.set('segment', currentSegment)
    }
    const queryString = query.toString()
    const href = `/api/v1/contacts/download${
      queryString ? `?${queryString}` : ''
    }`
    const dateStr = dateUsHelper(new Date()).replace(/ /g, '_')

    const link = document.createElement('a')
    link.href = href
    link.setAttribute('download', `contacts_${dateStr}.csv`)
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    link.remove()

    // We cannot observe completion of a top-level download, so fire the
    // analytics event at click time. The download will continue in the
    // browser's native UI even if the user navigates away.
    trackEvent(EVENTS.Contacts.Download, generateProperties())
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
