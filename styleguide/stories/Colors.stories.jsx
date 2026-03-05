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

const sampleText = 'Aa'

function Swatch({ name, hex, tailwindClass, dark }) {
  return (
    <div className="flex flex-col items-start shrink-0 rounded overflow-hidden border border-gray-200 shadow-xs" style={{ width: 120 }}>
      <div
        style={{ backgroundColor: hex, height: 80, width: '100%' }}
      />
      <div className="p-2 w-full bg-white space-y-0.5">
        <p className="text-xs font-semibold text-gray-900 truncate">{name}</p>
        {tailwindClass && (
          <p className="text-[10px] text-gray-500 truncate font-mono">{tailwindClass}</p>
        )}
        <p className="text-[10px] text-gray-400 uppercase font-mono">{hex}</p>
      </div>
    </div>
  )
}

function Section({ title, description, children }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function SwatchRow({ children }) {
  return <div className="flex flex-wrap gap-2">{children}</div>
}

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
// Theme Colors
// =============================================================================
export const ThemeColors = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Theme Colors</h2>
      <p className="text-sm text-gray-500 mb-6">
        Core theme tokens from Figma (theme/*). These define the application&apos;s primary palette and are scoped via CSS variables.
      </p>
    </div>

    <Section title="Primary" description="Main brand action color — buttons, links, focus rings.">
      <SwatchRow>
        <Swatch name="primary" hex="#2563EB" tailwindClass="bg-primary" />
        <Swatch name="primary-foreground" hex="#FFFFFF" tailwindClass="text-primary-foreground" />
        <Swatch name="primary-dark" hex="#0D3CB5" tailwindClass="bg-primary-dark" />
        <Swatch name="primary-light" hex="#75AFFE" tailwindClass="bg-primary-light" />
        <Swatch name="primary-background" hex="#E3F1FF" tailwindClass="bg-primary-background" />
      </SwatchRow>
    </Section>

    <Section title="Secondary" description="Supporting color — secondary actions, subtle emphasis.">
      <SwatchRow>
        <Swatch name="secondary" hex="#0B1529" tailwindClass="bg-secondary" />
        <Swatch name="secondary-foreground" hex="#FFFFFF" tailwindClass="text-secondary-foreground" />
        <Swatch name="secondary-dark" hex="#060B17" tailwindClass="bg-secondary-dark" />
        <Swatch name="secondary-light" hex="#1D305C" tailwindClass="bg-secondary-light" />
        <Swatch name="secondary-background" hex="#ECF5FF" tailwindClass="bg-secondary-background" />
      </SwatchRow>
    </Section>

    <Section title="Tertiary" description="Accent color — highlights, decorative elements.">
      <SwatchRow>
        <Swatch name="tertiary" hex="#63D1A0" tailwindClass="bg-tertiary" />
        <Swatch name="tertiary-dark" hex="#257F68" tailwindClass="bg-tertiary-dark" />
        <Swatch name="tertiary-light" hex="#7FDCB2" tailwindClass="bg-tertiary-light" />
        <Swatch name="tertiary-background" hex="#DDF2E8" tailwindClass="bg-tertiary-background" />
      </SwatchRow>
    </Section>

    <Section title="Destructive" description="Destructive actions — delete, remove, errors.">
      <SwatchRow>
        <Swatch name="destructive" hex="#E00C30" tailwindClass="bg-destructive" />
        <Swatch name="destructive-foreground" hex="#FFFFFF" tailwindClass="text-destructive-foreground" />
      </SwatchRow>
    </Section>

    <Section title="Success" description="Positive outcomes — completed, saved, approved.">
      <SwatchRow>
        <Swatch name="success" hex="#30A541" tailwindClass="bg-success" />
        <Swatch name="success-foreground" hex="#FFFFFF" />
      </SwatchRow>
    </Section>

    <Section title="Info" description="Informational — tips, help, status.">
      <SwatchRow>
        <Swatch name="info" hex="#1B6AFC" tailwindClass="bg-info" />
        <Swatch name="info-foreground" hex="#FFFFFF" />
      </SwatchRow>
    </Section>

    <Section title="Warning" description="Caution — alerts, pending, at-risk.">
      <SwatchRow>
        <Swatch name="warning" hex="#FF9800" tailwindClass="bg-warning" />
        <Swatch name="warning-foreground" hex="#000000" />
      </SwatchRow>
    </Section>

    <Section title="Base / Neutral" description="Foundational tokens — backgrounds, foregrounds, borders.">
      <SwatchRow>
        <Swatch name="background" hex="#FFFFFF" tailwindClass="bg-background" />
        <Swatch name="foreground" hex="#0A0A0A" tailwindClass="text-foreground" />
        <Swatch name="muted" hex="#F5F5F5" tailwindClass="bg-muted" />
        <Swatch name="muted-foreground" hex="#737373" tailwindClass="text-muted-foreground" />
        <Swatch name="border" hex="#D4D4D4" tailwindClass="border-border" />
        <Swatch name="accent" hex="#F5F5F5" tailwindClass="bg-accent" />
        <Swatch name="card" hex="#FFFFFF" tailwindClass="bg-card" />
        <Swatch name="ring" hex="#1B6AFC" tailwindClass="ring-ring" />
      </SwatchRow>
    </Section>
  </div>
)

// =============================================================================
// Branding Colors
// =============================================================================
export const BrandingColors = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Branding Colors</h2>
      <p className="text-sm text-gray-500 mb-6">
        Colors that represent GoodParty.org&apos;s visual identity. Defined as static values in tailwind-theme.css.
      </p>
    </div>

    <Section title="Core Brand" description="Primary brand identifiers — logo, key surfaces.">
      <SwatchRow>
        <Swatch name="Red" hex="#DC1438" tailwindClass="bg-brand-red" />
        <Swatch name="Red Light" hex="#F7BAC5" tailwindClass="bg-brand-red-light" />
        <Swatch name="Blue" hex="#0048C2" tailwindClass="bg-brand-blue" />
        <Swatch name="Blue Light" hex="#A4C2F5" tailwindClass="bg-brand-blue-light" />
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

// =============================================================================
// Semantic Colors
// =============================================================================
export const SemanticColors = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Semantic Colors</h2>
      <p className="text-sm text-gray-500 mb-6">
        Colors that define logic used when applied to digital interfaces. Each scale runs from 50 (lightest) to 950 (darkest).
      </p>
    </div>

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

// =============================================================================
// Tailwind Colors (Grayscale, Base, Data/Chart)
// =============================================================================
export const TailwindColors = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Tailwind Colors</h2>
      <p className="text-sm text-gray-500 mb-6">
        An expertly-crafted, default color palette. Includes grayscale, base tokens, and chart colors.
      </p>
    </div>

    <ScaleRow
      scaleName="Grayscale"
      prefix="bg-grayscale"
      colors={[
        { step: '50', hex: '#F7FAFB' },
        { step: '100', hex: '#EEF3F6' },
        { step: '200', hex: '#E0E6EC' },
        { step: '300', hex: '#D1D8DF' },
        { step: '400', hex: '#B9C3CC' },
        { step: '500', hex: '#879099' },
        { step: '600', hex: '#70757A' },
        { step: '700', hex: '#595C5F' },
        { step: '800', hex: '#3E4042' },
        { step: '900', hex: '#2D2E30' },
        { step: '950', hex: '#1E1F20' },
      ]}
    />

    <Section title="Base Tokens" description="Foundational color tokens used across all components.">
      <SwatchRow>
        <Swatch name="foreground" hex="#0A0A0A" tailwindClass="text-base-foreground" />
        <Swatch name="background" hex="#FFFFFF" tailwindClass="bg-base-background" />
        <Swatch name="muted-foreground" hex="#737373" tailwindClass="text-base-muted-foreground" />
        <Swatch name="muted" hex="#F5F5F5" tailwindClass="bg-base-muted" />
        <Swatch name="border" hex="#D4D4D4" tailwindClass="border-base-border" />
        <Swatch name="accent" hex="#F5F5F5" tailwindClass="bg-base-accent" />
        <Swatch name="accent-foreground" hex="#0A0A0A" tailwindClass="text-base-accent-foreground" />
        <Swatch name="surface" hex="#FFFFFF" tailwindClass="bg-base-surface" />
        <Swatch name="focus-ring" hex="#A3A3A3" tailwindClass="ring-base-focus-ring" />
      </SwatchRow>
    </Section>

    <Section title="Data / Chart" description="Colors for data visualization and charts.">
      <SwatchRow>
        <Swatch name="chart-1" hex="#5975A6" tailwindClass="bg-data-chart-1" />
        <Swatch name="chart-2" hex="#CDA1FF" tailwindClass="bg-data-chart-2" />
        <Swatch name="chart-3" hex="#63D1A0" tailwindClass="bg-data-chart-3" />
        <Swatch name="chart-4" hex="#FFC523" tailwindClass="bg-data-chart-4" />
        <Swatch name="chart-5" hex="#FF9364" tailwindClass="bg-data-chart-5" />
      </SwatchRow>
    </Section>

    <Section title="Blue" description="Standard Tailwind blue scale.">
      <SwatchRow>
        {[
          { step: '50', hex: '#E3F1FF' },
          { step: '100', hex: '#D1E7FE' },
          { step: '200', hex: '#A3CDFE' },
          { step: '300', hex: '#75AFFE' },
          { step: '400', hex: '#2563EB' },
          { step: '500', hex: '#1B6AFC' },
          { step: '600', hex: '#1351D8' },
          { step: '700', hex: '#0D3CB5' },
          { step: '800', hex: '#082A92' },
          { step: '900', hex: '#051D78' },
          { step: '950', hex: '#01114D' },
        ].map(({ step, hex }) => (
          <Swatch key={step} name={step} hex={hex} tailwindClass={`bg-blue-${step}`} />
        ))}
      </SwatchRow>
    </Section>

    <Section title="Green" description="Standard Tailwind green scale.">
      <SwatchRow>
        {[
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
        ].map(({ step, hex }) => (
          <Swatch key={step} name={step} hex={hex} tailwindClass={`bg-green-${step}`} />
        ))}
      </SwatchRow>
    </Section>

    <Section title="Red" description="Standard Tailwind red scale.">
      <SwatchRow>
        {[
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
        ].map(({ step, hex }) => (
          <Swatch key={step} name={step} hex={hex} tailwindClass={`bg-red-${step}`} />
        ))}
      </SwatchRow>
    </Section>
  </div>
)
