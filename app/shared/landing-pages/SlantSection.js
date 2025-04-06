import { theme } from 'tailwind.config'

export const DEFAULT_SLANT_SECTION_COLORS = [
  'rgba(0,0,0,0)',
  theme.extend.colors.primary.dark,
  'rgba(0,0,0,0)',
]
export const SlantSection = ({
  colors = DEFAULT_SLANT_SECTION_COLORS,
  children,
  reverseDirection = false,
}) => {
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
