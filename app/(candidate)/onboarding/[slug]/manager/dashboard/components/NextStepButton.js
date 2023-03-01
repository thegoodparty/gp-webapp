import Link from 'next/link';

export default function NextStepButton({ nextStep, campaignSteps, campaign }) {
  const stepKey =
    campaignSteps[nextStep.sectionIndex]?.steps[nextStep.step]?.key;
  return (
    <Link href={`/onboarding/${campaign.slug}/${stepKey}`}>
      <div className="bg-orange-500 text-white py-4 px-12 inline-block rounded-full">
        <div className="font-bold">Continue</div>
      </div>
    </Link>
  );
}
