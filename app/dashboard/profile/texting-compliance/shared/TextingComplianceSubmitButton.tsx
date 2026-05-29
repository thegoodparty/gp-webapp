import { noop } from '@shared/utils/noop'
import Button from '@shared/buttons/Button'
import { MouseEvent } from 'react'

interface TextingComplianceSubmitButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  loading?: boolean
  isValid?: boolean
}

export const TextingComplianceSubmitButton = ({
  onClick = noop,
  loading = false,
  isValid = true,
}: TextingComplianceSubmitButtonProps): React.JSX.Element => (
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
