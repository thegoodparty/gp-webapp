import Link from 'next/link';

export default function Step({
  campaign,
  step,
  campaignStatus,
  index,
  sectionIndex,
  campaignSteps,
  nextStep,
}) {
  let stepStatus = campaignStatus[step.key] || {};
  if (sectionIndex !== false) {
    const campaignStepKey = campaignSteps[sectionIndex].key;
    const sectionStatus = campaignStatus[campaignStepKey];

    stepStatus = sectionStatus[step.key] || {};
  }

  let link = `/onboarding/${campaign.slug}/dashboard/${index + 1}`;
  if (sectionIndex !== false) {
    link = `/onboarding/${campaign.slug}/${step.key}/1`;
  }
  return (
    <div className="col-span-12 lg:col-span-4 h-full" key={step.key}>
      <div className=" bg-white rounded-xl h-full flex flex-col justify-between">
        <div className="px-6 py-8">
          <div className="inline-block rounded mb-3">{step.icon}</div>
          <h3 className="font-bold text-3xl">
            {index + 1}. {step.title}
          </h3>
          <h4 className="text-zinc-500 mt-3 leading-relaxed">
            {step.subTitle}
          </h4>
        </div>
        <div className="flex justify-between items-center px-6 py-4 text-sm">
          <div className="">
            <div
              className={`font-black ${
                stepStatus.status === 'Completed' && ' text-green-600'
              }  ${stepStatus.status === 'In Progress' && ' text-orange-600'} ${
                (stepStatus.status === 'Not Started' || !stepStatus.status) &&
                ' text-gray-600'
              }`}
            >
              {stepStatus.status || 'Not Started'}
            </div>
            <div className="mt-1">
              {stepStatus.completedSteps || 0} of{' '}
              {sectionIndex === false ? step.steps.length : step.steps} steps
            </div>
          </div>
          <div>
            <Link href={link} className=" no-underline">
              {stepStatus.status === 'Completed' && (
                <div className="underline text-gray-600 px-6 py-4  font-bold">
                  Edit
                </div>
              )}
              {stepStatus.status === 'In Progress' && (
                <div className="bg-orange-500 text-white px-12 py-4 rounded-full  font-black">
                  Continue
                </div>
              )}
            </Link>

            {(stepStatus.status === 'Not Started' || !stepStatus.status) && (
              <>
                {nextStep.sectionIndex === sectionIndex &&
                nextStep.step === index + 1 ? (
                  <Link href={link} className=" no-underline">
                    <div className="bg-orange-500 text-white px-12 py-4 rounded-full  font-black">
                      Get Started
                    </div>
                  </Link>
                ) : (
                  <div className=" text-gray-400 px-6 py-4  font-bold cursor-not-allowed">
                    Get Started
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
