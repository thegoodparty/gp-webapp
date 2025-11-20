import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import { Span } from './hooks/usePollBiasAnalysis'

interface RenderHighlightedTextOptions {
  value: string
  biasSpans: Span[]
  grammarSpans: Span[]
}

export function renderHighlightedText({
  value,
  biasSpans,
  grammarSpans,
}: RenderHighlightedTextOptions): React.ReactNode {
  if (biasSpans.length === 0 && grammarSpans.length === 0) {
    return value
  }

  const allSpans: Array<Span & { type: 'bias' | 'grammar' }> = [
    ...biasSpans.map((span) => ({ ...span, type: 'bias' as const })),
    ...grammarSpans.map((span) => ({ ...span, type: 'grammar' as const })),
  ].sort((a, b) => a.start - b.start)

  const parts: React.ReactNode[] = []
  let lastIndex = 0

  allSpans.forEach((span, index) => {
    if (span.start > lastIndex) {
      const textBefore = value.substring(lastIndex, span.start)
      if (textBefore) {
        parts.push(
          <React.Fragment key={`text-before-${index}`}>
            {textBefore}
          </React.Fragment>,
        )
      }
    }

    const spanText = value.substring(span.start, span.end)
    const isBias = span.type === 'bias'

    parts.push(
      <Tooltip
        key={`${span.type}-${index}`}
        title={
          <div className="flex-col space-y-2">
            <p className="text-xs text-muted-foreground font-normal">
              {isBias ? 'Bias detected' : 'Grammar issue'}
            </p>
            <p className="text-xs font-normal italic">{span.reason}</p>
            {(isBias || span.suggestion) && (
              <p className="text-xs font-normal">
                <b>Suggested:</b>{' '}
                {isBias
                  ? 'Remove this language or use optimize message to rewrite message.'
                  : span.suggestion}
              </p>
            )}
          </div>
        }
        placement="top"
        arrow={false}
        slotProps={{
          tooltip: {
            sx: {
              padding: '12px',
              bgcolor: 'white',
              color: 'black',
              border: '1px solid #ccc',
              maxWidth: '300px',
              '& .MuiTooltip-arrow': {
                color: 'white',
              },
            },
          },
        }}
      >
        <span className="underline decoration-1.5 decoration-dashed cursor-help decoration-error text-error">
          {spanText}
        </span>
      </Tooltip>,
    )

    lastIndex = span.end
  })

  if (lastIndex < value.length) {
    const textAfter = value.substring(lastIndex)
    if (textAfter) {
      parts.push(<React.Fragment key="text-after">{textAfter}</React.Fragment>)
    }
  }

  return <>{parts}</>
}
