export const DEFAULT_SLANT_SECTION_COLORS = [
  'rgba(0,0,0,0)',
  'var(--color-primary-dark)',
  'rgba(0,0,0,0)',
]

interface SlantSectionProps {
  colors?: string[]
  children: React.ReactNode
  reverseDirection?: boolean
}

export const SlantSection = ({
  colors = DEFAULT_SLANT_SECTION_COLORS,
  children,
  reverseDirection = false,
}: SlantSectionProps): React.JSX.Element => {
  if (colors.length !== 3) {
    throw new Error('SlantSection must be implemented w/ exactly 3 colors')
  }
  const direction = reverseDirection ? -176 : 176
  return (
    <section>
      {colors[0] && (
        <div
          className={`h-[calc(100vw*0.09)] w-full`}
          style={{
            background: `linear-gradient(${direction}deg, ${colors[0]} 54.5%, ${colors[1]} 55%)`,
          }}
        />
      )}
      {children}
      {colors[1] && (
        <div
          className={`h-[calc(100vw*0.03)] w-full`}
          style={{
            background: `linear-gradient(${direction}deg, ${colors[1]} 54.5%, ${colors[2]} 55%)`,
          }}
        />
      )}
    </section>
  )
}
