import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@styleguide/lib/utils'

// Loading spinner component
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

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border",
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
        whiteOutline: 'button-whiteOutline',
        whiteGhost: 'button-whiteGhost',
      },
      size: {
        xSmall: 'h-6 px-3 py-1.5 button-text-small has-[>svg]:px-2',
        small: 'h-8 px-4 py-2 button-text-medium has-[>svg]:px-3',
        medium: 'h-10 px-5 py-2.5 button-text-large has-[>svg]:px-4',
        large: 'h-12 px-6 py-3 button-text-large has-[>svg]:px-5',
      },
      iconPosition: {
        left: '', // Default flex direction
        right: 'flex-row-reverse',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
      iconPosition: 'left',
    },
  },
)

interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || loading

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-loading={loading}
        className={cn(
          buttonVariants({ variant, size, iconPosition, className }),
        )}
        {...props}
        disabled={isDisabled}
      >
        {!loading && icon && iconPosition === 'left' && icon}
        {loading && <LoadingSpinner className="size-4" />}
        {loading ? loadingText || children : children}
        {!loading && icon && iconPosition === 'right' && icon}
      </Comp>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants, type ButtonProps }
