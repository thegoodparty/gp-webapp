import Link from 'next/link';

export default function NextStepButton({
  nextStep,
  campaign,
  sectionIndex,
  campaignSteps,
  campaignStatus,
}) {
  // const stepKey =
  //   campaignSteps[nextStep.sectionIndex]?.steps[nextStep.step]?.key;

  let link = `/onboarding/${campaign.slug}/dashboard/${
    nextStep.sectionIndex + 1
  }`;
  if (sectionIndex !== false) {
    const step = campaignSteps[sectionIndex]?.steps[nextStep.step - 1];
    link = `/onboarding/${campaign.slug}/${step.key}/1`;

    if (step.link) {
      link = `/onboarding/${campaign.slug}${step.link}`;
    }
  }
  let text = 'CONTINUE';
  if (campaignStatus.preLaunch?.status === 'Not Started') {
    text = 'GET STARTED';
  }

  return (
    <Link href={link}>
      <div className="bg-yellow-400  py-4 px-12 inline-block rounded-full">
        <div className="font-black">{text}</div>
      </div>
    </Link>
  );
}
