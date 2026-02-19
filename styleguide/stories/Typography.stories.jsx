export default {
  title: 'Design System/Typography',
  parameters: {
    docs: {
      description: {
        component:
          'Typography styles for the design system using standard HTML elements and utility classes.',
      },
    },
  },
}

const sampleText = 'Almost before we knew it, we had left the ground.'
const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'

export const Headings = () => (
  <div className="space-y-6">
    <div>
      <code className="text-xs text-muted">h1 · 60px · Semibold</code>
      <h1>Heading Level 1</h1>
    </div>
    <div>
      <code className="text-xs text-muted">h2 · 48px · Semibold</code>
      <h2>Heading Level 2</h2>
    </div>
    <div>
      <code className="text-xs text-muted">h3 · 40px · Semibold</code>
      <h3>Heading Level 3</h3>
    </div>
    <div>
      <code className="text-xs text-muted">h4 · 32px · Semibold</code>
      <h4>Heading Level 4</h4>
    </div>
    <div>
      <code className="text-xs text-muted">h5 · 24px · Semibold</code>
      <h5>Heading Level 5</h5>
    </div>
    <div>
      <code className="text-xs text-muted">h6 · 20px · Semibold</code>
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
        &quot;Design is not just what it looks like and feels like. Design is how it
        works.&quot; — Steve Jobs
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
      readers don&apos;t notice the typeface, margins, or line spacing. They simply{' '}
      <em>absorb the content</em>.
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
      &quot;Typography is the craft of endowing human language with a durable visual
      form.&quot; — Robert Bringhurst
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
