// Shared shell helpers for full-page Foundations stories (Colors, Typography).
// Underscore prefix keeps Storybook from picking this file up as a story.

// Background is read from the design token so the story adapts in dark mode.
// The token resolves via the .dark [data-slot] cascade in styleguide-scope.css
// (and the preview wrapper sets data-slot="storybook" in .storybook/preview.ts).
export const PAGE_STYLE = {
  backgroundColor: 'var(--color-background)',
  padding: 24,
  minHeight: '100vh',
}

export const STORY_PARAMS = {
  layout: 'fullscreen',
  backgrounds: { disable: true },
}

export function PageHeader({ title, description }) {
  return (
    <div>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--color-foreground)',
          margin: 0,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 14,
          color: 'var(--color-muted-foreground)',
          marginTop: 4,
        }}
      >
        {description}
      </p>
    </div>
  )
}
