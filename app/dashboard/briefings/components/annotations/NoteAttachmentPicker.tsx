'use client'

import { useId, useRef, useState } from 'react'
import { Camera, FileText, ImageIcon, Paperclip } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@styleguide'
import { useIsMobile } from '@styleguide/hooks/use-mobile'
import AttachmentThumbnail, { type AttachmentItem } from './AttachmentThumbnail'

type Source = 'photos' | 'camera' | 'document'

export type StagedAttachment = {
  id: string
  file: File
  source: Source
}

/**
 * Picker items reuse the shared `AttachmentThumbnail` shape so the same
 * data drives both the editable picker and the read-only view surface.
 */
export type PickerItem = AttachmentItem

type Props = {
  items: PickerItem[]
  onAdd: (file: File, source: Source) => void
  onRemove: (id: string) => void
  /** Disables the picker (e.g. while a save is in flight). */
  disabled?: boolean
  /** Surfaced inline; the caller is expected to render rejection reasons too. */
  error?: string | null
  /**
   * `pill` (default): compact rounded-full chip the user discovers
   *  alongside other inline actions (used inside AddNoteSheet's composer
   *  cluster).
   * `button`: full-width outline Button matching the surrounding
   *  cycler-footer buttons (Edit Note, Delete note) in NotesSurface.
   */
  triggerVariant?: 'pill' | 'button'
}

const PHOTOS_ACCEPT = 'image/*'
const DOCUMENT_ACCEPT = '.pdf,.doc,.docx,.txt,image/*'

const newId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

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
  triggerVariant = 'pill',
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

  const triggerClassName =
    triggerVariant === 'button'
      ? 'inline-flex w-full items-center justify-center gap-2 rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60'
      : 'inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60'

  return (
    <div className="flex flex-col gap-2">
      <div>
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          className={triggerClassName}
        >
          <Paperclip className="size-4" aria-hidden />
          Add attachment
        </button>
      </div>

      {items.length > 0 ? (
        <ul className="flex list-none flex-wrap items-start gap-2">
          {items.map((it) => (
            <li key={it.id}>
              <AttachmentThumbnail
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
                Files
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
