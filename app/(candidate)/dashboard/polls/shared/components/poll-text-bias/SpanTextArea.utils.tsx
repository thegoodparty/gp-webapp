import React from 'react'
import Tooltip from '@mui/material/Tooltip'

export interface TextSpan {
  start: number
  end: number
  tooltipContent: React.ReactNode
  underlineClassName?: string
}

interface RenderHighlightedTextOptions {
  value: string
  spans: TextSpan[]
}

export function renderHighlightedText({
  value,
  spans,
}: RenderHighlightedTextOptions): React.ReactNode {
  if (spans.length === 0) {
    return value
  }

  const sortedSpans = [...spans].sort((a, b) => a.start - b.start)

  const parts: React.ReactNode[] = []
  let lastIndex = 0

  sortedSpans.forEach((span, index) => {
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

    parts.push(
      <Tooltip
        key={`span-${index}`}
        title={span.tooltipContent}
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
        <span
          className={
            span.underlineClassName ||
            'underline decoration-1.5 decoration-dashed cursor-help decoration-error text-error'
          }
        >
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

