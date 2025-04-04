'use client'
import CircularProgress from '@mui/material/CircularProgress'

const SIZES = {
  small: 14,
  medium: 16,
  large: 20,
}

export default function ButtonLoading({ size = 'medium', className = '' }) {
  return (
    <CircularProgress
      size={SIZES[size] || SIZES.medium}
      className={`mr-2 ${className}`}
      color="inherit"
    />
  )
}
