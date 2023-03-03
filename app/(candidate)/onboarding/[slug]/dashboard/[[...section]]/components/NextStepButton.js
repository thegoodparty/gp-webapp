import Link from 'next/link';

export default function NextStepButton({
  nextStep,
  campaign,
  sectionIndex,
  campaignSteps,
}) {
  // const stepKey =
  //   campaignSteps[nextStep.sectionIndex]?.steps[nextStep.step]?.key;

  let link = `/onboarding/${campaign.slug}/dashboard/${
    nextStep.sectionIndex + 1
  }`;
  if (sectionIndex !== false) {
    link = `/onboarding/${campaign.slug}/${
      campaignSteps[sectionIndex]?.steps[nextStep.step - 1]?.key
    }/1`;
  }
  return (
    <Link href={link}>
      <div className="bg-orange-500 text-white py-4 px-12 inline-block rounded-full">
        <div className="font-bold">Continue</div>
      </div>
    </Link>
  );
}
