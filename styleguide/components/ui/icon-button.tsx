import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@styleguide/lib/utils'

// Loading spinner component for icon buttons
const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    className={cn('animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-full transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border',
  {
    variants: {
      variant: {
        default: 'button-primary',
        secondary: 'button-secondary',
        destructive:
          'button-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline: 'button-outline focus-visible:ring-[3px]',
        ghost: 'button-ghost focus-visible:ring-[3px]',
        link: 'button-link',
        whiteOutline:
          'button-whiteOutline focus-visible:border-white focus-visible:ring-white/20 focus-visible:ring-[3px]',
        whiteGhost:
          'button-whiteGhost focus-visible:border-white/20 focus-visible:ring-white/20 focus-visible:ring-[3px]',
      },
      size: {
        xSmall: 'size-6',
        small: 'size-8',
        medium: 'size-10',
        large: 'size-12',
        xLarge: 'size-16',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
    },
  },
)

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean
  loading?: boolean
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || loading

    // Calculate spinner size based on button size
    const getSpinnerSize = () => {
      switch (size) {
        case 'xSmall':
          return 'size-3'
        case 'small':
          return 'size-4'
        case 'medium':
          return 'size-5'
        case 'large':
          return 'size-6'
        case 'xLarge':
          return 'size-8'
        default:
          return 'size-5'
      }
    }

    return (
      <Comp
        ref={ref}
        data-slot="icon-button"
        data-loading={loading}
        className={cn(iconButtonVariants({ variant, size, className }))}
        {...props}
        disabled={isDisabled}
      >
        {loading ? <LoadingSpinner className={getSpinnerSize()} /> : children}
      </Comp>
    )
  },
)

IconButton.displayName = 'IconButton'

export { IconButton, iconButtonVariants, type IconButtonProps }
