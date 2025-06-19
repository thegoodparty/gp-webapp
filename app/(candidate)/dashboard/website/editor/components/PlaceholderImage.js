import { ImageRounded } from '@mui/icons-material'

export default function PlaceholderImage({ theme }) {
  return (
    <div
      className={`w-full max-w-md h-80 rounded-lg shadow-lg ${theme.border} border-2 border-dashed flex items-center justify-center ${theme.secondary}`}
    >
      <div className="text-center">
        <ImageRounded className="h-16 w-16 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">Campaign Image</p>
      </div>
    </div>
  )
}
