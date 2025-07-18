import { FaChevronRight } from 'react-icons/fa'
import Body2 from '@shared/typography/Body2'

export default function ComplianceStep({ number, title, description, active }) {
  const bgColor = active ? 'bg-white' : 'bg-gray-50'
  const numberBgColor = active ? 'bg-blue-100' : 'bg-gray-200'
  const numberTextColor = active ? 'text-blue-600' : 'text-gray-500'
  const cursorStyle = active ? 'cursor-pointer' : 'cursor-not-allowed'
  
  return (
    <div 
      className={`p-3 ${bgColor} border-b border-gray-200 last:border-b-0 ${cursorStyle} ${active ? 'hover:bg-gray-50' : ''} transition-colors`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full ${numberBgColor} flex items-center justify-center flex-shrink-0`}>
          <span className={`text-base font-normal ${numberTextColor}`}>{number}</span>
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-base text-gray-900 mb-1">{title}</h3>
          <Body2 className="text-gray-600">{description}</Body2>
        </div>
        
        {active && <FaChevronRight className="text-gray-600 w-6 h-6 mt-1 flex-shrink-0" />}
      </div>
    </div>
  )
} 