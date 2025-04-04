import SecondaryButton from '@shared/buttons/SecondaryButton'
import PrimaryButton from '@shared/buttons/PrimaryButton'

export const ModalFooter = ({
  onBack = () => {},
  onNext = () => {},
  disabled = false,
  nextText = 'Next',
  backText = 'Back',
  nextButtonProps = {},
  backButtonProps = {},
}) => {
  return (
    <footer className="mt-4 grid grid-cols-12 gap-4">
      <div className="col-span-6 text-left mt-6 flex justify-start">
        <SecondaryButton onClick={onBack} {...backButtonProps}>
          {backText}
        </SecondaryButton>
      </div>
      <div className="col-span-6 text-right mt-6 flex justify-end">
        <PrimaryButton
          onClick={onNext}
          disabled={disabled}
          {...nextButtonProps}
        >
          {nextText}
        </PrimaryButton>
      </div>
    </footer>
  )
}
