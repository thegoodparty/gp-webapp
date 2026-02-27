'use client'
import { ReactNode, CSSProperties, ButtonHTMLAttributes } from 'react'

interface BaseButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'className' | 'style'
  > {
  children?: ReactNode
  style?: CSSProperties
  className?: string
}

const BaseButton = ({
  children,
  style,
  className = '',
  ...props
}: BaseButtonProps) => (
  <button
    className={`py-5 px-8 rounded-lg ${className}`}
    style={style}
    {...props}
  >
    {children}
  </button>
)

export default BaseButton
