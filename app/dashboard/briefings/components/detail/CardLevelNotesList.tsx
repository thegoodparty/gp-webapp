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

// Roughly "a word or two" — typical card-level note rows show e.g.
// "Follow up with..." rather than a sentence. The CSS truncate on the
// snippet span will further cut it off if the row's max width is reached.
const PREVIEW_CHARS = 24

const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text

/**
 * Renders the card-level notes attached to a given card as inline rows at
 * the bottom of the card. Each row is laid out as
 *
 *   Note: [ {snippet}  📝 ]
 *
 * where the bracketed span mirrors the highlight-layer treatment used for
 * passage-anchored notes — same info-tinted background, same trailing
 * note marker — so the row reads as "this is a saved note about this
 * card." Clicking a row opens it in the annotation edit sheet.
 *
 * Renders nothing when there are no matching notes — callers can mount it
 * unconditionally without leaving an empty container behind.
 */
export default function CardLevelNotesList({
  cardPath,
}: Props): React.JSX.Element | null {
  const { annotations, openNotesSurface } = useAnnotationsCtx()
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
    <ul className="flex list-none flex-col items-start gap-1.5 pt-1">
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
                openNotesSurface(n.id)
              }}
              className="group inline-flex max-w-full items-baseline gap-2 rounded-md px-1 py-1 text-left text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-info-600/60"
            >
              <span className="shrink-0 font-semibold text-foreground">
                Note:
              </span>
              {/* Visually mirrors the passage-anchored note highlight:
                  info-tinted pill, trailing note marker. Tokens — not
                  raw CSS-var brackets — per CLAUDE.md (Design Tokens).
                  Sized to its content with a cap so a long note doesn't
                  span the whole card. */}
              <span className="inline-flex max-w-[260px] items-center gap-1.5 rounded-sm bg-info-500/20 px-1.5 py-0.5 transition-colors group-hover:bg-info-500/30">
                <span className="min-w-0 truncate">{preview}</span>
                <MessageSquare
                  className="size-3.5 shrink-0 text-info-600"
                  aria-hidden
                />
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
