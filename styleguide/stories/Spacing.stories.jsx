const meta = {
  title: 'Foundations/Spacing',
  parameters: {
    docs: {
      description: {
        component:
          'Spacing tokens for the design system. Based on the standard Tailwind spacing scale where 1 unit = 4px = 0.25rem. Use these values for padding, margin, gap, width, height, and other spacing utilities.',
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

// Standard Tailwind spacing scale (1 unit = 4px = 0.25rem)
const SPACING_SCALE = [
  { token: '0',   multiplier: '0×',    rem: '0rem',      px: 0   },
  { token: 'px',  multiplier: '—',     rem: '—',         px: 1   },
  { token: '0.5', multiplier: '0.5×',  rem: '0.125rem',  px: 2   },
  { token: '1',   multiplier: '1×',    rem: '0.25rem',   px: 4   },
  { token: '1.5', multiplier: '1.5×',  rem: '0.375rem',  px: 6   },
  { token: '2',   multiplier: '2×',    rem: '0.5rem',    px: 8   },
  { token: '2.5', multiplier: '2.5×',  rem: '0.625rem',  px: 10  },
  { token: '3',   multiplier: '3×',    rem: '0.75rem',   px: 12  },
  { token: '3.5', multiplier: '3.5×',  rem: '0.875rem',  px: 14  },
  { token: '4',   multiplier: '4×',    rem: '1rem',      px: 16  },
  { token: '5',   multiplier: '5×',    rem: '1.25rem',   px: 20  },
  { token: '6',   multiplier: '6×',    rem: '1.5rem',    px: 24  },
  { token: '7',   multiplier: '7×',    rem: '1.75rem',   px: 28  },
  { token: '8',   multiplier: '8×',    rem: '2rem',      px: 32  },
  { token: '9',   multiplier: '9×',    rem: '2.25rem',   px: 36  },
  { token: '10',  multiplier: '10×',   rem: '2.5rem',    px: 40  },
  { token: '11',  multiplier: '11×',   rem: '2.75rem',   px: 44  },
  { token: '12',  multiplier: '12×',   rem: '3rem',      px: 48  },
  { token: '14',  multiplier: '14×',   rem: '3.5rem',    px: 56  },
  { token: '16',  multiplier: '16×',   rem: '4rem',      px: 64  },
  { token: '20',  multiplier: '20×',   rem: '5rem',      px: 80  },
  { token: '24',  multiplier: '24×',   rem: '6rem',      px: 96  },
  { token: '28',  multiplier: '28×',   rem: '7rem',      px: 112 },
  { token: '32',  multiplier: '32×',   rem: '8rem',      px: 128 },
  { token: '36',  multiplier: '36×',   rem: '9rem',      px: 144 },
  { token: '40',  multiplier: '40×',   rem: '10rem',     px: 160 },
  { token: '44',  multiplier: '44×',   rem: '11rem',     px: 176 },
  { token: '48',  multiplier: '48×',   rem: '12rem',     px: 192 },
  { token: '52',  multiplier: '52×',   rem: '13rem',     px: 208 },
  { token: '56',  multiplier: '56×',   rem: '14rem',     px: 224 },
  { token: '60',  multiplier: '60×',   rem: '15rem',     px: 240 },
  { token: '64',  multiplier: '64×',   rem: '16rem',     px: 256 },
  { token: '72',  multiplier: '72×',   rem: '18rem',     px: 288 },
  { token: '80',  multiplier: '80×',   rem: '20rem',     px: 320 },
  { token: '96',  multiplier: '96×',   rem: '24rem',     px: 384 },
]

const MAX_BAR_WIDTH = 240
const MAX_PX = 384
const BAR_COLOR = '#b4cef0'

// =============================================================================
// Spacing Scale
// =============================================================================
export const SpacingScale = () => (
  <div style={PAGE_STYLE} className="space-y-10">
    <PageHeader
      title="Spacing Scale"
      description="Full Tailwind spacing scale. 1 unit = 4px = 0.25rem. Apply values via padding (p-), margin (m-), gap (gap-), width (w-), height (h-), and more."
    />

    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left">
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-28">Token</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-28">Multiplier</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-32">Rem</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-20">Px</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900">Visual</th>
        </tr>
      </thead>
      <tbody>
        {SPACING_SCALE.map(({ token, multiplier, rem, px }) => (
          <tr key={token} className="border-b border-gray-200">
            <td className="py-3 px-4">
              <code
                style={{ fontFamily: 'monospace' }}
                className="text-sm bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded"
              >
                {token}
              </code>
            </td>
            <td className="py-3 px-4 text-sm text-gray-500" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              {multiplier}
            </td>
            <td className="py-3 px-4 text-sm text-gray-600" style={{ fontFamily: 'monospace' }}>
              {rem}
            </td>
            <td className="py-3 px-4 text-sm text-gray-600" style={{ fontFamily: 'monospace' }}>
              {px}px
            </td>
            <td className="py-3 px-4 flex items-center" style={{ minHeight: 44 }}>
              {px > 0 && (
                <div
                  style={{
                    width: Math.max(2, (px / MAX_PX) * MAX_BAR_WIDTH),
                    height: 16,
                    backgroundColor: BAR_COLOR,
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

SpacingScale.storyName = 'Spacing Scale'
SpacingScale.parameters = STORY_PARAMS
