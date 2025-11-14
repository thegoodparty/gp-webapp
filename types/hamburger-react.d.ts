declare module 'hamburger-react/dist-esm/Burger' {
  import { CSSProperties, ReactNode } from 'react'

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

  interface BurgerProps {
    render?: (options: RenderOptions) => ReactNode
    [key: string]: unknown
  }

  export const Burger: (props: BurgerProps) => JSX.Element
}

