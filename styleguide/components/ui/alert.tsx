import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@styleguide/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid gap-y-0.5 items-start',
  {
    variants: {
      variant: {
        default:
          'bg-card text-card-foreground border-neutral-400 [&>svg]:text-muted-foreground',
        info: 'bg-card text-blue-900 border-blue-400 [&>svg]:text-blue-900',
        success:
          'bg-card text-brand-halo-green-900 border-brand-halo-green-400 [&>svg]:text-brand-halo-green-900',
        destructive: 'bg-card text-red-900 border-red-400 [&>svg]:text-red-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface AlertProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode
}

function Alert({ className, variant, icon, children, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        alertVariants({ variant }),
        icon
          ? 'grid-cols-[calc(var(--spacing)*4)_1fr] gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5'
          : 'grid-cols-[0_1fr]',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-sm opacity-90 [&_p]:leading-relaxed',
        className,
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
