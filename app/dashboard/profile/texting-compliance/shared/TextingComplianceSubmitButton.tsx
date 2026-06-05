import { noop } from '@shared/utils/noop'
import { Button } from '@styleguide'
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
    size="large"
    className="flex-1 md:flex-initial"
    disabled={!isValid || loading}
    onClick={onClick}
    loading={loading}
  >
    Submit
  </Button>
)
