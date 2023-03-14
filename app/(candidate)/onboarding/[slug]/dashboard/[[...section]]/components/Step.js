import Link from 'next/link';
import { FaLock } from 'react-icons/fa';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import UnlockRob from './UnlockRob';

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
  const { status } = stepStatus;

  let link = `/onboarding/${campaign.slug}/dashboard/${index + 1}`;
  if (sectionIndex !== false) {
    link = `/onboarding/${campaign.slug}/${step.key}/1`;
  }
  if (step.link) {
    link = `/onboarding/${campaign.slug}${step.link}`;
  }

  if (step.customCard && step.customCard === 'unlockRob') {
    return <UnlockRob key={step.key} />;
  }

  return (
    <div
      className={`col-span-12 md:col-span-6 ${
        sectionIndex !== false ? 'lg:col-span-3' : 'lg:col-span-4'
      } h-full`}
      key={step.key}
    >
      <div className=" bg-white rounded-xl h-full flex flex-col justify-between">
        <div className="px-6 py-8">
          {step.icon && (
            <div className="inline-block rounded mb-3">{step.icon}</div>
          )}
          <h3 className="font-bold text-2xl">
            {index + 1}. {step.title}
          </h3>
          <h4 className="text-zinc-500 mt-3 leading-relaxed text-sm  ">
            {step.subTitle}
          </h4>
        </div>
        <div className="flex justify-between items-center px-6 py-4 text-sm">
          <div className="">
            <div
              className={`font-black ${
                status === 'Completed' && ' text-green-600 flex items-center'
              }  ${status === 'In Progress' && ' text-orange-600'} ${
                (status === 'Not Started' || !status) && ' text-gray-600'
              }`}
            >
              {status === 'Completed' && (
                <IoIosCheckmarkCircle className="mr-1" />
              )}
              {status || 'Not Started'}
            </div>
            {((sectionIndex === false && step.steps.length > 0) ||
              (sectionIndex !== false && step.steps > 0)) && (
              <div className="mt-1">
                {stepStatus.completedSteps +
                  (status === 'In Progress' ? 1 : 0) || 0}{' '}
                of {sectionIndex === false ? step.steps.length : step.steps}{' '}
                steps
              </div>
            )}
          </div>
          <div className="pl-3">
            <Link href={link} className=" no-underline">
              {status === 'Completed' && (
                <div className="underline text-gray-600 px-6 py-4  font-bold">
                  Edit
                </div>
              )}
              {status === 'In Progress' && (
                <div className="bg-yellow-400  px-8 py-4 rounded-full  font-black">
                  Continue
                </div>
              )}
            </Link>

            {(status === 'Not Started' || !status) && (
              <>
                {nextStep.sectionIndex === sectionIndex &&
                nextStep.step === index + 1 ? (
                  <Link href={link} className=" no-underline">
                    <div className="bg-yellow-400 px-8 py-4 rounded-full  font-black">
                      Get Started
                    </div>
                  </Link>
                ) : (
                  <div className=" text-gray-400 px-6 py-4  font-bold cursor-not-allowed flex items-center">
                    <FaLock /> <div className="ml-2">Get Started</div>
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
