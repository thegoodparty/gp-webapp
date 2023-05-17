import YellowButtonClient from '@shared/buttons/YellowButtonClient';
import Link from 'next/link';
import { Fragment } from 'react';
import { FaLock } from 'react-icons/fa';
import { GrCheckmark } from 'react-icons/gr';
import UnlockJared from './UnlockJared';

const statusStyles = {
  locked: {
    label: 'Locked',
    color: '#888888',
    active: false,
    buttonLabel: '',
    hideButton: true,
    showIcon: true,
  },
  notStarted: {
    label: 'Not Started',
    color: '#888888',
    active: true,
    buttonLabel: 'GET STARTED',
  },
  inProgress: {
    label: 'In Progress',
    color: '#EAAC17',
    active: true,
    buttonLabel: 'CONTINUE',
  },
  inReview: {
    label: 'In Review',
    color: '#E00C30',
    active: true,
    buttonLabel: 'PENDING',
  },
  completed: {
    label: 'Completed',
    color: '#47E28B',
    active: true,
    buttonLabel: 'View details',
    hideButton: true,
    showIcon: true,
  },
};

export default function Step({ campaign, step, campaignStatus }) {
  const { key, title, stepNum, subTitle, connectedLine } = step;

  const stepStatus = campaignStatus[step.key];
  const status = stepStatus.status;
  let statusStyle = statusStyles[stepStatus.status];

  const completedSteps = Math.min(
    stepStatus.completedSteps,
    stepStatus.totalSteps,
  );

  let link = `/onboarding/${campaign.slug}/${step.key}/1`;
  if (status === 'inProgress' || status === 'inReview') {
    link = `/onboarding/${campaign.slug}/${step.key}/${completedSteps}`;
  }
  if (step.link) {
    link = `/onboarding/${campaign.slug}${step.link}`;
  }
  if (step.link === 'custom' && key === 'profile') {
    link = `/candidate/${campaign.slug}/edit`;
  }

  const showBorder =
    status === 'notStarted' || status === 'inProgress' || status === 'inReview';
  return (
    <div className="col-span-12 lg:col-span-4 h-full relative" key={step.key}>
      <div
        className={`bg-white p-5 h-full rounded-2xl flex flex-col justify-between z-10 relative transition-shadow hover:shadow-lg ${
          showBorder && 'border-[3px] border-black'
        }`}
      >
        <div className="">
          {(statusStyle.showIcon || step.aiIcon) && (
            <div className="absolute top-3 right-3">
              {status === 'completed' && (
                <div className="bg-green-400 py-2 px-3 rounded-full">
                  <GrCheckmark />
                </div>
              )}
              {step.aiIcon && status !== 'completed' ? (
                <div className="bg-blue-500 text-white py-2 px-3 rounded-full">
                  AI
                </div>
              ) : (
                <>
                  {status === 'locked' && (
                    <div className="bg-zinc-400 bg-opacity-30   py-2 px-3 rounded-full">
                      <FaLock />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          <div className="flex pr-3 items-start">
            <div
              className={`font-bold text-7xl ${
                status === 'locked' && 'text-zinc-400'
              }`}
            >
              {stepNum}
            </div>
            <div
              className={`ml-3 text-2xl font-bold mt-1 ${
                status === 'locked' && 'text-zinc-400'
              }`}
            >
              {title}
            </div>
          </div>
          <div className="text-sm mt-6 text-neutral-500">{subTitle}</div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <div
              className="text-sm font-black"
              style={{ color: statusStyle.color }}
            >
              {statusStyle.label}
            </div>
            <div className="text-xs">
              {completedSteps} of {stepStatus.totalSteps} items
            </div>
          </div>
          {!statusStyle.hideButton ? (
            <div>
              <Link href={link}>
                <YellowButtonClient style={{ padding: '8px 16px' }}>
                  <div className="text-sm font-bold">
                    {statusStyle.buttonLabel}
                  </div>
                </YellowButtonClient>
              </Link>
            </div>
          ) : null}
          {status === 'completed' && (
            <Link href={link}>
              <div className="font-bold underline text-sm">View details</div>
            </Link>
          )}
        </div>
      </div>

      <div
        className={`absolute z-0 bg-black opacity-10 -bottom-12 left-1/2 -ml-2.5 w-5 h-14 lg:top-1/2 lg:left-auto lg:-right-[34px] lg:-mt-5 lg:ml-0 lg:rotate-90 ${
          !connectedLine && 'lg:hidden'
        }`}
      ></div>
    </div>
  );
}
