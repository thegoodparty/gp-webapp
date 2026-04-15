export const Stat = ({
  label,
  value,
}: {
  label: string
  value: string | number
}) => (
  <div className="text-center">
    <div className="text-2xl font-semibold">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
)
