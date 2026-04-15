import { AlertCircle } from 'lucide-react'
import { Button } from '@styleguide'

export const ArtifactError = ({
  error,
  onRetry,
}: {
  error: string
  onRetry?: () => void
}) => (
  <div className="space-y-3">
    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 flex items-center gap-3">
      <AlertCircle className="size-5 shrink-0" />
      <span>{error}</span>
    </div>
    {onRetry && (
      <Button variant="outline" size="small" onClick={onRetry}>
        Retry
      </Button>
    )}
  </div>
)
