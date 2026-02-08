declare module 'react-stickynode' {
  import { ComponentType, ReactNode } from 'react'

  interface StickyProps {
    enabled?: boolean
    top?: number | string
    bottomBoundary?: number | string
    innerZ?: number | string
    enableTransforms?: boolean
    activeClass?: string
    releasedClass?: string
    children?: ReactNode
    className?: string
    innerClass?: string
    innerActiveClass?: string
    onStateChange?: (status: { status: number }) => void
  }

  const Sticky: ComponentType<StickyProps>
  export default Sticky
}
