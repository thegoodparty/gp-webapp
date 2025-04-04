/**
 * @typedef {Object} MarketingH2Props
 * @property {boolean} asH1 Pass true to render as an <h1> instead of <h2>
 * @property {string} className
 */

/**
 * @param {MarketingH2Props} props
 * @returns
 */
export default function MarketingH2({ children, asH1, className = '' }) {
  const Component = asH1 === true ? 'h1' : 'h2'

  return (
    <Component className={`font-medium text-4xl md:text-6xl ${className}`} data-testid="articleTitle">
      {children}
    </Component>
  )
}
