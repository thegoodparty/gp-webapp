import { ReactNode } from 'react'
import { Card, CardContent } from '@styleguide'
import { numberFormatter } from 'helpers/numberHelper'

interface NumberInsightProps {
  title: string
  value: number
  icon: ReactNode
  isLoading?: boolean
  error?: string | null
  testID?: string
}

export const NumberInsight = ({
  title,
  value,
  icon,
  isLoading = false,
  error,
  testID,
}: NumberInsightProps) => {
  const showSkeleton = isLoading
  const showError = !isLoading && error
  const showValue = !isLoading && !error

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex items-center justify-between">
          <p>{title}</p>
          <div className="text-slate-600 [&_svg]:size-5">{icon}</div>
        </div>
        {showSkeleton && (
          <div className="mt-3 h-8 w-40 rounded bg-slate-100 animate-pulse" />
        )}
        {showError && (
          <p className="text-sm text-muted-foreground mt-2">
            Unable to load value
          </p>
        )}
        {showValue && (
          <p
            className="text-2xl leading-normal font-bold mt-2"
            data-testid={testID}
          >
            {numberFormatter(value)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
