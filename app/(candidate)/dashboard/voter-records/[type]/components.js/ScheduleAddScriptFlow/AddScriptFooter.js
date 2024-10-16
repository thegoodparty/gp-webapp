import SecondaryButton from '@shared/buttons/SecondaryButton';
import PrimaryButton from '@shared/buttons/PrimaryButton';

export const AddScriptFooter = ({
  onBack = () => {},
  onNext = () => {},
  disabled = false,
  nextText = 'Next',
  backText = 'Back',
}) => {
  return (
    <footer className="mt-4 grid grid-cols-12 gap-4">
      <div className="col-span-6 text-left mt-6">
        <SecondaryButton onClick={onBack}>{backText}</SecondaryButton>
      </div>
      <div className="col-span-6 text-right mt-6">
        <PrimaryButton onClick={onNext} disabled={disabled}>
          {nextText}
        </PrimaryButton>
      </div>
    </footer>
  );
};
