import PurpleButton from '@shared/buttons/PurpleButton';
import MaxWidth from '@shared/layouts/MaxWidth';
import { FaRegLightbulb } from 'react-icons/fa';
import { SlRocket } from 'react-icons/sl';
import { MdHowToVote } from 'react-icons/md';

import bgImg from '/public/images/landing-pages/hero-bg.png';

const steps = [
  {
    title: '1. Pre Launch',
    subTitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
    icon: <FaRegLightbulb size={30} />,
    stepCount: 18,
    completedSteps: 18,
    status: 'Completed',
  },
  {
    title: '2. Launch',
    subTitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
    icon: <SlRocket size={30} />,
    stepCount: 12,
    completedSteps: 2,
    status: 'In Progress',
  },
  {
    title: '3. Run',
    subTitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
    icon: <MdHowToVote size={30} />,
    stepCount: 15,
    completedSteps: 0,
    status: 'Not Started',
  },
];

export default function Steps() {
  return (
    <MaxWidth>
      <div className=" rounded-2xl mt-6">
        <div className="grid grid-cols-12 gap-4 items-stretch">
          {steps.map((step) => (
            <div className="col-span-12 lg:col-span-4 h-full" key={step.title}>
              <div className=" bg-white rounded-xl h-full">
                <div className="flex justify-between items-center px-6 py-4 border-b-2 border-slate-100 text-sm ">
                  <div>
                    {step.completedSteps} of {step.stepCount} items
                  </div>
                  <div
                    className={`block px-3 py-1  rounded-full ${
                      step.status === 'Completed' &&
                      'bg-green-100 text-green-600'
                    }  ${
                      step.status === 'In Progress' &&
                      'bg-orange-100 text-orange-600'
                    } ${
                      step.status === 'Not Started' &&
                      'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {step.status}
                  </div>
                </div>
                <div className="px-6 py-8">
                  <div className="inline-block rounded">{step.icon}</div>
                  <h3 className="font-bold text-3xl mt-3">{step.title}</h3>
                  <h4 className="text-zinc-500 mt-3 mb-8 leading-relaxed">
                    {step.subTitle}
                  </h4>
                  {step.status === 'Completed' && (
                    <div className="underline mt-7">View Details</div>
                  )}
                  {step.status === 'In Progress' && (
                    <div className="bg-orange-100 text-orange-600 px-6 py-3 rounded-full inline-block font-bold">
                      Continue
                    </div>
                  )}
                  {step.status === 'Not Started' && (
                    <div className="bg-gray-100 text-gray-600 px-6 py-3 rounded-full inline-block font-bold">
                      Start
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MaxWidth>
  );
}
