import Button from '@shared/buttons/Button'

export const TextingComplianceSubmitButton = ({
  onClick = (e) => {},
  loading = false,
  isValid = true,
  hasSubmissionError = false,
}) => {
  if (hasSubmissionError) {
    return (
      <div className="text-center py-4 bg-red-50 border border-red-200 rounded-lg">
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
