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
                <div className="px-6 py-8">
                  <div className="inline-block rounded">{step.icon}</div>
                  <h3 className="font-bold text-3xl mt-3">{step.title}</h3>
                  <h4 className="text-zinc-500 mt-3 leading-relaxed">
                    {step.subTitle}
                  </h4>
                </div>
                <div className="flex justify-between items-center px-6 py-4 border-b-2 border-slate-100 text-sm">
                  <div className="">
                    <div
                      className={`font-black ${
                        step.status === 'Completed' && ' text-green-600'
                      }  ${
                        step.status === 'In Progress' && ' text-orange-600'
                      } ${step.status === 'Not Started' && ' text-gray-600'}`}
                    >
                      {step.status}
                    </div>
                    <div className="mt-1">
                      {step.completedSteps} of {step.stepCount} steps
                    </div>
                  </div>
                  <div>
                    {step.status === 'Completed' && (
                      <div className="underline text-gray-600 px-6 py-4  font-bold">
                        View Details
                      </div>
                    )}
                    {step.status === 'In Progress' && (
                      <div className="bg-orange-500 text-white px-12 py-4 rounded-full  font-black">
                        Continue
                      </div>
                    )}
                    {step.status === 'Not Started' && (
                      <div className="underline text-gray-600 px-6 py-4  font-bold">
                        View Steps
                      </div>
                    )}
                  </div>
                </div>

                {/* <div className="flex justify-between items-center px-6 py-4 border-b-2 border-slate-100 text-sm ">
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
                  <div>
                    {step.completedSteps} of {step.stepCount} items
                  </div>
                </div>
                <div className="px-6 py-8 text-center">
                  {step.status === 'Completed' && (
                    <div className="underline text-gray-600 px-6 py-3  font-bold">
                      View Details
                    </div>
                  )}
                  {step.status === 'In Progress' && (
                    <div className="bg-orange-100 text-orange-600 px-6 py-3 rounded-full  font-bold">
                      Continue
                    </div>
                  )}
                  {step.status === 'Not Started' && (
                    <div className="underline text-gray-600 px-6 py-3  font-bold">
                      View Steps
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MaxWidth>
  );
}
