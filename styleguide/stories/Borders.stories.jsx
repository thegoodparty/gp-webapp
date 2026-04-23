const meta = {
  title: 'Foundations/Borders',
  parameters: {
    docs: {
      description: {
        component:
          'Border tokens for the design system. Includes border radius and border width utilities sourced from the standard Tailwind scale.',
      },
    },
  },
}

export default meta

const PAGE_STYLE = { backgroundColor: '#ffffff', padding: 24, minHeight: '100vh' }
const STORY_PARAMS = { layout: 'fullscreen', backgrounds: { disable: true } }

function PageHeader({ title, description }) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0a0a0a', margin: 0, fontFamily: "'Open Sans', sans-serif" }}>{title}</h2>
      <p style={{ fontSize: 14, color: '#737373', marginTop: 4, fontFamily: "'Open Sans', sans-serif" }}>{description}</p>
    </div>
  )
}

const RADIUS_SAMPLE_BG = '#b4cef0'
const WIDTH_SAMPLE_BG = '#ecf5ff'
const WIDTH_SAMPLE_BORDER = '#b4cef0'

// =============================================================================
// Border Radius
// =============================================================================
const BORDER_RADIUS = [
  { token: 'rounded-none', px: 0    },
  { token: 'rounded-xs',   px: 2    },
  { token: 'rounded-sm',   px: 4    },
  { token: 'rounded-md',   px: 6    },
  { token: 'rounded-lg',   px: 8    },
  { token: 'rounded-xl',   px: 12   },
  { token: 'rounded-2xl',  px: 16   },
  { token: 'rounded-3xl',  px: 24   },
  { token: 'rounded-4xl',  px: 32   },
  { token: 'rounded-full', px: 9999 },
]

function radiusSampleSize(px) {
  if (px === 9999) return 64
  return Math.min(Math.max(px * 4, 32), 96)
}

export const BorderRadius = () => (
  <div style={PAGE_STYLE} className="space-y-10">
    <PageHeader
      title="Border Radius"
      description="Utilities for controlling the border radius of an element."
    />

    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left">
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-48">Token</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-24">Px</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900">Sample</th>
        </tr>
      </thead>
      <tbody>
        {BORDER_RADIUS.map(({ token, px }) => {
          const size = radiusSampleSize(px)
          return (
            <tr key={token} className="border-b border-gray-200">
              <td className="py-4 px-4">
                <code
                  className="text-sm bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded"
                  style={{ fontFamily: 'monospace' }}
                >
                  {token}
                </code>
              </td>
              <td className="py-4 px-4 text-sm text-gray-600" style={{ fontFamily: 'monospace' }}>
                {px === 9999 ? '∞' : `${px}px`}
              </td>
              <td className="py-4 px-4">
                <div
                  style={{
                    width: size,
                    height: size,
                    borderRadius: px === 9999 ? '9999px' : `${px}px`,
                    backgroundColor: RADIUS_SAMPLE_BG,
                    flexShrink: 0,
                  }}
                />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)

BorderRadius.storyName = 'Border Radius'
BorderRadius.parameters = STORY_PARAMS

// =============================================================================
// Border Width
// =============================================================================
const BORDER_WIDTH = [
  { token: 'border-0', px: 0 },
  { token: 'border',   px: 1 },
  { token: 'border-2', px: 2 },
  { token: 'border-3', px: 3 },
  { token: 'border-4', px: 4 },
  { token: 'border-5', px: 5 },
  { token: 'border-6', px: 6 },
  { token: 'border-7', px: 7 },
  { token: 'border-8', px: 8 },
]

export const BorderWidth = () => (
  <div style={PAGE_STYLE} className="space-y-10">
    <PageHeader
      title="Border Width"
      description="Utilities for controlling the width of an element's borders."
    />

    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left">
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-48">Token</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-24">Px</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900">Sample</th>
        </tr>
      </thead>
      <tbody>
        {BORDER_WIDTH.map(({ token, px }) => (
          <tr key={token} className="border-b border-gray-200">
            <td className="py-4 px-4">
              <code
                className="text-sm bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded"
                style={{ fontFamily: 'monospace' }}
              >
                {token}
              </code>
            </td>
            <td className="py-4 px-4 text-sm text-gray-600" style={{ fontFamily: 'monospace' }}>
              {px}px
            </td>
            <td className="py-4 px-4">
              <div
                style={{
                  width: 240,
                  height: 32,
                  borderRadius: 4,
                  backgroundColor: WIDTH_SAMPLE_BG,
                  border: `${px}px solid ${WIDTH_SAMPLE_BORDER}`,
                  boxSizing: 'border-box',
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

BorderWidth.storyName = 'Border Width'
BorderWidth.parameters = STORY_PARAMS
