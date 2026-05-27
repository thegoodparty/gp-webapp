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
import { useEffect, useRef, useState } from 'react'
import { useSnackbar } from 'helpers/useSnackbar'
import { deleteCookie, getCookie } from 'helpers/cookieHelper'

const DOWNLOAD_COOKIE_NAME = 'gp_download'
const DOWNLOAD_COOKIE_POLL_MS = 250
// Fallback in case the server-side cookie handshake is missing (older deploy,
// proxy stripped Set-Cookie, etc.). Long enough to overlap with first byte on
// large districts, short enough to avoid leaving a stuck spinner forever.
const DOWNLOAD_FALLBACK_TIMEOUT_MS = 15000

// `getCookie` returns `string | false`; normalize to `string | null` and
// guard against `decodeURI` throwing on a malformed cookie value (which
// would otherwise surface as an uncaught error inside the 250ms poll).
const readDownloadCookie = (): string | null => {
  try {
    const value = getCookie(DOWNLOAD_COOKIE_NAME)
    return value === false ? null : value
  } catch {
    return null
  }
}

export default function Download() {
  const showProUpgradeModal = useShowContactProModal()
  const { customSegments, currentSegment, canUseProFeatures } =
    useContactsTable()
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const [isPreparing, setIsPreparing] = useState(false)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fallbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearDownloadWatchers = (): void => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current)
      fallbackTimeoutRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      clearDownloadWatchers()
    }
  }, [])

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

    // Snapshot the current value of the download cookie so a stale token from
    // a previous download doesn't make the spinner clear instantly.
    const cookieBeforeClick = readDownloadCookie()

    setIsPreparing(true)
    successSnackbar(
      'Preparing your download. Large districts can take 10-15 seconds...',
      { autoHideDuration: 12000 },
    )

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

    clearDownloadWatchers()

    // Poll for the gp_download cookie set by gp-api. The browser commits
    // cookies from a download response, so the moment the cookie appears we
    // know the server has actually started streaming and can swap the
    // "preparing" feedback for a "started" confirmation. Each download mints
    // a fresh UUID server-side and overwrites the previous value, so the
    // `current !== cookieBeforeClick` check still detects subsequent
    // downloads, but we proactively clear the cookie on success/timeout to
    // avoid stale state surviving across navigations.
    pollIntervalRef.current = setInterval(() => {
      const current = readDownloadCookie()
      if (current && current !== cookieBeforeClick) {
        clearDownloadWatchers()
        deleteCookie(DOWNLOAD_COOKIE_NAME)
        setIsPreparing(false)
        successSnackbar('Download started', { autoHideDuration: 3000 })
      }
    }, DOWNLOAD_COOKIE_POLL_MS)

    // The fallback fires for two distinct cases we cannot disambiguate from
    // the client (top-level downloads expose no programmatic completion):
    //   1. A real error path (4xx/5xx, network failure) — the cookie never
    //      arrives and the user genuinely needs to retry.
    //   2. A successful download whose handshake we missed (proxy stripped
    //      Set-Cookie, or TTFB exceeded the fallback window for a very large
    //      district). In this case bytes ARE streaming to disk.
    // A categorical "Download failed" message would lie to users in case 2,
    // so we surface a neutral conditional prompt that's actionable in case 1
    // and harmless in case 2.
    fallbackTimeoutRef.current = setTimeout(() => {
      clearDownloadWatchers()
      deleteCookie(DOWNLOAD_COOKIE_NAME)
      setIsPreparing(false)
      errorSnackbar(
        "If your download hasn't started, please try again.",
        { autoHideDuration: 6000 },
      )
    }, DOWNLOAD_FALLBACK_TIMEOUT_MS)

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
        loading={isPreparing}
        className="hidden md:flex"
      >
        {!canUseProFeatures ? <Lock /> : <LuDownload />}
      </IconButton>
    </>
  )
}
