import PrimaryButton from '@shared/buttons/PrimaryButton';
import Confetti from './Confetti';
import H1 from '@shared/typography/H1';

export default function Done() {
  return (
    <div className="flex flex-col h-[calc(100vh-216px)] items-center justify-center">
      <H1 className="text-center">You&apos;re all set!</H1>
      <a href="/dashboard/plan" className="mt-10 block">
        <PrimaryButton>Back to Dashboard</PrimaryButton>
      </a>
      <Confetti button={<PrimaryButton>Done</PrimaryButton>} />
    </div>
  );
}
