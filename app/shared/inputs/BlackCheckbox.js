import React from 'react'
import styles from './BlackCheckbox.module.scss'

function BlackCheckbox({
  value = false,
  onChange = () => {},
  disabled = false,
  ...props
}) {
  return (
    <input
      type="checkbox"
      checked={value}
      onClick={onChange}
      disabled={disabled}
      className={styles.input}
      {...props}
    />
  )
}

export default BlackCheckbox
