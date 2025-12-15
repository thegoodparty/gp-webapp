interface StatusStyle {
  dot: string
  text: string
  label: string
}

type WebsiteStatus = 'published' | 'unpublished'

interface StatusStyles {
  published: StatusStyle
  unpublished: StatusStyle
}

const STATUS_STYLES: StatusStyles = {
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

function isWebsiteStatus(status: string): status is WebsiteStatus {
  return status === 'published' || status === 'unpublished'
}

interface StatusChipProps {
  status: string
}

export default function StatusChip({ status }: StatusChipProps): React.JSX.Element {
  const validStatus = isWebsiteStatus(status) ? status : 'unpublished'
  const { dot, text, label } = STATUS_STYLES[validStatus]

  return (
    <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 border border-black/[0.12]">
      <span className={`w-[6px] h-[6px] rounded-full mr-2 ${dot}`} />
      <span className={`font-normal text-xs leading-4 ${text}`}>{label}</span>
    </div>
  )
}
