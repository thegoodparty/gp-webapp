import { useState, useEffect, useRef } from 'react'
import tailwindJson from '../tokens/Tailwind.json'

const meta = {
  title: 'Design System/Colors',
  parameters: {
    docs: {
      description: {
        component:
          'Color tokens from the GoodParty Figma Design System. All values are defined in design-tokens.css and mapped to Tailwind utilities via tailwind-theme.css.',
      },
    },
  },
}

export default meta

function hexToRgba(hex) {
  const clean = hex.replace('#', '')
  if (clean.length !== 6 && clean.length !== 8) return hex
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  const a =
    clean.length === 8
      ? (parseInt(clean.slice(6, 8), 16) / 255).toFixed(2)
      : '1.00'
  return `rgba(${r},${g},${b},${a})`
}

function formatHex(hex) {
  const clean = hex.replace('#', '')
  if (clean.length !== 8) return hex.toUpperCase()
  const alpha = Math.round((parseInt(clean.slice(6, 8), 16) / 255) * 100)
  return `#${clean.slice(0, 6).toUpperCase()} / ${alpha}%`
}

function resolveColor(cssValue) {
  if (!cssValue) return ''
  const trimmed = cssValue.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('#')) return trimmed
  const el = document.createElement('div')
  el.style.color = trimmed
  el.style.display = 'none'
  document.body.appendChild(el)
  const resolved = getComputedStyle(el).color
  document.body.removeChild(el)
  const toHex = (n) => Math.round(parseFloat(n)).toString(16).padStart(2, '0')

  const rgba = resolved.match(
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/,
  )
  if (rgba) {
    const hex = `#${toHex(rgba[1])}${toHex(rgba[2])}${toHex(rgba[3])}`
    if (rgba[4] !== undefined && parseFloat(rgba[4]) < 1) {
      return hex + toHex(String(parseFloat(rgba[4]) * 255))
    }
    return hex
  }

  const srgb = resolved.match(
    /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/,
  )
  if (srgb) {
    const hex = `#${toHex(String(parseFloat(srgb[1]) * 255))}${toHex(
      String(parseFloat(srgb[2]) * 255),
    )}${toHex(String(parseFloat(srgb[3]) * 255))}`
    if (srgb[4] !== undefined && parseFloat(srgb[4]) < 1) {
      return hex + toHex(String(parseFloat(srgb[4]) * 255))
    }
    return hex
  }

  return trimmed
}

function readCSSVar(el, name) {
  return resolveColor(getComputedStyle(el).getPropertyValue(name).trim())
}

function readCSSScale(el, prefix, steps) {
  return steps.map((step) => ({
    step,
    hex: readCSSVar(el, `--${prefix}-${step}`),
  }))
}

function readCSSTokenGroup(el, prefix, names) {
  const result = {}
  for (const name of names) {
    const varName = `--${prefix}-${name}`
    result[name] = { hex: readCSSVar(el, varName), ref: varName }
  }
  return result
}

const SCALE_STEPS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
]

function Swatch({
  name,
  hex,
  alias,
  tailwindClass,
  isDark,
  cardBg,
  borderColor,
  foregroundColor,
  mutedForegroundColor,
  cardHeight,
}) {
  const _cardBg = cardBg ?? (isDark ? '#171717' : '#ffffff')
  const _borderColor = borderColor ?? (isDark ? '#404040' : '#e5e5e5')
  const _foregroundColor = foregroundColor ?? (isDark ? '#ffffff' : '#0a0a0a')
  const _mutedForegroundColor =
    mutedForegroundColor ?? (isDark ? '#a3a3a3' : '#737373')

  return (
    <div
      style={{
        width: 160,
        height: cardHeight ?? 220,
        border: `1px solid ${_borderColor}`,
        borderRadius: 4,
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          backgroundColor: hex,
          height: 100,
          width: '100%',
          flexShrink: 0,
          borderBottom: `1px solid ${_borderColor}`,
        }}
      />
      <div
        style={{
          padding: 8,
          backgroundColor: _cardBg,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flexGrow: 1,
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: _foregroundColor,
            margin: 0,
            lineHeight: '20px',
          }}
        >
          {tailwindClass ?? name}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p
            style={{
              fontSize: 9,
              fontFamily: 'monospace',
              color: _mutedForegroundColor,
              margin: 0,
            }}
          >
            {formatHex(hex)}
          </p>
          <p
            style={{
              fontSize: 9,
              fontFamily: 'monospace',
              color: _mutedForegroundColor,
              margin: 0,
            }}
          >
            {hexToRgba(hex)}
          </p>
          {alias && (
            <p
              style={{
                fontSize: 9,
                fontFamily: 'monospace',
                color: _mutedForegroundColor,
                margin: '4px 0 0',
                opacity: 0.6,
                borderTop: `1px solid ${_borderColor}`,
                paddingTop: 4,
              }}
            >
              ↳ {alias}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, description, children, isDark }) {
  const titleColor = isDark ? '#ffffff' : '#111827'
  const descColor = isDark ? '#a3a3a3' : '#6b7280'

  return (
    <div className="space-y-4">
      <div>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: titleColor,
            margin: 0,
          }}
        >
          {title}
        </h3>
        {description && (
          <p style={{ fontSize: 14, color: descColor, margin: '4px 0 0' }}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}

function SwatchRow({ children }) {
  return <div className="flex flex-wrap gap-2">{children}</div>
}

const PAGE_STYLE = {
  backgroundColor: '#ffffff',
  padding: 24,
  minHeight: '100vh',
}

function PageHeader({ title, description }) {
  return (
    <div>
      <h2
        style={{ fontSize: 24, fontWeight: 700, color: '#0a0a0a', margin: 0 }}
      >
        {title}
      </h2>
      <p style={{ fontSize: 14, color: '#737373', marginTop: 4 }}>
        {description}
      </p>
    </div>
  )
}

const STORY_PARAMS = { layout: 'fullscreen', backgrounds: { disable: true } }

function ScaleRow({ scaleName, prefix, colors }) {
  return (
    <Section title={scaleName}>
      <SwatchRow>
        {colors.map(({ step, hex }) => (
          <Swatch
            key={step}
            name={`${step}`}
            hex={hex}
            tailwindClass={`${prefix}-${step}`}
          />
        ))}
      </SwatchRow>
    </Section>
  )
}

// =============================================================================
// Token name arrays (CSS variable suffixes for each group)
// =============================================================================

const BASE_TOKEN_NAMES = [
  'foreground',
  'background',
  'muted-foreground',
  'muted',
  'border',
  'accent',
  'accent-foreground',
  'surface',
  'surface-foreground',
  'focus-ring',
  'ring-offset',
  'foreground-focus',
  'foreground-dark-focus',
  'foreground-dark',
  'background-dark',
]

const THEME_TOKEN_NAMES = [
  'primary',
  'primary-foreground',
  'primary-focus',
  'secondary',
  'secondary-foreground',
  'secondary-focus',
  'destructive',
  'destructive-foreground',
  'destructive-focus',
  'success',
  'success-foreground',
  'success-focus',
  'info',
  'info-foreground',
  'info-focus',
  'warning',
  'warning-foreground',
  'warning-focus',
  'link',
]

const COMPONENT_TOKEN_NAMES = [
  'card-base',
  'card-foreground',
  'tooltip-base',
  'tooltip-foreground',
  'input-base',
  'input-foreground',
  'input-border',
  'input-active',
  'input-focus',
]

const DATA_TOKEN_NAMES = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5']

const SIDEBAR_TOKEN_NAMES = [
  'background',
  'foreground',
  'primary',
  'primary-foreground',
  'accent',
  'accent-foreground',
  'border',
  'ring',
]

// =============================================================================
// Theme Colors
// =============================================================================

const SIDEBAR_EXCLUDED = new Set(['primary', 'primary-foreground', 'ring'])

const THEME_GROUPS = [
  [
    'primary',
    'primary-foreground',
    'primary-focus',
    'secondary',
    'secondary-foreground',
    'secondary-focus',
  ],
  [
    'destructive',
    'destructive-foreground',
    'destructive-focus',
    'success',
    'success-foreground',
    'success-focus',
  ],
  [
    'info',
    'info-foreground',
    'info-focus',
    'warning',
    'warning-foreground',
    'warning-focus',
  ],
  ['link'],
]

const BASE_GROUPS = [
  ['background', 'foreground', 'surface', 'surface-foreground', 'border'],
  ['muted', 'muted-foreground', 'accent', 'accent-foreground'],
  ['focus-ring', 'ring-offset', 'foreground-focus', 'foreground-dark-focus'],
]

const COMPONENT_GROUPS = [
  ['card-base', 'card-foreground', 'tooltip-base', 'tooltip-foreground'],
  [
    'input-base',
    'input-foreground',
    'input-border',
    'input-active',
    'input-focus',
  ],
]

const TOKEN_GROUP_META = {
  theme: {
    title: 'Theme',
    description:
      'Semantic action colors — primary, secondary, destructive, success, info.',
  },
  base: {
    title: 'Base',
    description:
      'Foundational surface tokens — backgrounds, foregrounds, borders, focus rings.',
  },
  component: {
    title: 'Components',
    description: 'Component-specific tokens — cards, inputs, tooltips.',
  },
  sidebar: {
    title: 'Sidebar',
    description: 'Tokens scoped to the sidebar navigation.',
  },
  data: {
    title: 'Data / Chart',
    description: 'Colors for data visualization and charts.',
  },
}

export const ThemeColors = ({ mode }) => {
  const containerRef = useRef(null)
  const [tokens, setTokens] = useState(null)
  const isDark = mode === 'dark'

  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    setTokens({
      base: readCSSTokenGroup(el, 'base', BASE_TOKEN_NAMES),
      theme: readCSSTokenGroup(el, 'theme', THEME_TOKEN_NAMES),
      component: readCSSTokenGroup(el, 'component', COMPONENT_TOKEN_NAMES),
      data: readCSSTokenGroup(el, 'data', DATA_TOKEN_NAMES),
      sidebar: readCSSTokenGroup(el, 'component-sidebar', SIDEBAR_TOKEN_NAMES),
    })
  }, [isDark])

  const pageBg =
    tokens?.base?.['background']?.hex ?? (isDark ? '#0a0a0a' : '#ffffff')
  const cardBg =
    tokens?.component?.['card-base']?.hex ?? (isDark ? '#171717' : '#ffffff')
  const borderColor =
    tokens?.base?.['border']?.hex ?? (isDark ? '#525252' : '#e5e5e5')
  const foregroundColor =
    tokens?.base?.['foreground']?.hex ?? (isDark ? '#ffffff' : '#0a0a0a')
  const mutedForegroundColor =
    tokens?.base?.['muted-foreground']?.hex ?? (isDark ? '#a3a3a3' : '#737373')

  return (
    <div
      ref={containerRef}
      data-slot="theme-colors"
      className={isDark ? 'dark' : undefined}
      style={{ backgroundColor: pageBg, padding: 24, minHeight: '100vh' }}
    >
      <div className="space-y-10">
        <div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: foregroundColor,
              margin: 0,
            }}
          >
            Theme Colors — {isDark ? 'Dark' : 'Light'} Mode
          </h2>
          <p
            style={{ fontSize: 14, color: mutedForegroundColor, marginTop: 4 }}
          >
            Core theme tokens read from CSS custom properties. Use the Mode
            control above to toggle between light and dark.
          </p>
        </div>

        {tokens &&
          Object.entries(TOKEN_GROUP_META).map(
            ([groupKey, { title, description }]) => (
              <Section
                key={groupKey}
                title={title}
                description={description}
                isDark={isDark}
              >
                {groupKey === 'theme' ||
                groupKey === 'base' ||
                groupKey === 'component' ? (
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                    {(groupKey === 'theme'
                      ? THEME_GROUPS
                      : groupKey === 'base'
                      ? BASE_GROUPS
                      : COMPONENT_GROUPS
                    ).map((keys) => (
                      <SwatchRow key={keys[0]}>
                        {keys.map((name) => {
                          const token = tokens[groupKey]?.[name]
                          if (!token) return null
                          return (
                            <Swatch
                              key={name}
                              name={name}
                              hex={token.hex}
                              alias={token.ref}
                              isDark={isDark}
                              cardBg={cardBg}
                              borderColor={borderColor}
                              foregroundColor={foregroundColor}
                              mutedForegroundColor={mutedForegroundColor}
                              cardHeight={260}
                            />
                          )
                        })}
                      </SwatchRow>
                    ))}
                  </div>
                ) : (
                  <SwatchRow>
                    {Object.entries(tokens[groupKey] || {})
                      .filter(
                        ([name]) =>
                          groupKey !== 'sidebar' || !SIDEBAR_EXCLUDED.has(name),
                      )
                      .map(([name, { hex, ref: tokenRef }]) => (
                        <Swatch
                          key={name}
                          name={name}
                          hex={hex}
                          alias={tokenRef}
                          isDark={isDark}
                          cardBg={cardBg}
                          borderColor={borderColor}
                          foregroundColor={foregroundColor}
                          mutedForegroundColor={mutedForegroundColor}
                          cardHeight={260}
                        />
                      ))}
                  </SwatchRow>
                )}
              </Section>
            ),
          )}
      </div>
    </div>
  )
}

ThemeColors.args = { mode: 'light' }
ThemeColors.argTypes = {
  mode: {
    control: { type: 'radio' },
    options: ['light', 'dark'],
    description: 'Toggle between light and dark mode token values',
  },
}
ThemeColors.parameters = {
  layout: 'fullscreen',
  backgrounds: { disable: true },
}

// =============================================================================
// Branding Colors
// =============================================================================
export const BrandingColors = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const el = document.documentElement
    const readScale = (prefix) => readCSSScale(el, prefix, SCALE_STEPS)
    const read = (name) => readCSSVar(el, name)

    setData({
      coreBrand: [
        {
          name: 'Red',
          hex: read('--goodparty-red'),
          tailwindClass: 'bg-brand-red',
        },
        {
          name: 'Red Light',
          hex: read('--goodparty-red-light'),
          tailwindClass: 'bg-brand-red-light',
        },
        {
          name: 'Blue',
          hex: read('--goodparty-blue'),
          tailwindClass: 'bg-brand-blue',
        },
        {
          name: 'Blue Light',
          hex: read('--goodparty-blue-light'),
          tailwindClass: 'bg-brand-blue-light',
        },
        {
          name: 'Cream',
          hex: read('--goodparty-cream'),
          tailwindClass: 'bg-brand-cream',
        },
      ],
      midnight: readScale('color-midnight'),
      lavender: readScale('color-lavender'),
      waxflower: readScale('color-waxflower'),
      haloGreen: readScale('color-halo-green'),
      brightYellow: readScale('color-bright-yellow'),
    })
  }, [])

  if (!data) return null

  return (
    <div style={PAGE_STYLE} className="space-y-10">
      <PageHeader
        title="Branding Colors"
        description="Colors that represent GoodParty.org's visual identity. Read from CSS custom properties defined in design-tokens.css."
      />

      <Section
        title="Core Brand"
        description="Primary brand identifiers — logo, key surfaces."
      >
        <SwatchRow>
          {data.coreBrand.map(({ name, hex, tailwindClass }) => (
            <Swatch
              key={name}
              name={name}
              hex={hex}
              tailwindClass={tailwindClass}
            />
          ))}
        </SwatchRow>
      </Section>

      <ScaleRow
        scaleName="Midnight"
        prefix="bg-brand-midnight"
        colors={data.midnight}
      />
      <ScaleRow
        scaleName="Lavender"
        prefix="bg-brand-lavender"
        colors={data.lavender}
      />
      <ScaleRow
        scaleName="Waxflower"
        prefix="bg-brand-waxflower"
        colors={data.waxflower}
      />
      <ScaleRow
        scaleName="Halo Green"
        prefix="bg-brand-halo-green"
        colors={data.haloGreen}
      />
      <ScaleRow
        scaleName="Bright Yellow"
        prefix="bg-brand-bright-yellow"
        colors={data.brightYellow}
      />
    </div>
  )
}
BrandingColors.parameters = STORY_PARAMS

// =============================================================================
// Semantic Colors
// =============================================================================
export const SemanticColors = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const el = document.documentElement
    const readScale = (prefix) => readCSSScale(el, prefix, SCALE_STEPS)

    setData({
      error: readScale('color-red'),
      success: readScale('color-green'),
      info: readScale('color-blue'),
      warning: readScale('color-warning'),
    })
  }, [])

  if (!data) return null

  return (
    <div style={PAGE_STYLE} className="space-y-10">
      <PageHeader
        title="Semantic Colors"
        description="Colors that define logic used when applied to digital interfaces. Each scale runs from 50 (lightest) to 950 (darkest). Read from CSS custom properties."
      />

      <ScaleRow scaleName="Error" prefix="bg-error" colors={data.error} />
      <ScaleRow scaleName="Success" prefix="bg-success" colors={data.success} />
      <ScaleRow scaleName="Info" prefix="bg-info" colors={data.info} />
      <ScaleRow scaleName="Warning" prefix="bg-warning" colors={data.warning} />
    </div>
  )
}
SemanticColors.parameters = STORY_PARAMS

// =============================================================================
// Tailwind Colors
// =============================================================================

const twScales = tailwindJson['tailwind colors']

// Converts a Tailwind scale object to [{ step, hex }] array
function parseTwScale(scaleObj) {
  return Object.entries(scaleObj).map(([step, token]) => ({
    step,
    hex: token.value,
  }))
}

const TW_SCALE_NAMES = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]

export const TailwindColors = () => (
  <div style={PAGE_STYLE} className="space-y-10">
    <PageHeader
      title="Tailwind Colors"
      description="The full standard Tailwind CSS color palette, sourced directly from the Figma design token export."
    />

    <Section title="Base" description="Black, white, and transparent.">
      <SwatchRow>
        {parseTwScale(twScales.base).map(({ step, hex }) => (
          <Swatch
            key={step}
            name={step}
            hex={hex}
            tailwindClass={`bg-${step}`}
          />
        ))}
      </SwatchRow>
    </Section>

    {TW_SCALE_NAMES.map((scaleName) => (
      <ScaleRow
        key={scaleName}
        scaleName={scaleName.charAt(0).toUpperCase() + scaleName.slice(1)}
        prefix={`bg-${scaleName}`}
        colors={parseTwScale(twScales[scaleName])}
      />
    ))}
  </div>
)
TailwindColors.parameters = STORY_PARAMS
