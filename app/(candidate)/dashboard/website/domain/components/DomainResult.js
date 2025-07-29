import { memo } from 'react'
import { CircularProgress } from '@mui/material'
import { numberFormatter } from 'helpers/numberHelper'

const DomainResult = memo(function DomainResult({
  domain,
  price,
  available = true,
  loading = false,
  onClick,
  selected = false,
}) {
  const isInteractive = available && !loading
  const displayText = available ? `$${numberFormatter(price)}` : 'Unavailable'

  return (
    <div
      className={`border rounded-lg p-3 transition-colors ${
        selected ? 'bg-primary text-white' : ''
      } ${
        isInteractive && !selected
          ? 'hover:bg-gray-50 hover:text-primary cursor-pointer'
          : 'bg-gray-100 opacity-60'
      }`}
      onClick={isInteractive ? onClick : undefined}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium">{domain}</span>
        <span
          className={`text-sm ${selected ? 'text-white' : 'text-gray-600'}`}
        >
          {loading ? <CircularProgress size={16} /> : displayText}
        </span>
      </div>
    </div>
  )
})

export default DomainResult
