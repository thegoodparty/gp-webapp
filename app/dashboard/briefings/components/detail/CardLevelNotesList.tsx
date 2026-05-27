'use client'

import { useMemo } from 'react'
import { MessageSquare } from 'lucide-react'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'

type Props = {
  /**
   * Canonical jsonPath of the card these notes belong to. Notes match when
   * their jsonPath equals this value AND their `start`/`end` are null —
   * the convention for card-level (not passage-level) notes.
   */
  cardPath: string
}

const PREVIEW_CHARS = 120

const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text

/**
 * Renders the card-level notes attached to a given card as inline rows at
 * the bottom of the card. Each row mirrors the highlight-layer treatment
 * (info-tinted background, note icon, "Note:" prefix) so users can tell at
 * a glance that the row is a saved note. Clicking a row opens it in the
 * annotation edit sheet.
 *
 * Renders nothing when there are no matching notes — callers can mount it
 * unconditionally without leaving an empty container behind.
 */
export default function CardLevelNotesList({
  cardPath,
}: Props): React.JSX.Element | null {
  const { annotations, openEditNote } = useAnnotationsCtx()
  const cardNotes = useMemo(
    () =>
      annotations.filter(
        (a) =>
          a.kind === 'note' &&
          a.jsonPath === cardPath &&
          a.start === null &&
          a.end === null,
      ),
    [annotations, cardPath],
  )

  if (cardNotes.length === 0) return null

  return (
    <ul className="flex list-none flex-col gap-1.5 pt-1">
      {cardNotes.map((n) => {
        const body = (n.note?.body ?? '').trim()
        const attachmentCount = n.note?.attachments?.length ?? 0
        const preview =
          body.length > 0
            ? truncate(body, PREVIEW_CHARS)
            : attachmentCount > 0
            ? `${attachmentCount} attachment${attachmentCount === 1 ? '' : 's'}`
            : '(empty note)'
        return (
          <li key={n.id}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                openEditNote(n)
              }}
              className="flex w-full items-center gap-2 rounded-md bg-info-600/15 px-3 py-2 text-left text-sm text-info-700 transition-colors hover:bg-info-600/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-info-600/60"
            >
              <MessageSquare
                className="size-4 shrink-0 text-info-600"
                aria-hidden
              />
              <span className="min-w-0 flex-1 truncate">
                <span className="font-semibold">Note:</span> {preview}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
