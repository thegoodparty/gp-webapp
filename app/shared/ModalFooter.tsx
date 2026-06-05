import React, { MouseEvent, ButtonHTMLAttributes } from 'react'
import { noop } from '@shared/utils/noop'
import { Button, type ButtonProps } from '@styleguide'

type SgSize = ButtonProps['size']
type SgVariant = ButtonProps['variant']

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
    size?: SgSize
    variant?: SgVariant
    loading?: boolean
  }
  backButtonProps?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'size' | 'onClick' | 'children'
  > & {
    size?: SgSize
    variant?: SgVariant
    loading?: boolean
  }
}

export const ModalFooter = ({
  onBack = noop,
  onNext = noop,
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
          variant="secondary"
          onClick={onBack}
          {...backButtonProps}
        >
          {backText}
        </Button>
      </div>
      <div className="col-span-6 text-right mt-6 flex justify-end">
        <Button
          size="large"
          variant="secondary"
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
