import { ChevronRight, CircleCheck } from 'lucide-react'
import Link from 'next/link'
import { STEP_STATUS, StepStatus } from '../shared/TextCompliance.types'

interface TextComplianceStepProps {
  number: number
  total: number
  title: string
  route: string
  status: StepStatus
}

export default function TextComplianceStep({
  number,
  total,
  title,
  route,
  status,
}: TextComplianceStepProps): React.JSX.Element {
  const isActive = status === STEP_STATUS.ACTIVE
  const isCompleted = status === STEP_STATUS.COMPLETED
  const isDisabled = status === STEP_STATUS.DISABLED
  const isLast = number === total

  const content = (
    <div
      className={`p-3 md:p-4 flex items-center justify-between ${
        isLast ? '' : 'border-b border-gray-200'
      }
      ${isDisabled || isCompleted ? 'bg-muted' : ''}
      ${isDisabled ? 'cursor-not-allowed' : ''}
      ${isActive ? 'hover:bg-blue-50' : ''} transition-colors`}
    >
      <div className="flex items-center gap-3">
        {isCompleted ? (
          <CircleCheck className="w-6 h-6 text-gray-300" />
        ) : (
          <div
            className={`w-8 h-8 rounded-full ${
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'bg-neutral-light text-gray-500'
            } flex items-center justify-center shrink-0`}
          >
            <span className="text-base font-normal">{number}</span>
          </div>
        )}
        <h4 className={isCompleted ? 'text-gray-400' : ''}>{title}</h4>
      </div>
      {isActive && <ChevronRight />}
    </div>
  )

  if (isActive) {
    return <Link href={route}>{content}</Link>
  }

  return <div aria-disabled={status === STEP_STATUS.DISABLED}>{content}</div>
}
