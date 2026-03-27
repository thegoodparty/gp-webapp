const meta = {
  title: 'Foundations/Typography',
  parameters: {
    docs: {
      description: {
        component:
          'Typography styles for the design system. Includes font families, font weights, the type scale, and utility classes. All values are sourced from the Figma Design System and configured in design-tokens.css.',
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

const sampleText = 'Almost before we knew it, we had left the ground.'
const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'

// =============================================================================
// Fonts
// =============================================================================
export const FontFamilies = () => (
  <div style={PAGE_STYLE} className="space-y-10">
    <PageHeader
      title="Font Families"
      description="Four font families used across the design system. Headings use Outfit, body text uses Open Sans, and system/code uses Geist."
    />

    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left">
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-45">
            Name
          </th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-45">
            Font Family
          </th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-40">
            Tailwind Class
          </th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900">Sample</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-semibold text-gray-900">font-geist</td>
          <td className="py-4 px-4 text-gray-600">Geist</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">
            font-geist
          </td>
          <td
            className="py-4 px-4 font-geist"
            style={{
              fontFamily: "'Geist', ui-sans-serif, system-ui, sans-serif",
            }}
          >
            {sampleText}
          </td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-semibold text-gray-900">
            font-geist-mono
          </td>
          <td className="py-4 px-4 text-gray-600">Geist Mono</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">
            font-geist-mono
          </td>
          <td
            className="py-4 px-4 font-geist-mono"
            style={{ fontFamily: "'Geist Mono', ui-monospace, monospace" }}
          >
            {sampleText}
          </td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-semibold text-gray-900">font-outfit</td>
          <td className="py-4 px-4 text-gray-600">Outfit</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">
            font-outfit
          </td>
          <td
            className="py-4 px-4 font-outfit"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {sampleText}
          </td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-semibold text-gray-900">
            font-opensans
          </td>
          <td className="py-4 px-4 text-gray-600">Open Sans</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">
            font-opensans
          </td>
          <td
            className="py-4 px-4 font-opensans"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {sampleText}
          </td>
        </tr>
      </tbody>
    </table>

  </div>
)

// =============================================================================
// Font Weights
// =============================================================================
export const FontWeights = () => (
  <div style={PAGE_STYLE} className="space-y-10">
    <PageHeader
      title="Font Weights"
      description="Available font weights from the design system. Weight values map directly to CSS font-weight."
    />

    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left">
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-45">
            Name
          </th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-25">
            Value
          </th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-40">
            Tailwind Class
          </th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900">
            Sample (Outfit)
          </th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900">
            Sample (Open Sans)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4" style={{ fontWeight: 300 }}>
            light
          </td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">300</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">
            font-light
          </td>
          <td
            className="py-4 px-4 font-outfit font-light"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {sampleText}
          </td>
          <td
            className="py-4 px-4 font-opensans font-light"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {sampleText}
          </td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4" style={{ fontWeight: 400 }}>
            normal
          </td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">400</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">
            font-normal
          </td>
          <td
            className="py-4 px-4 font-outfit font-normal"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {sampleText}
          </td>
          <td
            className="py-4 px-4 font-opensans font-normal"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {sampleText}
          </td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4" style={{ fontWeight: 500 }}>
            medium
          </td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">500</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">
            font-medium
          </td>
          <td
            className="py-4 px-4 font-outfit font-medium"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {sampleText}
          </td>
          <td
            className="py-4 px-4 font-opensans font-medium"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {sampleText}
          </td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4" style={{ fontWeight: 600 }}>
            semibold
          </td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">600</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">
            font-semibold
          </td>
          <td
            className="py-4 px-4 font-outfit font-semibold"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {sampleText}
          </td>
          <td
            className="py-4 px-4 font-opensans font-semibold"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {sampleText}
          </td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4" style={{ fontWeight: 700 }}>
            bold
          </td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">700</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">
            font-bold
          </td>
          <td
            className="py-4 px-4 font-outfit font-bold"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {sampleText}
          </td>
          <td
            className="py-4 px-4 font-opensans font-bold"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {sampleText}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)

FontFamilies.parameters = STORY_PARAMS
FontWeights.parameters = STORY_PARAMS

// =============================================================================
// Type Scale
// =============================================================================
export const TypeScale = () => (
  <div style={PAGE_STYLE} className="space-y-10">
    <PageHeader
      title="Type Scale"
      description="Full typography scale from the Figma design system. Sizes 9xl–xl use Outfit (headings), lg–xs use Open Sans (body)."
    />

    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left">
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-25">
            Size
          </th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-25">
            Font Size
          </th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-28">
            Line Height
          </th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-28">
            Font
          </th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-44">
            Weight
          </th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900">Sample</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">9xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">128px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">160px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Semibold (600)</td>
          <td
            className="py-4 px-4 font-outfit font-semibold"
            style={{
              fontSize: '128px',
              lineHeight: '160px',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Aa
          </td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">8xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">96px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">120px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Semibold (600)</td>
          <td
            className="py-4 px-4 font-outfit font-semibold"
            style={{
              fontSize: '96px',
              lineHeight: '120px',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Aa
          </td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">7xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">72px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">90px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Semibold (600)</td>
          <td
            className="py-4 px-4 font-outfit font-semibold"
            style={{
              fontSize: '72px',
              lineHeight: '90px',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Aa
          </td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">6xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">60px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">72px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Semibold (600)</td>
          <td
            className="py-4 px-4 font-outfit font-semibold"
            style={{
              fontSize: '60px',
              lineHeight: '72px',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Aa
          </td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">5xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">48px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">60px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Semibold (600)</td>
          <td
            className="py-4 px-4 font-outfit font-semibold text-5xl"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Aa
          </td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">4xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">40px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">52px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Semibold (600)</td>
          <td
            className="py-4 px-4 font-outfit font-semibold"
            style={{
              fontSize: '40px',
              lineHeight: '52px',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Aa
          </td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">3xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">30px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">40px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Semibold (600)</td>
          <td
            className="py-4 px-4 font-outfit font-semibold text-3xl"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Aa
          </td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">2xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">24px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">32px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Semibold (600)</td>
          <td
            className="py-4 px-4 font-outfit font-semibold text-2xl"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Aa
          </td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">20px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">28px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Semibold (600)</td>
          <td
            className="py-4 px-4 font-outfit font-semibold text-xl"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Aa
          </td>
        </tr>
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <td className="py-4 px-4 font-mono text-sm font-semibold">lg</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">18px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">28px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Open Sans</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Semibold (600)</td>
          <td
            className="py-4 px-4 font-opensans font-semibold text-lg"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {sampleText}
          </td>
        </tr>
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <td className="py-4 px-4 font-mono text-sm font-semibold">base</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">16px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">24px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Open Sans</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Normal (400)</td>
          <td
            className="py-4 px-4 font-opensans font-normal text-base"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {sampleText}
          </td>
        </tr>
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <td className="py-4 px-4 font-mono text-sm font-semibold">sm</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">14px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">20px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Open Sans</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Normal (400)</td>
          <td
            className="py-4 px-4 font-opensans font-normal text-sm"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {sampleText}
          </td>
        </tr>
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <td className="py-4 px-4 font-mono text-sm font-semibold">xs</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">12px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">16px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Open Sans</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">Normal (400)</td>
          <td
            className="py-4 px-4 font-opensans font-normal text-xs"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {sampleText}
          </td>
        </tr>
      </tbody>
    </table>

  </div>
)

TypeScale.parameters = STORY_PARAMS

// =============================================================================
// Headings
// =============================================================================
export const Headings = () => (
  <div style={PAGE_STYLE} className="space-y-10">
    <PageHeader
      title="Headings"
      description="Semantic heading elements h1–h6, styled using Outfit. Use these for page titles, section headers, and content hierarchy."
    />
    <div className="space-y-6">
      <div>
        <code className="text-xs text-muted">h1 · 48px · Bold · Outfit</code>
        <p style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.025em', fontFamily: "'Outfit', sans-serif", margin: 0 }}>Heading Level 1</p>
      </div>
      <div>
        <code className="text-xs text-muted">h2 · 36px · Bold · Outfit</code>
        <p style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.025em', fontFamily: "'Outfit', sans-serif", margin: 0 }}>Heading Level 2</p>
      </div>
      <div>
        <code className="text-xs text-muted">h3 · 30px · Semibold · Outfit</code>
        <p style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.375, letterSpacing: '-0.025em', fontFamily: "'Outfit', sans-serif", margin: 0 }}>Heading Level 3</p>
      </div>
      <div>
        <code className="text-xs text-muted">h4 · 24px · Semibold · Outfit</code>
        <p style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.375, fontFamily: "'Outfit', sans-serif", margin: 0 }}>Heading Level 4</p>
      </div>
      <div>
        <code className="text-xs text-muted">h5 · 20px · Medium · Outfit</code>
        <p style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.5, fontFamily: "'Outfit', sans-serif", margin: 0 }}>Heading Level 5</p>
      </div>
      <div>
        <code className="text-xs text-muted">h6 · 18px · Medium · Outfit</code>
        <p style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.5, fontFamily: "'Outfit', sans-serif", margin: 0 }}>Heading Level 6</p>
      </div>
    </div>
  </div>
)

Headings.parameters = STORY_PARAMS

export const BodyText = () => (
  <div style={PAGE_STYLE} className="space-y-10">
    <PageHeader
      title="Body Text"
      description="Paragraph and body text styles for prose content. Uses Open Sans across all sizes."
    />
    <div className="space-y-6 max-w-prose">
      <div>
        <code className="text-xs text-muted">.text-lead · 20px · Regular</code>
        <p className="text-lead" style={{ fontFamily: "'Open Sans', sans-serif" }}>{longText}</p>
      </div>
      <div>
        <code className="text-xs text-muted">.text-large · 18px</code>
        <p className="text-large" style={{ fontFamily: "'Open Sans', sans-serif" }}>{longText}</p>
      </div>
      <div>
        <code className="text-xs text-muted">p · 16px · Medium</code>
        <p style={{ fontFamily: "'Open Sans', sans-serif" }}>{longText}</p>
      </div>
      <div>
        <code className="text-xs text-muted">.text-small · 14px</code>
        <p className="text-small" style={{ fontFamily: "'Open Sans', sans-serif" }}>{longText}</p>
      </div>
      <div>
        <code className="text-xs text-muted">.text-muted</code>
        <p className="text-muted" style={{ fontFamily: "'Open Sans', sans-serif" }}>{longText}</p>
      </div>
    </div>
  </div>
)

BodyText.parameters = STORY_PARAMS
