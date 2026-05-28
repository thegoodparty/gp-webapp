'use client'

import { useEffect, useState } from 'react'
import { FileText, Loader2, X } from 'lucide-react'
import { useAttachmentDownloadUrl } from '@shared/briefings/use-attachment-download-url'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

/**
 * Common identity + display shared by both attachment variants.
 */
type CommonItem = {
  id: string
  /** File name; rendered as `aria-label` / `title` on the thumbnail. */
  label: string
  /** Mime type drives the image-preview vs file-icon thumbnail choice. */
  mimeType: string
  /** When true, the X is replaced with a spinner (edit-mode in-flight ops). */
  busy?: boolean
}

/**
 * Two variants:
 *
 *   - `staged` — file the user just picked, not yet uploaded. The
 *     thumbnail is synthesized from the File via `URL.createObjectURL`
 *     (works for any MIME) and revoked on unmount.
 *   - `server` — already-uploaded attachment. The thumbnail fetches a
 *     short-lived presigned S3 GET URL via React Query, cached by
 *     (annotationId, attachmentId) so re-mounts hit the cache.
 *
 * Same shape powers both the editable picker and the read-only view in
 * NotesSurface; pass `onRemove` to render the X overlay, omit it to
 * render a view-only tile.
 */
export type AttachmentItem =
  | (CommonItem & { kind: 'staged'; file: File })
  | (CommonItem & {
      kind: 'server'
      annotationId: string
      attachmentId: string
    })

type Props = {
  item: AttachmentItem
  /**
   * When supplied, renders an X overlay that calls back with the item
   * id. Omit (or pass undefined) for a read-only thumbnail — used by
   * the note-view surface where attachments are display-only.
   */
  onRemove?: (id: string) => void
  /** Disables the X button (e.g. while a save is in flight). */
  disabled?: boolean
}

const isImageMime = (mime: string): boolean => mime.startsWith('image/')

/**
 * One attachment rendered as a clickable thumbnail tile. Click opens
 * the file in a new tab via the resolved URL (blob URL for staged
 * items, signed S3 URL for server items). Layout is fixed-size so a
 * grid of tiles doesn't reflow as URLs resolve.
 */
export default function AttachmentThumbnail({
  item,
  onRemove,
  disabled = false,
}: Props): React.JSX.Element {
  // Staged items: synthesize a blob URL once per File reference and
  // revoke it on cleanup. Keying off `stagedFile` (not the full `item`)
  // keeps the URL stable across busy-state churn — if `item.busy` flips
  // we don't want to recreate (and rebuild the `<img>`'s src). Creation
  // and cleanup both live in the same effect so StrictMode's simulated
  // remount produces a fresh, non-revoked URL on the second pass; doing
  // it in `useMemo` left the cached URL pointing at a revoked blob.
  const stagedFile = item.kind === 'staged' ? item.file : null
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!stagedFile) {
      setObjectUrl(null)
      return
    }
    if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function')
      return
    let url: string
    try {
      url = URL.createObjectURL(stagedFile)
    } catch {
      return
    }
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [stagedFile])

  // Server items: lazy-fetch the signed URL. Disabled for staged tiles
  // so we don't fire a phantom request.
  const isServer = item.kind === 'server'
  const annotationId = isServer ? item.annotationId : ''
  const attachmentId = isServer ? item.attachmentId : ''
  const downloadUrlQuery = useAttachmentDownloadUrl(
    annotationId,
    attachmentId,
    { enabled: isServer },
  )

  const url =
    item.kind === 'staged' ? objectUrl : downloadUrlQuery.data?.url ?? null
  const isImage = isImageMime(item.mimeType)

  const tileClass =
    'group relative inline-flex size-20 shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-muted text-muted-foreground'

  // Icon-area sizing: the parent is a fixed-size flex column with a label
  // strip at the bottom, so the icon container uses `min-h-0 flex-1` to
  // claim the remaining space and centers its child both axes.
  const iconAreaClass = 'flex min-h-0 flex-1 items-center justify-center'

  // For images, fall back to a spinner (not the document icon) while we
  // resolve the URL — covers both the staged blob-URL effect setting on
  // mount and the server-side signed-URL query in flight.
  const thumbnailContent =
    isImage && url ? (
      // eslint-disable-next-line @next/next/no-img-element -- presigned S3 / blob URL, not a stable Next image route
      <img src={url} alt={item.label} className="size-full object-cover" />
    ) : isImage ? (
      <Loader2 className="size-6 animate-spin" aria-hidden />
    ) : (
      <FileText className="size-7" aria-hidden />
    )

  const showRemove = onRemove !== undefined

  return (
    <div className={tileClass} title={item.label}>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={iconAreaClass}
          aria-label={`Open ${item.label}`}
          onClick={() =>
            trackEvent(EVENTS.BriefingAssistant.AttachmentClicked, {
              kind: item.kind,
              mimeType: item.mimeType,
              ...(item.kind === 'server'
                ? {
                    annotationId: item.annotationId,
                    attachmentId: item.attachmentId,
                  }
                : {}),
            })
          }
        >
          {thumbnailContent}
        </a>
      ) : (
        <span className={iconAreaClass}>{thumbnailContent}</span>
      )}
      {/* Filename strip — single truncated line at the bottom of the
          square. `text-[10px]` keeps an ~12-char filename readable in the
          80px-wide tile without forcing the whole pill any wider. */}
      <span className="block w-full truncate border-t border-border bg-card px-1 py-0.5 text-center text-[10px] leading-tight text-muted-foreground">
        {item.label}
      </span>
      {showRemove ? (
        item.busy ? (
          <span
            aria-hidden
            className="absolute right-1 top-1 inline-flex size-5 items-center justify-center rounded-full bg-card text-muted-foreground"
          >
            <Loader2 className="size-3 animate-spin" />
          </span>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              // Stops both bubble and default so the click doesn't also
              // fire the thumbnail's `<a>` and open a tab.
              e.stopPropagation()
              e.preventDefault()
              onRemove(item.id)
            }}
            disabled={disabled}
            aria-label={`Remove ${item.label}`}
            className="absolute right-1 top-1 inline-flex size-5 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm transition-colors hover:bg-foreground/10 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="size-3" aria-hidden />
          </button>
        )
      ) : null}
    </div>
  )
}
