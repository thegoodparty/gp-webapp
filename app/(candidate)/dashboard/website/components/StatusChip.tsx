interface StatusStyle {
  dot: string
  text: string
  label: string
}

const STATUS_STYLES: Partial<Record<string, StatusStyle>> = {
  published: {
    dot: 'bg-green-500',
    text: 'text-gray-900',
    label: 'Published',
  },
  unpublished: {
    dot: 'bg-orange-500',
    text: 'text-gray-900',
    label: 'Draft',
  },
}

interface StatusChipProps {
  status: string
}

export default function StatusChip({ status }: StatusChipProps): React.JSX.Element {
  const { dot, text, label } =
    STATUS_STYLES[status] || STATUS_STYLES.unpublished!

  return (
    <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 border border-black/[0.12]">
      <span className={`w-[6px] h-[6px] rounded-full mr-2 ${dot}`} />
      <span className={`font-normal text-xs leading-4 ${text}`}>{label}</span>
    </div>
  )
}
