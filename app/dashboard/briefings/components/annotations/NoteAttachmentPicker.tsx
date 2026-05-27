'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  Camera,
  FileText,
  ImageIcon,
  Loader2,
  Paperclip,
  X,
} from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@styleguide'
import { useIsMobile } from '@styleguide/hooks/use-mobile'
import { useAttachmentDownloadUrl } from '@shared/briefings/use-attachment-download-url'

type Source = 'photos' | 'camera' | 'document'

export type StagedAttachment = {
  id: string
  file: File
  source: Source
}

/**
 * Picker item shape. Two variants:
 *
 *   - `staged` — file the user just picked but hasn't uploaded yet. We
 *     pass the File through and render the thumbnail via
 *     URL.createObjectURL, which works for any MIME type. Clicking the
 *     thumbnail opens the blob URL in a new tab.
 *   - `server` — an already-uploaded attachment. The picker fetches a
 *     short-lived presigned S3 GET URL via React Query and uses it for
 *     image thumbnails / open-in-new-tab.
 */
type CommonItem = {
  id: string
  /** File name; shown beneath / beside the thumbnail. */
  label: string
  /** Mime type drives the thumbnail decision (image vs file icon). */
  mimeType: string
  /** When true, renders a spinner inside the pill in place of the X. */
  busy?: boolean
}
export type PickerItem =
  | (CommonItem & { kind: 'staged'; file: File })
  | (CommonItem & {
      kind: 'server'
      annotationId: string
      attachmentId: string
    })

type Props = {
  items: PickerItem[]
  onAdd: (file: File, source: Source) => void
  onRemove: (id: string) => void
  /** Disables the picker (e.g. while a save is in flight). */
  disabled?: boolean
  /** Surfaced inline; the caller is expected to render rejection reasons too. */
  error?: string | null
}

const PHOTOS_ACCEPT = 'image/*'
const DOCUMENT_ACCEPT = '.pdf,.doc,.docx,.txt,image/*'

const newId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const isImageMime = (mime: string): boolean => mime.startsWith('image/')

/**
 * Renders one attachment as a thumbnail tile. Images show the actual
 * image; non-images show a generic file-icon thumbnail. The tile itself
 * is the click target (opens the URL in a new tab); the X overlay is
 * the delete button. Separating the click targets lets the user delete
 * without accidentally opening the file in a new tab.
 */
function AttachmentTile({
  item,
  onRemove,
  disabled,
}: {
  item: PickerItem
  onRemove: (id: string) => void
  disabled: boolean
}): React.JSX.Element {
  // For staged items we have a File in hand and can synthesize a blob
  // URL right away — no network round-trip required. We tear it down
  // when the tile unmounts to free memory. Guarded because some test
  // environments (older jsdom builds) lack `URL.createObjectURL`; the
  // tile just falls back to a non-clickable thumbnail in that case.
  const objectUrl = useMemo(() => {
    if (item.kind !== 'staged') return null
    if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function')
      return null
    try {
      return URL.createObjectURL(item.file)
    } catch {
      return null
    }
  }, [item])
  useEffect(() => {
    if (!objectUrl) return
    return () => URL.revokeObjectURL(objectUrl)
  }, [objectUrl])

  // Server items pull the signed S3 URL on demand. The hook caches by
  // (annotationId, attachmentId) so re-opens of the same edit sheet
  // hit the cache instead of re-issuing the request.
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
  const isLoading = isServer && downloadUrlQuery.isPending

  const tileClass =
    'group relative inline-flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted text-muted-foreground'

  // Common interactive thumbnail — both the link and the placeholder
  // share the same dimensions so the layout doesn't jump when the URL
  // loads. We use `<a target=_blank rel=noopener>` because the link is
  // to a presigned S3 URL (no app navigation needed).
  const thumbnailContent =
    isImage && url ? (
      // eslint-disable-next-line @next/next/no-img-element -- presigned S3 URL, not a stable Next image route
      <img src={url} alt={item.label} className="size-full object-cover" />
    ) : isImage && isLoading ? (
      <Loader2 className="size-6 animate-spin" aria-hidden />
    ) : (
      <FileText className="size-8" aria-hidden />
    )

  return (
    <div className={tileClass} title={item.label}>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block size-full"
          aria-label={`Open ${item.label}`}
        >
          {thumbnailContent}
        </a>
      ) : (
        <span className="flex size-full items-center justify-center">
          {thumbnailContent}
        </span>
      )}
      {/* Floating X — sits over the top-right corner. Stops propagation
          so clicking it doesn't also fire the thumbnail's anchor. */}
      {item.busy ? (
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
      )}
    </div>
  )
}

/**
 * "Add attachment" pill + the list of attachment thumbnails below it.
 *
 * On desktop the pill opens the native OS file dialog directly. On
 * mobile the pill opens a bottom drawer with three sources — Photos
 * (gallery), Camera (capture), and Document (native document picker) —
 * matching the WhatsApp-style attachment menu.
 *
 * Each attachment renders as a small thumbnail tile (image preview for
 * image MIME types, file-icon for everything else). Clicking the
 * thumbnail opens the file in a new tab via the corresponding S3 URL.
 * The X overlay in the corner removes the attachment.
 */
export default function NoteAttachmentPicker({
  items,
  onAdd,
  onRemove,
  disabled = false,
  error = null,
}: Props): React.JSX.Element {
  const isMobile = useIsMobile()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const id = useId()

  // Three inputs: photos (gallery), camera (capture), document (anything).
  // We trigger them programmatically so the drawer options can route to
  // the right one. On desktop, only `desktopRef` is used.
  const desktopRef = useRef<HTMLInputElement | null>(null)
  const photosRef = useRef<HTMLInputElement | null>(null)
  const cameraRef = useRef<HTMLInputElement | null>(null)
  const documentRef = useRef<HTMLInputElement | null>(null)

  function handlePicked(file: File | null, source: Source) {
    if (!file) return
    onAdd(file, source)
  }

  function openPicker() {
    if (disabled) return
    if (isMobile) {
      setDrawerOpen(true)
      return
    }
    desktopRef.current?.click()
  }

  function pickFromDrawer(source: Source) {
    setDrawerOpen(false)
    // Give the drawer's close animation a tick before opening the file
    // picker; some mobile browsers race the two and ignore the second.
    requestAnimationFrame(() => {
      if (source === 'photos') photosRef.current?.click()
      else if (source === 'camera') cameraRef.current?.click()
      else documentRef.current?.click()
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Paperclip className="size-4" aria-hidden />
          Add attachment
        </button>
      </div>

      {items.length > 0 ? (
        <ul className="flex list-none flex-wrap items-start gap-2">
          {items.map((it) => (
            <li key={it.id}>
              <AttachmentTile
                item={it}
                onRemove={onRemove}
                disabled={disabled}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      {/* Single hidden input for desktop. */}
      <input
        ref={desktopRef}
        id={`${id}-desktop`}
        type="file"
        accept={DOCUMENT_ACCEPT}
        className="hidden"
        onChange={(e) => {
          handlePicked(e.target.files?.[0] ?? null, 'document')
          e.target.value = ''
        }}
      />
      {/* Three inputs for the mobile drawer's three sources. */}
      <input
        ref={photosRef}
        type="file"
        accept={PHOTOS_ACCEPT}
        className="hidden"
        onChange={(e) => {
          handlePicked(e.target.files?.[0] ?? null, 'photos')
          e.target.value = ''
        }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept={PHOTOS_ACCEPT}
        capture="environment"
        className="hidden"
        onChange={(e) => {
          handlePicked(e.target.files?.[0] ?? null, 'camera')
          e.target.value = ''
        }}
      />
      <input
        ref={documentRef}
        type="file"
        accept={DOCUMENT_ACCEPT}
        className="hidden"
        onChange={(e) => {
          handlePicked(e.target.files?.[0] ?? null, 'document')
          e.target.value = ''
        }}
      />

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="bottom">
        <DrawerContent>
          <DrawerHeader className="px-6 pb-2 pt-6 text-left">
            <DrawerTitle className="text-lg font-semibold">
              Add attachment
            </DrawerTitle>
          </DrawerHeader>
          <ul className="flex list-none flex-col gap-1 px-4 pb-6">
            <li>
              <button
                type="button"
                onClick={() => pickFromDrawer('photos')}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium transition-colors hover:bg-muted"
              >
                <span
                  aria-hidden
                  className="inline-flex size-10 items-center justify-center rounded-full bg-info-50 text-info-600"
                >
                  <ImageIcon className="size-5" />
                </span>
                Photos
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => pickFromDrawer('camera')}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium transition-colors hover:bg-muted"
              >
                <span
                  aria-hidden
                  className="inline-flex size-10 items-center justify-center rounded-full bg-info-50 text-info-600"
                >
                  <Camera className="size-5" />
                </span>
                Camera
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => pickFromDrawer('document')}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium transition-colors hover:bg-muted"
              >
                <span
                  aria-hidden
                  className="inline-flex size-10 items-center justify-center rounded-full bg-info-50 text-info-600"
                >
                  <FileText className="size-5" />
                </span>
                Document
              </button>
            </li>
          </ul>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export function makeStagedAttachment(
  file: File,
  source: Source,
): StagedAttachment {
  return { id: newId(), file, source }
}
