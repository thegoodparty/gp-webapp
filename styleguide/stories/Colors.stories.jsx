import lightJson from '../tokens/ThemeLight.json'
import darkJson from '../tokens/ThemeDark.json'
import tailwindJson from '../tokens/Tailwind.json'
import { resolveTokenGroup } from '../tokens/resolve-tokens'

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
  const a = clean.length === 8
    ? (parseInt(clean.slice(6, 8), 16) / 255).toFixed(2)
    : '1.00'
  return `rgba(${r},${g},${b},${a})`
}

function hexToHsla(hex) {
  const clean = hex.replace('#', '')
  if (clean.length !== 6 && clean.length !== 8) return hex
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const a = clean.length === 8
    ? (parseInt(clean.slice(6, 8), 16) / 255).toFixed(2)
    : '1.00'
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return `hsla(${Math.round(h * 360)},${Math.round(s * 100)}%,${Math.round(l * 100)}%,${a})`
}

function Swatch({ name, hex, alias, tailwindClass, isDark, cardBg, borderColor, foregroundColor, mutedForegroundColor, cardHeight }) {
  const _cardBg = cardBg ?? (isDark ? '#171717' : '#ffffff')
  const _borderColor = borderColor ?? (isDark ? '#404040' : '#e5e5e5')
  const _foregroundColor = foregroundColor ?? (isDark ? '#ffffff' : '#0a0a0a')
  const _mutedForegroundColor = mutedForegroundColor ?? (isDark ? '#a3a3a3' : '#737373')

  return (
    <div style={{ width: 160, height: cardHeight ?? 220, border: `1px solid ${_borderColor}`, borderRadius: 4, overflow: 'hidden', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        backgroundColor: hex,
        height: 100,
        width: '100%',
        flexShrink: 0,
        borderBottom: `1px solid ${_borderColor}`,
      }} />
      <div style={{ padding: 8, backgroundColor: _cardBg, display: 'flex', flexDirection: 'column', gap: 8, flexGrow: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 400, color: _foregroundColor, margin: 0, lineHeight: '20px' }}>
          {tailwindClass ?? name}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p style={{ fontSize: 9, fontFamily: 'monospace', color: _mutedForegroundColor, margin: 0 }}>
            {hexToRgba(hex)}
          </p>
          <p style={{ fontSize: 9, fontFamily: 'monospace', color: _mutedForegroundColor, margin: 0 }}>
            {hexToHsla(hex)}
          </p>
          <p style={{ fontSize: 9, fontFamily: 'monospace', color: _mutedForegroundColor, margin: 0, textTransform: 'uppercase' }}>
            {hex}
          </p>
          {alias && (
            <p style={{ fontSize: 9, fontFamily: 'monospace', color: _mutedForegroundColor, margin: '4px 0 0', opacity: 0.6, borderTop: `1px solid ${_borderColor}`, paddingTop: 4 }}>
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
        <h3 style={{ fontSize: 18, fontWeight: 600, color: titleColor, margin: 0 }}>{title}</h3>
        {description && <p style={{ fontSize: 14, color: descColor, margin: '4px 0 0' }}>{description}</p>}
      </div>
      {children}
    </div>
  )
}

function SwatchRow({ children }) {
  return <div className="flex flex-wrap gap-2">{children}</div>
}

const PAGE_STYLE = { backgroundColor: '#ffffff', padding: 24, minHeight: '100vh' }

function PageHeader({ title, description }) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0a0a0a', margin: 0 }}>{title}</h2>
      <p style={{ fontSize: 14, color: '#737373', marginTop: 4 }}>{description}</p>
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
// Resolved theme token data (from Figma JSON exports)
// =============================================================================

const lightTokens = {
  base: resolveTokenGroup(lightJson.base),
  theme: resolveTokenGroup(lightJson.theme),
  components: resolveTokenGroup(lightJson.components),
  data: resolveTokenGroup(lightJson.data),
  sidebar: resolveTokenGroup(lightJson.sidebar),
}

const darkTokens = {
  base: resolveTokenGroup(darkJson.base),
  theme: resolveTokenGroup(darkJson.theme),
  components: resolveTokenGroup(darkJson.components),
  data: resolveTokenGroup(darkJson.data),
  sidebar: resolveTokenGroup(darkJson.sidebar),
}

// =============================================================================
// Theme Colors
// =============================================================================

const SIDEBAR_EXCLUDED = new Set(['primary', 'primary-foreground', 'ring'])

const THEME_GROUPS = [
  ['primary', 'primary-foreground', 'primary-focus', 'secondary', 'secondary-foreground', 'secondary-focus'],
  ['destructive', 'destructive-foreground', 'destructive-focus', 'success', 'success-foreground', 'success-focus'],
  ['info', 'info-foreground', 'info-focus', 'warning', 'warning-foreground', 'warning-focus'],
  ['link'],
]

const BASE_GROUPS = [
  ['background', 'foreground', 'surface', 'surface-foreground', 'border'],
  ['muted', 'muted-foreground', 'accent', 'accent-foreground'],
  ['focus-ring', 'ring-offset', 'foreground-focus', 'foreground-dark-focus'],
]

const COMPONENT_GROUPS = [
  ['card-base', 'card-foreground', 'tooltip-base', 'tooltip-foreground'],
  ['input-base', 'input-foreground', 'input-border', 'input-active', 'input-focus'],
]

const TOKEN_GROUP_META = {
  theme: {
    title: 'Theme',
    description: 'Semantic action colors — primary, secondary, destructive, success, info.',
  },
  base: {
    title: 'Base',
    description: 'Foundational surface tokens — backgrounds, foregrounds, borders, focus rings.',
  },
  components: {
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
  const tokens = mode === 'dark' ? darkTokens : lightTokens
  const isDark = mode === 'dark'

  const pageBg = tokens.base['background'].hex
  const cardBg = tokens.components['card-base'].hex
  const borderColor = tokens.base['border'].hex
  const foregroundColor = tokens.base['foreground'].hex
  const mutedForegroundColor = tokens.base['muted-foreground'].hex

  return (
    <div style={{ backgroundColor: pageBg, padding: 24, minHeight: '100vh' }} className="space-y-10">
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: foregroundColor, margin: 0 }}>
          Theme Colors — {isDark ? 'Dark' : 'Light'} Mode
        </h2>
        <p style={{ fontSize: 14, color: mutedForegroundColor, marginTop: 4 }}>
          Core theme tokens from the Figma design system. Use the Mode control above to toggle between light and dark.
        </p>
      </div>

      {Object.entries(TOKEN_GROUP_META).map(([groupKey, { title, description }]) => (
        <Section key={groupKey} title={title} description={description} isDark={isDark}>
          {(groupKey === 'theme' || groupKey === 'base' || groupKey === 'components') ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(groupKey === 'theme' ? THEME_GROUPS : groupKey === 'base' ? BASE_GROUPS : COMPONENT_GROUPS).map((keys) => (
                <SwatchRow key={keys[0]}>
                  {keys.map((name) => {
                    const token = tokens[groupKey][name]
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
              {Object.entries(tokens[groupKey]).filter(([name]) => groupKey !== 'sidebar' || !SIDEBAR_EXCLUDED.has(name)).map(([name, { hex, ref }]) => (
                <Swatch
                  key={name}
                  name={name}
                  hex={hex}
                  alias={ref}
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
      ))}
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
export const BrandingColors = () => (
  <div style={PAGE_STYLE} className="space-y-10">
    <PageHeader
      title="Branding Colors"
      description="Colors that represent GoodParty.org's visual identity. Defined as static values in tailwind-theme.css."
    />

    <Section
      title="Core Brand"
      description="Primary brand identifiers — logo, key surfaces."
    >
      <SwatchRow>
        <Swatch name="Red" hex="#DC1438" tailwindClass="bg-brand-red" />
        <Swatch
          name="Red Light"
          hex="#F7BAC5"
          tailwindClass="bg-brand-red-light"
        />
        <Swatch name="Blue" hex="#0048C2" tailwindClass="bg-brand-blue" />
        <Swatch
          name="Blue Light"
          hex="#A4C2F5"
          tailwindClass="bg-brand-blue-light"
        />
        <Swatch name="Cream" hex="#FCF8F3" tailwindClass="bg-brand-cream" />
      </SwatchRow>
    </Section>

    <ScaleRow
      scaleName="Midnight"
      prefix="bg-brand-midnight"
      colors={[
        { step: '50', hex: '#ECF5FF' },
        { step: '100', hex: '#D8E7F7' },
        { step: '200', hex: '#B4CEF0' },
        { step: '300', hex: '#84A3D2' },
        { step: '400', hex: '#5975A6' },
        { step: '500', hex: '#3E527C' },
        { step: '600', hex: '#293F6C' },
        { step: '700', hex: '#1D305C' },
        { step: '800', hex: '#14234D' },
        { step: '900', hex: '#0B1529' },
        { step: '950', hex: '#060B17' },
      ]}
    />

    <ScaleRow
      scaleName="Lavender"
      prefix="bg-brand-lavender"
      colors={[
        { step: '50', hex: '#F8ECFF' },
        { step: '100', hex: '#F1E5FF' },
        { step: '200', hex: '#EDDCFF' },
        { step: '300', hex: '#E5CDFF' },
        { step: '400', hex: '#DCBCFF' },
        { step: '500', hex: '#D7B2FF' },
        { step: '600', hex: '#CDA1FF' },
        { step: '700', hex: '#9E6BEB' },
        { step: '800', hex: '#783DDE' },
        { step: '900', hex: '#441E9F' },
        { step: '950', hex: '#200B6A' },
      ]}
    />

    <ScaleRow
      scaleName="Waxflower"
      prefix="bg-brand-waxflower"
      colors={[
        { step: '50', hex: '#FFEBD8' },
        { step: '100', hex: '#FFE0C1' },
        { step: '200', hex: '#FFCAA2' },
        { step: '300', hex: '#FFB67F' },
        { step: '400', hex: '#FF9364' },
        { step: '500', hex: '#F27E4B' },
        { step: '600', hex: '#DB6B49' },
        { step: '700', hex: '#B74932' },
        { step: '800', hex: '#AE3920' },
        { step: '900', hex: '#932B1F' },
        { step: '950', hex: '#511508' },
      ]}
    />

    <ScaleRow
      scaleName="Halo Green"
      prefix="bg-brand-halo-green"
      colors={[
        { step: '50', hex: '#DDF2E8' },
        { step: '100', hex: '#CCEADD' },
        { step: '200', hex: '#B2E1CC' },
        { step: '300', hex: '#7FDCB2' },
        { step: '400', hex: '#63D1A0' },
        { step: '500', hex: '#55BC8E' },
        { step: '600', hex: '#3A9D7B' },
        { step: '700', hex: '#257F68' },
        { step: '800', hex: '#16695C' },
        { step: '900', hex: '#115449' },
        { step: '950', hex: '#043630' },
      ]}
    />

    <ScaleRow
      scaleName="Bright Yellow"
      prefix="bg-brand-bright-yellow"
      colors={[
        { step: '50', hex: '#FFFADF' },
        { step: '100', hex: '#FFF1C9' },
        { step: '200', hex: '#FFEDBA' },
        { step: '300', hex: '#FFE291' },
        { step: '400', hex: '#FFE06C' },
        { step: '500', hex: '#FFD759' },
        { step: '600', hex: '#FFC523' },
        { step: '700', hex: '#DBA219' },
        { step: '800', hex: '#B78211' },
        { step: '900', hex: '#93640B' },
        { step: '950', hex: '#7A4F06' },
      ]}
    />
  </div>
)
BrandingColors.parameters = STORY_PARAMS

// =============================================================================
// Semantic Colors
// =============================================================================
export const SemanticColors = () => (
  <div style={PAGE_STYLE} className="space-y-10">
    <PageHeader
      title="Semantic Colors"
      description="Colors that define logic used when applied to digital interfaces. Each scale runs from 50 (lightest) to 950 (darkest)."
    />

    <ScaleRow
      scaleName="Error"
      prefix="bg-error"
      colors={[
        { step: '50', hex: '#FFE8E8' },
        { step: '100', hex: '#FDCDCD' },
        { step: '200', hex: '#FFAEAE' },
        { step: '300', hex: '#F56C6A' },
        { step: '400', hex: '#EC4451' },
        { step: '500', hex: '#E00C30' },
        { step: '600', hex: '#B90A27' },
        { step: '700', hex: '#93081F' },
        { step: '800', hex: '#6C0617' },
        { step: '900', hex: '#560311' },
        { step: '950', hex: '#370009' },
      ]}
    />

    <ScaleRow
      scaleName="Success"
      prefix="bg-success"
      colors={[
        { step: '50', hex: '#EEFFE9' },
        { step: '100', hex: '#DFFAD6' },
        { step: '200', hex: '#B9F6B0' },
        { step: '300', hex: '#86E382' },
        { step: '400', hex: '#5EC963' },
        { step: '500', hex: '#30A541' },
        { step: '600', hex: '#187637' },
        { step: '700', hex: '#0F5F31' },
        { step: '800', hex: '#094F2D' },
        { step: '900', hex: '#033A20' },
        { step: '950', hex: '#002212' },
      ]}
    />

    <ScaleRow
      scaleName="Info"
      prefix="bg-info"
      colors={[
        { step: '50', hex: '#E3F1FF' },
        { step: '100', hex: '#D1E7FE' },
        { step: '200', hex: '#A3CDFE' },
        { step: '300', hex: '#75AFFE' },
        { step: '400', hex: '#5395FD' },
        { step: '500', hex: '#1B6AFC' },
        { step: '600', hex: '#1351D8' },
        { step: '700', hex: '#0D3CB5' },
        { step: '800', hex: '#082A92' },
        { step: '900', hex: '#051D78' },
        { step: '950', hex: '#01114D' },
      ]}
    />

    <ScaleRow
      scaleName="Warning"
      prefix="bg-warning"
      colors={[
        { step: '50', hex: '#FFF5D5' },
        { step: '100', hex: '#FFEEB7' },
        { step: '200', hex: '#FDE19A' },
        { step: '300', hex: '#FFCD66' },
        { step: '400', hex: '#FFB93F' },
        { step: '500', hex: '#FF9800' },
        { step: '600', hex: '#DB7900' },
        { step: '700', hex: '#B75E00' },
        { step: '800', hex: '#934500' },
        { step: '900', hex: '#7A3400' },
        { step: '950', hex: '#471E00' },
      ]}
    />
  </div>
)
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
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime',
  'green', 'emerald', 'teal', 'cyan', 'sky',
  'blue', 'indigo', 'violet', 'purple', 'fuchsia',
  'pink', 'rose',
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
          <Swatch key={step} name={step} hex={hex} tailwindClass={`bg-${step}`} />
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
