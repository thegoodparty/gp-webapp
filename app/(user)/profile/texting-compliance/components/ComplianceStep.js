import { FaChevronRight } from 'react-icons/fa'
import Body2 from '@shared/typography/Body2'
import { HiOutlineCheckCircle } from 'react-icons/hi'
import Link from 'next/link'

export default function ComplianceStep({
  number,
  title,
  description,
  route,
  status,
}) {
  const isCompleted = status === 'completed'
  const isActive = status === 'active'

  const bgColor = isActive ? 'bg-white' : 'bg-gray-50'
  const cursorStyle = isActive ? 'cursor-pointer' : 'cursor-not-allowed'

  const StepContent = (
    <div
      className={`flex ${isCompleted ? 'items-center' : 'items-start'} gap-3`}
    >
      {isCompleted ? (
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <HiOutlineCheckCircle className="w-6 h-6 text-gray-500" />
        </div>
      ) : (
        <div
          className={`w-8 h-8 rounded-full ${
            isActive ? 'bg-blue-100' : 'bg-gray-200'
          } flex items-center justify-center flex-shrink-0`}
        >
          <span
            className={`text-base font-normal ${
              isActive ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            {number}
          </span>
        </div>
      )}

      <div className="flex-1">
        <h4
          className={`text-base font-normal ${
            isCompleted
              ? 'text-gray-500'
              : isActive
              ? 'text-gray-900'
              : 'text-gray-900'
          }`}
        >
          {title}
        </h4>
        {description && !isCompleted && (
          <Body2 className="text-gray-600 mt-1">{description}</Body2>
        )}
      </div>

      {isActive && (
        <FaChevronRight className="text-gray-600 w-6 h-6 mt-1 flex-shrink-0" />
      )}
    </div>
  )

  return (
    <div
      className={`p-3 ${bgColor} border-b border-gray-200 last:border-b-0 ${cursorStyle} ${
        isActive ? 'hover:bg-gray-50' : ''
      } transition-colors`}
    >
      {route && isActive ? (
        <Link href={route} className="!no-underline">
          {StepContent}
        </Link>
      ) : (
        StepContent
      )}
    </div>
  )
}
