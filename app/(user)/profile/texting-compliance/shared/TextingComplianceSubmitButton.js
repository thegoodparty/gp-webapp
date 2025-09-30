import Button from '@shared/buttons/Button'

export const TextingComplianceSubmitButton = ({
  onClick = (e) => {},
  loading = false,
  isValid = true,
  hasSubmissionError = false,
}) => (
  <Button
    {...{
      color: 'primary',
      size: 'large',
      className: 'flex-1 md:flex-initial',
      disabled: !isValid || loading || hasSubmissionError,
      onClick,
      loading,
    }}
  >
    Submit
  </Button>
)
