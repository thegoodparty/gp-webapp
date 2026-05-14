import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'

import { cn } from '@styleguide/lib/utils'

const LoadingSpinner = ({ className }: { className?: string }) => (
  <LoaderCircle className={cn('animate-spin', className)} />
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
        right: '',
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
