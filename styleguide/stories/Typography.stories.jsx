const meta = {
  title: 'Design System/Typography',
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

const sampleText = 'Almost before we knew it, we had left the ground.'
const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'

// =============================================================================
// Fonts
// =============================================================================
export const Fonts = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Font Families</h2>
      <p className="text-sm text-gray-500 mb-6">
        Four font families used across the design system. Headings use Outfit, body text uses Open Sans, and system/code uses Geist.
      </p>
    </div>

    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left">
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-45">Name</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-45">Font Family</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-40">Tailwind Class</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900">Sample</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-semibold text-gray-900">font-geist</td>
          <td className="py-4 px-4 text-gray-600">Geist</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">font-geist</td>
          <td className="py-4 px-4 font-geist" style={{ fontFamily: "'Geist', ui-sans-serif, system-ui, sans-serif" }}>{sampleText}</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-semibold text-gray-900">font-geist-mono</td>
          <td className="py-4 px-4 text-gray-600">Geist Mono</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">font-geist-mono</td>
          <td className="py-4 px-4 font-geist-mono" style={{ fontFamily: "'Geist Mono', ui-monospace, monospace" }}>{sampleText}</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-semibold text-gray-900">font-outfit</td>
          <td className="py-4 px-4 text-gray-600">Outfit</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">font-outfit</td>
          <td className="py-4 px-4 font-outfit" style={{ fontFamily: "'Outfit', sans-serif" }}>{sampleText}</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-semibold text-gray-900">font-opensans</td>
          <td className="py-4 px-4 text-gray-600">Open Sans</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">font-opensans</td>
          <td className="py-4 px-4 font-opensans" style={{ fontFamily: "'Open Sans', sans-serif" }}>{sampleText}</td>
        </tr>
      </tbody>
    </table>

    <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
      <p><strong>Usage:</strong> Headings (h1–h6) use <code className="text-xs">font-outfit</code>. Body text uses <code className="text-xs">font-opensans</code>. System/UI text uses <code className="text-xs">font-geist</code>. Code blocks use <code className="text-xs">font-geist-mono</code>.</p>
    </div>
  </div>
)

// =============================================================================
// Font Weights
// =============================================================================
export const FontWeights = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Font Weights</h2>
      <p className="text-sm text-gray-500 mb-6">
        Available font weights from the design system. Weight values map directly to CSS font-weight.
      </p>
    </div>

    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left">
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-45">Name</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-25">Value</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-40">Tailwind Class</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900">Sample (Outfit)</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900">Sample (Open Sans)</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4" style={{ fontWeight: 300 }}>light</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">300</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">font-light</td>
          <td className="py-4 px-4 font-outfit font-light" style={{ fontFamily: "'Outfit', sans-serif" }}>{sampleText}</td>
          <td className="py-4 px-4 font-opensans font-light" style={{ fontFamily: "'Open Sans', sans-serif" }}>{sampleText}</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4" style={{ fontWeight: 400 }}>normal</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">400</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">font-normal</td>
          <td className="py-4 px-4 font-outfit font-normal" style={{ fontFamily: "'Outfit', sans-serif" }}>{sampleText}</td>
          <td className="py-4 px-4 font-opensans font-normal" style={{ fontFamily: "'Open Sans', sans-serif" }}>{sampleText}</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4" style={{ fontWeight: 500 }}>medium</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">500</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">font-medium</td>
          <td className="py-4 px-4 font-outfit font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>{sampleText}</td>
          <td className="py-4 px-4 font-opensans font-medium" style={{ fontFamily: "'Open Sans', sans-serif" }}>{sampleText}</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4" style={{ fontWeight: 600 }}>semibold</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">600</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">font-semibold</td>
          <td className="py-4 px-4 font-outfit font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>{sampleText}</td>
          <td className="py-4 px-4 font-opensans font-semibold" style={{ fontFamily: "'Open Sans', sans-serif" }}>{sampleText}</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4" style={{ fontWeight: 700 }}>bold</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">700</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">font-bold</td>
          <td className="py-4 px-4 font-outfit font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>{sampleText}</td>
          <td className="py-4 px-4 font-opensans font-bold" style={{ fontFamily: "'Open Sans', sans-serif" }}>{sampleText}</td>
        </tr>
      </tbody>
    </table>
  </div>
)

// =============================================================================
// Type Scale
// =============================================================================
export const TypeScale = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Type Scale</h2>
      <p className="text-sm text-gray-500 mb-6">
        Full typography scale from the Figma design system. Sizes 9xl–xl use Outfit (headings), lg–xs use Open Sans (body).
      </p>
    </div>

    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left">
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-25">Size</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-25">Font Size</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-28">Line Height</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-25">Font</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900 w-30">Weight</th>
          <th className="py-3 px-4 text-sm font-bold text-gray-900">Sample</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">9xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">128px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">160px</td>
          <td className="py-4 px-4 text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 text-sm text-gray-500">Semibold (600)</td>
          <td className="py-4 px-4 font-outfit font-semibold text-5xl" style={{ fontFamily: "'Outfit', sans-serif" }}>Aa</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">8xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">96px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">120px</td>
          <td className="py-4 px-4 text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 text-sm text-gray-500">Semibold (600)</td>
          <td className="py-4 px-4 font-outfit font-semibold text-5xl" style={{ fontFamily: "'Outfit', sans-serif" }}>Aa</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">7xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">72px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">90px</td>
          <td className="py-4 px-4 text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 text-sm text-gray-500">Semibold (600)</td>
          <td className="py-4 px-4 font-outfit font-semibold" style={{ fontSize: '72px', lineHeight: '90px', fontFamily: "'Outfit', sans-serif" }}>Aa</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">6xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">60px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">72px</td>
          <td className="py-4 px-4 text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 text-sm text-gray-500">Semibold (600)</td>
          <td className="py-4 px-4 font-outfit font-semibold" style={{ fontSize: '60px', lineHeight: '72px', fontFamily: "'Outfit', sans-serif" }}>Aa</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">5xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">48px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">60px</td>
          <td className="py-4 px-4 text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 text-sm text-gray-500">Semibold (600)</td>
          <td className="py-4 px-4 font-outfit font-semibold text-5xl" style={{ fontFamily: "'Outfit', sans-serif" }}>Aa</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">4xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">40px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">52px</td>
          <td className="py-4 px-4 text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 text-sm text-gray-500">Semibold (600)</td>
          <td className="py-4 px-4 font-outfit font-semibold" style={{ fontSize: '40px', lineHeight: '52px', fontFamily: "'Outfit', sans-serif" }}>Aa</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">3xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">30px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">40px</td>
          <td className="py-4 px-4 text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 text-sm text-gray-500">Semibold (600)</td>
          <td className="py-4 px-4 font-outfit font-semibold text-3xl" style={{ fontFamily: "'Outfit', sans-serif" }}>Aa</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">2xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">24px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">32px</td>
          <td className="py-4 px-4 text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 text-sm text-gray-500">Semibold (600)</td>
          <td className="py-4 px-4 font-outfit font-semibold text-2xl" style={{ fontFamily: "'Outfit', sans-serif" }}>Aa</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-4 px-4 font-mono text-sm font-semibold">xl</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">20px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">28px</td>
          <td className="py-4 px-4 text-sm text-gray-500">Outfit</td>
          <td className="py-4 px-4 text-sm text-gray-500">Semibold (600)</td>
          <td className="py-4 px-4 font-outfit font-semibold text-xl" style={{ fontFamily: "'Outfit', sans-serif" }}>Aa</td>
        </tr>
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <td className="py-4 px-4 font-mono text-sm font-semibold">lg</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">18px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">28px</td>
          <td className="py-4 px-4 text-sm text-gray-500">Open Sans</td>
          <td className="py-4 px-4 text-sm text-gray-500">Semibold (600)</td>
          <td className="py-4 px-4 font-opensans font-semibold text-lg" style={{ fontFamily: "'Open Sans', sans-serif" }}>{sampleText}</td>
        </tr>
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <td className="py-4 px-4 font-mono text-sm font-semibold">base</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">16px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">24px</td>
          <td className="py-4 px-4 text-sm text-gray-500">Open Sans</td>
          <td className="py-4 px-4 text-sm text-gray-500">Normal (400)</td>
          <td className="py-4 px-4 font-opensans font-normal text-base" style={{ fontFamily: "'Open Sans', sans-serif" }}>{sampleText}</td>
        </tr>
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <td className="py-4 px-4 font-mono text-sm font-semibold">sm</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">14px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">20px</td>
          <td className="py-4 px-4 text-sm text-gray-500">Open Sans</td>
          <td className="py-4 px-4 text-sm text-gray-500">Normal (400)</td>
          <td className="py-4 px-4 font-opensans font-normal text-sm" style={{ fontFamily: "'Open Sans', sans-serif" }}>{sampleText}</td>
        </tr>
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <td className="py-4 px-4 font-mono text-sm font-semibold">xs</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">12px</td>
          <td className="py-4 px-4 font-mono text-sm text-gray-500">16px</td>
          <td className="py-4 px-4 text-sm text-gray-500">Open Sans</td>
          <td className="py-4 px-4 text-sm text-gray-500">Normal (400)</td>
          <td className="py-4 px-4 font-opensans font-normal text-xs" style={{ fontFamily: "'Open Sans', sans-serif" }}>{sampleText}</td>
        </tr>
      </tbody>
    </table>

    <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
      <p><strong>Note:</strong> Highlighted rows use Open Sans (body text). All others use Outfit (display/heading). The 9xl and 8xl sizes are shown scaled down in the sample column for readability.</p>
    </div>
  </div>
)

// =============================================================================
// Headings
// =============================================================================
export const Headings = () => (
  <div className="space-y-6">
    <div>
      <code className="text-xs text-muted">h1 · 48px · Bold · Outfit</code>
      <h1>Heading Level 1</h1>
    </div>
    <div>
      <code className="text-xs text-muted">h2 · 36px · Bold · Outfit</code>
      <h2>Heading Level 2</h2>
    </div>
    <div>
      <code className="text-xs text-muted">h3 · 30px · Semibold · Outfit</code>
      <h3>Heading Level 3</h3>
    </div>
    <div>
      <code className="text-xs text-muted">h4 · 24px · Semibold · Outfit</code>
      <h4>Heading Level 4</h4>
    </div>
    <div>
      <code className="text-xs text-muted">h5 · 20px · Medium · Outfit</code>
      <h5>Heading Level 5</h5>
    </div>
    <div>
      <code className="text-xs text-muted">h6 · 18px · Medium · Outfit</code>
      <h6>Heading Level 6</h6>
    </div>
  </div>
)

export const BodyText = () => (
  <div className="space-y-6 max-w-prose">
    <div>
      <code className="text-xs text-muted">p · 16px · Medium</code>
      <p>{longText}</p>
    </div>

    <div>
      <code className="text-xs text-muted">.text-lead · 20px · Regular</code>
      <p className="text-lead">{longText}</p>
    </div>

    <div>
      <code className="text-xs text-muted">.text-large · 18px</code>
      <p className="text-large">{longText}</p>
    </div>

    <div>
      <code className="text-xs text-muted">.text-small · 14px</code>
      <p className="text-small">{longText}</p>
    </div>

    <div>
      <code className="text-xs text-muted">.text-muted</code>
      <p className="text-muted">{longText}</p>
    </div>
  </div>
)

export const InlineElements = () => (
  <div className="space-y-4 max-w-prose">
    <p>
      This is a paragraph with <strong>strong text</strong>,{' '}
      <em>emphasized text</em>, and <a href="#">a link</a>. You can also use{' '}
      <code>inline code</code> within text.
    </p>

    <p>
      <small>This is small text using the small element.</small>
    </p>
  </div>
)

export const Lists = () => (
  <div className="space-y-6 max-w-prose">
    <div>
      <h3>Unordered List</h3>
      <ul>
        <li>First item in the list</li>
        <li>Second item with more text to show line wrapping behavior</li>
        <li>
          Third item
          <ul>
            <li>Nested item one</li>
            <li>Nested item two</li>
          </ul>
        </li>
        <li>Fourth item</li>
      </ul>
    </div>

    <div>
      <h3>Ordered List</h3>
      <ol>
        <li>First step in the process</li>
        <li>Second step with detailed explanation</li>
        <li>
          Third step
          <ol>
            <li>Sub-step A</li>
            <li>Sub-step B</li>
          </ol>
        </li>
        <li>Final step</li>
      </ol>
    </div>
  </div>
)

export const BlockElements = () => (
  <div className="space-y-6 max-w-prose">
    <div>
      <h3>Blockquote</h3>
      <blockquote>
        &quot;Design is not just what it looks like and feels like. Design is
        how it works.&quot; — Steve Jobs
      </blockquote>
    </div>

    <div>
      <h3>Code Block</h3>
      <pre>
        <code>{`function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`}</code>
      </pre>
    </div>
  </div>
)

export const Table = () => (
  <div className="max-w-prose">
    <h3>Data Table</h3>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Department</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Jane Smith</td>
          <td>Designer</td>
          <td>Product</td>
        </tr>
        <tr>
          <td>John Doe</td>
          <td>Developer</td>
          <td>Engineering</td>
        </tr>
        <tr>
          <td>Sarah Johnson</td>
          <td>Manager</td>
          <td>Operations</td>
        </tr>
      </tbody>
    </table>
  </div>
)

export const ButtonText = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <button className="button-text-large px-4 py-2 bg-blue-500 text-white rounded">
        Large Button
      </button>
      <code className="text-xs text-muted">.button-text-large · 16px</code>
    </div>

    <div className="flex items-center gap-4">
      <button className="button-text-medium px-3 py-1.5 bg-blue-500 text-white rounded">
        Medium Button
      </button>
      <code className="text-xs text-muted">.button-text-medium · 14px</code>
    </div>

    <div className="flex items-center gap-4">
      <button className="button-text-small px-2 py-1 bg-blue-500 text-white rounded">
        Small Button
      </button>
      <code className="text-xs text-muted">.button-text-small · 12px</code>
    </div>
  </div>
)

export const UtilityClasses = () => (
  <div className="space-y-6">
    <div>
      <h3>Font Sizes</h3>
      <div className="space-y-2">
        <p className="text-xs">Extra Small (.text-xs)</p>
        <p className="text-sm">Small (.text-sm)</p>
        <p className="text-base">Base (.text-base)</p>
        <p className="text-lg">Large (.text-lg)</p>
        <p className="text-xl">Extra Large (.text-xl)</p>
        <p className="text-2xl">2X Large (.text-2xl)</p>
        <p className="text-3xl">3X Large (.text-3xl)</p>
      </div>
    </div>

    <div>
      <h3>Font Weights</h3>
      <div className="space-y-2">
        <p className="font-regular">Regular (.font-regular)</p>
        <p className="font-medium">Medium (.font-medium)</p>
        <p className="font-semibold">Semibold (.font-semibold)</p>
        <p className="font-bold">Bold (.font-bold)</p>
      </div>
    </div>

    <div>
      <h3>Line Heights</h3>
      <div className="space-y-4">
        <p className="leading-none">None (.leading-none) - {sampleText}</p>
        <p className="leading-tight">Tight (.leading-tight) - {sampleText}</p>
        <p className="leading-normal">
          Normal (.leading-normal) - {sampleText}
        </p>
        <p className="leading-relaxed">
          Relaxed (.leading-relaxed) - {sampleText}
        </p>
      </div>
    </div>
  </div>
)

export const CompleteExample = () => (
  <article className="max-w-prose space-y-6">
    <header>
      <h1>Building Better Products</h1>
      <p className="text-lead text-muted">
        A guide to creating user-centered design systems
      </p>
    </header>

    <p>
      Good typography is <strong>invisible</strong>. When it&apos;s done well,
      readers don&apos;t notice the typeface, margins, or line spacing. They
      simply <em>absorb the content</em>.
    </p>

    <h2>Core Principles</h2>

    <p>
      There are three fundamental principles to keep in mind when designing a
      typography system:
    </p>

    <ol>
      <li>
        <strong>Hierarchy</strong> - Guide the reader&apos;s eye
      </li>
      <li>
        <strong>Consistency</strong> - Create predictable patterns
      </li>
      <li>
        <strong>Readability</strong> - Optimize for comprehension
      </li>
    </ol>

    <blockquote>
      &quot;Typography is the craft of endowing human language with a durable
      visual form.&quot; — Robert Bringhurst
    </blockquote>

    <h3>Implementation Details</h3>

    <p>
      When implementing a typography system, use semantic HTML elements like{' '}
      <code>&lt;h1&gt;</code> through <code>&lt;h6&gt;</code> for headings, and{' '}
      <code>&lt;p&gt;</code> for paragraphs.
    </p>

    <p className="text-small text-muted">
      Note: This example demonstrates how different typography elements work
      together to create a cohesive reading experience.
    </p>
  </article>
)
