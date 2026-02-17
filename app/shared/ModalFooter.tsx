import React, { MouseEvent, ButtonHTMLAttributes } from 'react'
import Button, {
  ButtonSize,
  ButtonVariant,
  ButtonColor,
} from '@shared/buttons/Button'

interface ModalFooterProps {
  onBack?: (e: MouseEvent<HTMLButtonElement>) => void
  onNext?: (e: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  nextText?: string
  backText?: string
  nextButtonProps?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'size' | 'onClick' | 'disabled' | 'children'
  > & {
    size?: ButtonSize
    variant?: ButtonVariant
    color?: ButtonColor
    loading?: boolean
  }
  backButtonProps?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'size' | 'onClick' | 'children'
  > & {
    size?: ButtonSize
    variant?: ButtonVariant
    color?: ButtonColor
    loading?: boolean
  }
}

export const ModalFooter = ({
  onBack = () => {},
  onNext = () => {},
  disabled = false,
  nextText = 'Next',
  backText = 'Back',
  nextButtonProps = {},
  backButtonProps = {},
}: ModalFooterProps): React.JSX.Element => {
  return (
    <footer className="mt-4 grid grid-cols-12 gap-4">
      <div className="col-span-6 text-left mt-6 flex justify-start">
        <Button
          size="large"
          color="neutral"
          onClick={onBack}
          {...backButtonProps}
        >
          {backText}
        </Button>
      </div>
      <div className="col-span-6 text-right mt-6 flex justify-end">
        <Button
          size="large"
          color="secondary"
          onClick={onNext}
          disabled={disabled}
          {...nextButtonProps}
        >
          {nextText}
        </Button>
      </div>
    </footer>
  )
}
