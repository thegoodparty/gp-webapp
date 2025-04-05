'use client'
import React from 'react'
import styles from './BlackCheckbox.module.scss'

function BlackCheckboxClient({ value = false, disabled = false, ...props }) {
  return (
    <input
      type="checkbox"
      checked={value}
      disabled={disabled}
      className={styles.checkbox}
      {...props}
    />
  )
}

export default BlackCheckboxClient
