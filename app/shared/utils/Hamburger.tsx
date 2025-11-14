import { Burger } from 'hamburger-react/dist-esm/Burger'
import { CSSProperties } from 'react'

interface HamburgerProps {
  disabled?: boolean
  [key: string]: unknown
}

interface RenderOptions {
  label: string
  isToggled: boolean
  handler: () => void
  burgerStyles: CSSProperties
  barStyles: CSSProperties
  width: number
  topOffset: number
  time: number
  easing: string
  isLeft: boolean
  move: number
  barHeight: number
  margin: number
}

const Hamburger = (props: HamburgerProps) => (
  <Burger
    {...props}
    render={(o: RenderOptions) => (
      <div
        className="hamburger-react"
        aria-label={o.label}
        aria-expanded={o.isToggled}
        data-testid="tilt"
        onClick={props.disabled ? undefined : o.handler}
        onKeyDown={
          props.disabled ? undefined : (e) => e.key === 'Enter' && o.handler()
        }
        role="button"
        style={{
          ...o.burgerStyles,
          transform: `${
            o.isToggled ? `rotate(${90 * (o.isLeft ? -1 : 1)}deg)` : 'none'
          }`,
        }}
        tabIndex={0}
      >
        <div
          data-testid="bar-one"
          style={{
            ...o.barStyles,
            width: `${o.width}px`,
            top: `${o.topOffset}px`,
            transition: `${o.time}s ${o.easing}`,
            transform: `${
              o.isToggled
                ? `rotate(${45 * (o.isLeft ? -1 : 1)}deg) translate(${
                    o.move * (o.isLeft ? -1 : 1)
                  }px, ${o.move}px)`
                : 'none'
            }`,
          }}
        />

        <div
          data-testid="bar-two"
          style={{
            ...o.barStyles,
            width: `${o.width}px`,
            top: `${o.topOffset + o.barHeight + o.margin}px`,
            transition: `${o.time}s ${o.easing}`,
            transform: `${o.isToggled ? 'scaleX(0)' : 'none'}`,
          }}
        />

        <div
          data-testid="bar-three"
          style={{
            ...o.barStyles,
            width: `${o.width}px`,
            top: `${o.topOffset + o.barHeight * 2 + o.margin * 2}px`,
            transition: `${o.time}s ${o.easing}`,
            transform: `${
              o.isToggled
                ? `rotate(${45 * (o.isLeft ? 1 : -1)}deg) translate(${
                    o.move * (o.isLeft ? -1 : 1)
                  }px, ${o.move * -1}px)`
                : 'none'
            }`,
          }}
        />
      </div>
    )}
  />
)

export default Hamburger

