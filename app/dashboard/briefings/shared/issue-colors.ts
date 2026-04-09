// Issue color palette — 3 colors cycling through brand families.
// Uses /900 for badge/text/border (dark), /50 for callout bg (tint).
// Tip callout is always bright-yellow regardless of issue color.
export const ISSUE_COLORS = [
  {
    // midnight blue (issue 1, 4, 7, ...)
    badge: 'bg-brand-midnight-900',
    text: 'text-brand-midnight-900',
    border: 'border-l-brand-midnight-900',
    bg: 'bg-brand-midnight-50',
  },
  {
    // halo green (issue 2, 5, 8, ...)
    badge: 'bg-brand-halo-green-900',
    text: 'text-brand-halo-green-900',
    border: 'border-l-brand-halo-green-900',
    bg: 'bg-brand-halo-green-50',
  },
  {
    // waxflower / terracotta (issue 3, 6, 9, ...)
    badge: 'bg-brand-waxflower-900',
    text: 'text-brand-waxflower-900',
    border: 'border-l-brand-waxflower-900',
    bg: 'bg-brand-waxflower-50',
  },
] as const
