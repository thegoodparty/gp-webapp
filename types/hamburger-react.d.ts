declare module 'hamburger-react/dist-esm/Burger' {
  import { CSSProperties, ReactNode, HTMLAttributes } from 'react'

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

  interface BurgerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onToggle'> {
    size?: number
    color?: string
    direction?: 'left' | 'right'
    duration?: number
    easing?: string
    label?: string
    toggled?: boolean
    toggle?: (toggled: boolean) => void
    distance?: 'sm' | 'md' | 'lg'
    hideOutline?: boolean
    onToggle?: (toggled: boolean) => void
    rounded?: boolean
    disabled?: boolean
    render?: (options: RenderOptions) => ReactNode
  }

  export const Burger: (props: BurgerProps) => JSX.Element
}

