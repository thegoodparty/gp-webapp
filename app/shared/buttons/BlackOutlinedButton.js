import React from 'react'
import styles from './BlackOutlinedButton.module.scss'
import BaseButton from './BaseButton'

const BlackOutlinedButton = ({
  children,
  disabled = false,
  fullWidth = false,
  style = {},
  type = 'button',
  ...props
}) => {
  return (
    <BaseButton
      variant="outlined"
      color="primary"
      fullWidth={fullWidth}
      disabled={disabled}
      style={style}
      type={type}
      className={styles.button}
      {...props}
    >
      <div className="py-0 px-6">{children}</div>
    </BaseButton>
  )
}

export default BlackOutlinedButton
