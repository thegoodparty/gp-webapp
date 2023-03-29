import Link from 'next/link';
import { Fragment } from 'react';
import { FaLock } from 'react-icons/fa';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import UnlockJared from './UnlockJared';

export default function SectionStep({
  campaign,
  step,
  campaignStatus,
  index,
  sectionIndex,
  campaignSteps,
  nextStep,
}) {
  const campaignStepKey = campaignSteps[sectionIndex].key;
  const sectionStatus = campaignStatus[campaignStepKey];
  const stepStatus = sectionStatus[step.key] || {};

  const { status } = stepStatus;

  let link = `/onboarding/${campaign.slug}/${step.key}/1`;

  if (step.link) {
    link = `/onboarding/${campaign.slug}${step.link}`;
  }
  console.log('link', link);

  if (step.customCard && step.customCard === 'UnlockJared') {
    return (
      <Fragment key={step.key}>
        <UnlockJared unlocked={step.key === 'incentive'} campaign={campaign} />
      </Fragment>
    );
  }

  return (
    <div
      className="col-span-12 md:col-span-6  xl:col-span-3 h-full"
      key={step.key}
    >
      <div className=" bg-white rounded-xl h-full flex flex-col justify-between">
        <div className="px-6 pt-8 pb-3">
          <h3 className="font-bold text-2xl">{step.title}</h3>
          <h4 className="text-zinc-500 mt-3 leading-relaxed text-sm">
            {step.subTitle}
          </h4>
        </div>
        <div className="flex justify-between items-center px-6 pb-4 text-sm">
          <div className="">
            {status === 'Completed' && (
              <div className="font-black text-green-600 flex items-center">
                <IoIosCheckmarkCircle className="mr-1" />
                Completed
              </div>
            )}
            {status === 'In Progress' && (
              <div className="font-black text-orange-600">In Progress</div>
            )}
            {(status === 'Not Started' || !status) && (
              <div className="font-black text-gray-600">
                {status || 'Not Started'}
              </div>
            )}

            {step.steps > 0 && status !== 'Completed' && (
              <div className="mt-1">
                {stepStatus.completedSteps +
                  (status === 'In Progress' ? 1 : 0) || 0}{' '}
                of {step.steps} steps
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
