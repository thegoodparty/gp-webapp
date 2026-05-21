'use client'

import { Button } from '@styleguide'

export const ASK_AI_SUGGESTIONS = [
  'Explain this',
  'Give me more details',
  'Verify this — show source',
] as const

type Props = {
  onSelect: (suggestion: string) => void
  disabled?: boolean
}

/**
 * Three suggested-prompt pills shown in the empty state of the Ask AI
 * popover. Clicking a pill pre-fills the composer with the suggestion;
 * the user can edit before sending.
 */
export default function AskAiSuggestedPills({
  onSelect,
  disabled,
}: Props): React.JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      {ASK_AI_SUGGESTIONS.map((suggestion) => (
        <Button
          key={suggestion}
          type="button"
          variant="outline"
          size="small"
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}
