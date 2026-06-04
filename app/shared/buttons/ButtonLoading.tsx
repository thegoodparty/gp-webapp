'use client'
import { LoaderCircleIcon } from '@styleguide/components/ui/icons'

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

const ButtonLoading = ({
  size = 'medium',
  className = '',
}: ButtonLoadingProps) => (
  <LoaderCircleIcon
    size={SIZES[size]}
    className={`animate-spin mr-2 ${className}`}
  />
)

export default ButtonLoading
