'use client'
import CircularProgress from '@mui/material/CircularProgress'

const SIZES = {
  small: 14,
  medium: 16,
  large: 20,
} as const

type ButtonSize = keyof typeof SIZES

interface ButtonLoadingProps {
  size?: ButtonSize
  className?: string
}

const ButtonLoading = ({ size = 'medium', className = '' }: ButtonLoadingProps) => (
  <CircularProgress
    size={SIZES[size] || SIZES.medium}
    className={`mr-2 ${className}`}
    color="inherit"
  />
)

export default ButtonLoading

