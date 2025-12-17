import Button from '@shared/buttons/Button'
import { MouseEvent } from 'react'

interface TextingComplianceSubmitButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  loading?: boolean
  isValid?: boolean
  hasSubmissionError?: boolean
}

export const TextingComplianceSubmitButton = ({
  onClick = () => {},
  loading = false,
  isValid = true,
  hasSubmissionError = false,
}: TextingComplianceSubmitButtonProps): React.JSX.Element => {
  if (hasSubmissionError) {
    return (
      <div className="py-4 px-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">
          Form submission failed. Contact your Political Assistant to complete this process or report the issue.
        </p>
      </div>
    )
  }

  return (
    <Button
      {...{
        color: 'primary',
        size: 'large',
        className: 'flex-1 md:flex-initial',
        disabled: !isValid || loading,
        onClick,
        loading,
      }}
    >
      Submit
    </Button>
  )
}
