'use client'

import { useEffect, useState } from 'react'
import { FileText, Loader2, X } from 'lucide-react'
import { useAttachmentDownloadUrl } from '@shared/briefings/use-attachment-download-url'

/**
 * Common identity + display shared by both attachment variants.
 */
type CommonItem = {
  id: string
  /** File name; rendered as the row's primary label. */
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
 * render a view-only row.
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
   * When supplied, renders an X button at the right of the row that
   * calls back with the item id. Omit for a read-only row — used by
   * the note-view surface where attachments are display-only.
   */
  onRemove?: (id: string) => void
  /** Disables the X button (e.g. while a save is in flight). */
  disabled?: boolean
}

const isImageMime = (mime: string): boolean => mime.startsWith('image/')

/**
 * One attachment rendered as a full-width clickable row: small thumbnail
 * on the left (image preview for image MIMEs, document icon for the
 * rest), filename in the middle, optional remove (X) button on the
 * right. Click the row to open the file in a new tab via the resolved
 * URL (blob URL for staged items, signed S3 URL for server items).
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

  // Server items: lazy-fetch the signed URL. Disabled for staged rows
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

  const rowClass =
    'group relative flex w-full items-center gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground'

  // Square thumbnail well: the image fills via `object-cover`, the
  // document/loading icon centers inside.
  const thumbWellClass =
    'flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground'

  // For images, fall back to a spinner (not the document icon) while we
  // resolve the URL — covers both the staged blob-URL effect setting on
  // mount and the server-side signed-URL query in flight.
  const thumbnailContent =
    isImage && url ? (
      // eslint-disable-next-line @next/next/no-img-element -- presigned S3 / blob URL, not a stable Next image route
      <img src={url} alt={item.label} className="size-full object-cover" />
    ) : isImage ? (
      <Loader2 className="size-5 animate-spin" aria-hidden />
    ) : (
      <FileText className="size-5" aria-hidden />
    )

  const showRemove = onRemove !== undefined

  // The link wraps the thumb + filename so the click target is the
  // whole row except the X button. When there's no URL yet (e.g.
  // signed-URL still loading), we render the same layout without an
  // anchor so the row doesn't briefly turn into a non-clickable shell
  // and back.
  const labelText = (
    <span className="min-w-0 flex-1 truncate" title={item.label}>
      {item.label}
    </span>
  )

  return (
    <div className={rowClass}>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-1 items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Open ${item.label}`}
        >
          <span className={thumbWellClass}>{thumbnailContent}</span>
          {labelText}
        </a>
      ) : (
        <span className="flex min-w-0 flex-1 items-center gap-3">
          <span className={thumbWellClass}>{thumbnailContent}</span>
          {labelText}
        </span>
      )}
      {showRemove ? (
        item.busy ? (
          <span
            aria-hidden
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground"
          >
            <Loader2 className="size-3.5 animate-spin" />
          </span>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              // Stops both bubble and default so the click doesn't also
              // fire the row's `<a>` and open a tab.
              e.stopPropagation()
              e.preventDefault()
              onRemove(item.id)
            }}
            disabled={disabled}
            aria-label={`Remove ${item.label}`}
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        )
      ) : null}
    </div>
  )
}
