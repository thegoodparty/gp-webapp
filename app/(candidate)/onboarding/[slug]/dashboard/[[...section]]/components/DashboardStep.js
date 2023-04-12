import Link from 'next/link';
import { Fragment } from 'react';
import { FaLock } from 'react-icons/fa';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import UnlockJared from './UnlockJared';

export default function DashboardStep({
  campaign,
  step,
  campaignStatus,
  index,
}) {
  let stepStatus = campaignStatus[step.key] || {};
  console.log('step.key', step.key);

  const { status } = stepStatus;

  let link = `/onboarding/${campaign.slug}/dashboard/${index + 1}`;

  return (
    <div
      className="col-span-12 md:col-span-6 lg:col-span-4 h-full"
      key={step.key}
    >
      <div className=" bg-white rounded-xl h-full flex flex-col justify-between">
        <div className="px-6 py-8">
          <div className="inline-block rounded mb-3">{step.icon}</div>
          <h3 className="font-bold text-2xl">
            {index + 1}. {step.title}
          </h3>
          <h4 className="text-zinc-500 mt-3 leading-relaxed text-sm  ">
            {step.subTitle}
          </h4>
        </div>
        <div className="flex justify-between items-center px-6 py-4 text-sm">
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
              <div className=" text-gray-600">Not Started</div>
            )}

            {/* {((step.key !== 'preLaunch' && status === 'Not Started') ||
              !status) && <div className=" text-gray-600">Coming Soon</div>} */}

            {step.steps.length > 0 && (
              <div className="mt-1">
                {stepStatus.completedSteps +
                  (status === 'In Progress' ? 1 : 0) || 0}{' '}
                of {step.steps.length} steps
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
              {((step.key !== 'run' && status === 'Not Started') ||
                !status) && (
                <div className=" px-6 py-4  font-bold  flex items-center underline">
                  <div className="ml-2">Get Started</div>
                </div>
              )}
            </Link>

            {((step.key === 'run' && status === 'Not Started') || !status) && (
              <div className=" text-gray-400 px-6 py-4  font-bold cursor-not-allowed flex items-center">
                <FaLock /> <div className="ml-2">Get Started</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
