import Button from '@shared/buttons/Button'

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
