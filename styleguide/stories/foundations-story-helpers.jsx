export const PAGE_STYLE = {
  backgroundColor: '#ffffff',
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
          color: '#0a0a0a',
          margin: 0,
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 14,
          color: '#737373',
          marginTop: 4,
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        {description}
      </p>
    </div>
  )
}
