import { Burger } from 'hamburger-react/dist-esm/Burger'

// NOTE: copy/pasted from https://github.com/cyntler/hamburger-react/blob/master/src/Burger.tsx
// to be able to change the onKeyUp handler to onKeyDown, was preventing keyboard presses from closing menu
export default function Hamburger(props) {
  return (
    <Burger
      {...props}
      render={(o) => (
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
}
