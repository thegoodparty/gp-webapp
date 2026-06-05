import React from 'react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@styleguide/components/ui/tooltip'

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

export const renderHighlightedText = ({
  value,
  spans,
}: RenderHighlightedTextOptions): React.ReactNode => {
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
      <Tooltip key={`span-${index}`}>
        <TooltipTrigger asChild>
          <span
            className={
              span.underlineClassName ||
              'underline decoration-1.5 decoration-dashed cursor-help decoration-error text-error'
            }
          >
            {spanText}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-white text-black border border-border max-w-[300px] p-3"
        >
          {span.tooltipContent}
        </TooltipContent>
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
