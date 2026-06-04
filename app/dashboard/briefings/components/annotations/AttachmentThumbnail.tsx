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
 * One attachment rendered as a full-width clickable card: a large
 * `aspect-video` preview well on top (image at full container width for
 * image MIMEs, large document icon centered for the rest), a filename
 * strip beneath, and an optional remove (X) button overlaid on the
 * top-right corner. Click the preview to open the file in a new tab
 * via the resolved URL (blob URL for staged items, signed S3 URL for
 * server items). The preview is intentionally big — the parent dropped
 * inline tiles in favor of stacked full-width cards so users can
 * actually see what they're attaching before saving.
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
    item.kind === 'staged' ? objectUrl : (downloadUrlQuery.data?.url ?? null)
  const isImage = isImageMime(item.mimeType)

  const cardClass =
    'group relative flex w-full flex-col overflow-hidden rounded-lg border border-border bg-muted/40 text-foreground'

  // When we have a real image to show, the preview wrapper drops its
  // fixed aspect ratio and lets the `<img>` render at its natural
  // proportions (full container width, height set by the image's own
  // ratio). This avoids cropping that `object-cover` would impose and
  // matches the user expectation: see the whole image, not a slice.
  //
  // For documents and for images whose URL is still resolving, we keep
  // the 16:9 well so the card has substantial presence and a centered
  // icon / spinner. Once a server-side image URL resolves we transition
  // out of the aspect-video well into the natural-ratio image.
  const isImageReady = isImage && url !== null
  const previewWrapperClass = isImageReady
    ? 'relative block w-full overflow-hidden bg-muted'
    : 'relative flex aspect-video w-full items-center justify-center overflow-hidden bg-muted text-muted-foreground'

  const previewContent = isImageReady ? (
    // eslint-disable-next-line @next/next/no-img-element -- presigned S3 / blob URL, not a stable Next image route
    <img src={url} alt={item.label} className="block h-auto w-full" />
  ) : isImage ? (
    <Loader2 className="size-8 animate-spin" aria-hidden />
  ) : (
    <FileText className="size-12" aria-hidden />
  )

  const showRemove = onRemove !== undefined

  return (
    <div className={cardClass}>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${previewWrapperClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
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
          {previewContent}
        </a>
      ) : (
        <span className={previewWrapperClass}>{previewContent}</span>
      )}
      <span
        className="block w-full truncate border-t border-border bg-card px-3 py-2 text-sm text-foreground"
        title={item.label}
      >
        {item.label}
      </span>
      {showRemove ? (
        item.busy ? (
          <span
            aria-hidden
            className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-sm"
          >
            <Loader2 className="size-4 animate-spin" />
          </span>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              // Stops both bubble and default so the click doesn't also
              // fire the preview's `<a>` and open a tab.
              e.stopPropagation()
              e.preventDefault()
              onRemove(item.id)
            }}
            disabled={disabled}
            aria-label={`Remove ${item.label}`}
            className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-sm transition-colors hover:bg-card hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="size-4" aria-hidden />
          </button>
        )
      ) : null}
    </div>
  )
}
