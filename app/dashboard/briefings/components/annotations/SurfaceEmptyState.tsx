interface SurfaceEmptyStateProps {
  label: string
  message: string
}

export function SurfaceEmptyState({ label, message }: SurfaceEmptyStateProps) {
  return (
    <div
      data-testid="surface-empty-state"
      className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground"
    >
      <span className="font-mono text-xs uppercase tracking-widest">
        {label}
      </span>
      <span>{message}</span>
    </div>
  )
}
