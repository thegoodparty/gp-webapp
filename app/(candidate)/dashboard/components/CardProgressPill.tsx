import Caption from '@shared/typography/Caption'

interface CardProgressPillProps {
  total: number
  progress: number
  weeksUntil?: { weeks: number }
}

export default function CardProgressPill({
  total,
  progress,
  weeksUntil,
}: CardProgressPillProps): React.JSX.Element | null {
  if (progress >= total) {
    return null
  }
  if (weeksUntil?.weeks && weeksUntil.weeks > 11) {
    return null
  }
  return (
    <div className="absolute top-4 right-6 bg-red-400 text-slate-50 rounded-full py-1 px-2">
      <Caption>Focus here</Caption>
    </div>
  )
}
