import { CheckRounded } from '@mui/icons-material'
import { upperFirst } from 'es-toolkit'

const WEBSITE_STATUS = {
  published: 'published',
  unpublished: 'unpublished',
}

export default function StatusChip({ status }) {
  const isPublished = status === WEBSITE_STATUS.published

  return (
    <div
      className={`p-2 rounded inline-flex items-center font-medium text-xs ${
        isPublished
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {isPublished && <CheckRounded className="!text-sm mr-1" />}
      {upperFirst(status)}
    </div>
  )
}
