import { icons } from 'lucide-react'
import { createElement, useState } from 'react'

const meta = {
  title: 'Foundations/Icons',
  parameters: {
    docs: {
      description: {
        component:
          'Icon library powered by Lucide React. Search by name, adjust size, and click any icon to copy its import name. See lucide.dev for the full catalog.',
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

// lucide-react's `icons` export is a plain object of { PascalCaseName: IconComponent }
// This is more reliable than namespace imports in Vite's ESM bundler
const ALL_ICONS = Object.entries(icons).sort(([a], [b]) => a.localeCompare(b))

function toKebabCase(name) {
  return name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

const SIZES = [16, 20, 24, 32]

// =============================================================================
// Icon Gallery
// =============================================================================
export const IconGallery = () => {
  const [search, setSearch] = useState('')
  const [size, setSize] = useState(24)
  const [copied, setCopied] = useState(null)

  const filtered = search.trim()
    ? ALL_ICONS.filter(([name]) =>
        name.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : ALL_ICONS

  function handleCopy(name) {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(name)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  return (
    <div style={PAGE_STYLE} className="space-y-8">
      <PageHeader
        title="Icons"
        description={`Lucide React icon library. ${ALL_ICONS.length} icons available. Click any icon to copy its name.`}
      />

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-64 max-w-sm">
          <input
            type="text"
            placeholder="Search icons…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm leading-none"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 border border-gray-200 rounded-md p-0.5">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                size === s
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              {s}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-400" style={{ fontFamily: "'Open Sans', sans-serif" }}>
          {filtered.length === ALL_ICONS.length
            ? `${ALL_ICONS.length} icons`
            : `${filtered.length} of ${ALL_ICONS.length}`}
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-gray-400 text-sm" style={{ fontFamily: "'Open Sans', sans-serif" }}>
            No icons match &ldquo;{search}&rdquo;
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: 32,
          }}
        >
          {filtered.map(([name, Icon]) => {
            const isCopied = copied === name
            return (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => handleCopy(name)}
                  title={`Click to copy: ${name}`}
                  className={`flex items-center justify-center rounded-2xl border transition-all w-full group ${
                    isCopied
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                  }`}
                  style={{ aspectRatio: '1', cursor: 'pointer', background: undefined }}
                >
                  {isCopied ? (
                    <span
                      className="text-blue-600 font-medium"
                      style={{ fontSize: 11, fontFamily: "'Open Sans', sans-serif" }}
                    >
                      Copied!
                    </span>
                  ) : (
                    createElement(Icon, { size, strokeWidth: 1.5, style: { color: 'var(--base-foreground, #0a0a0a)' } })
                  )}
                </button>
                <span
                  className="text-gray-500 text-center w-full"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                  }}
                >
                  {toKebabCase(name)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

IconGallery.storyName = 'Icon Gallery'
IconGallery.parameters = STORY_PARAMS
