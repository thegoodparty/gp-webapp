import React, { ReactNode, CSSProperties, ButtonHTMLAttributes } from 'react'
import styles from './BlackOutlinedButton.module.scss'
import BaseButton from './BaseButton'

interface BlackOutlinedButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'style' | 'type'> {
  children?: ReactNode
  disabled?: boolean
  fullWidth?: boolean
  style?: CSSProperties
  type?: 'button' | 'submit' | 'reset'
  variant?: string
  color?: string
}

const BlackOutlinedButton = ({
  children,
  disabled = false,
  fullWidth = false,
  style = {},
  type = 'button',
  ...props
}: BlackOutlinedButtonProps) => (
  <BaseButton
    {...(props as Record<string, unknown>)}
    disabled={disabled}
    style={style}
    type={type}
    className={styles.button}
  >
    <div className="py-0 px-6">{children}</div>
  </BaseButton>
)

export default BlackOutlinedButton

