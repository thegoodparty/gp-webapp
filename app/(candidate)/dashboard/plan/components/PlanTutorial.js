'use client';
import 'intro.js/introjs.css';
import './PlanTutorial.css';
import { Steps } from 'intro.js-react';
import { useRef } from 'react';
import H2 from '@shared/typography/H2';
import Body1 from '@shared/typography/Body1';
import { useRouter } from 'next/navigation';
import { setCookie } from 'helpers/cookieHelper';

const steps = [
  {
    // element: '',
    intro: (
      <div className="text-center w-[500px]">
        <div className="px-5 ">
          <H2>Learn how to use your personalized campaign plan</H2>
          <Body1 className="mt-12">
            Crafted by political experts and our AI, this plan is your roadmap
            to success. Tailored to your campaign&apos;s unique needs, it&apos;s
            time to strategize like a pro.
          </Body1>
        </div>
      </div>
    ),
  },
  {
    element: '#plan-section-why',
    intro: (
      <div className="w-[500px]">
        <div className="px-5 ">
          <H2>Generate your campaign plan</H2>
          <Body1 className="mt-12">
            We take the information you enter and generate campaign messaging
            for you to use across your campaign.
          </Body1>
        </div>
      </div>
    ),
  },
  {
    element: '#plan-section-why',
    intro: (
      <div className="w-[500px]">
        <div className="px-5 ">
          <H2>Provide your additional information</H2>
          <Body1 className="mt-12">
            Our AI model will generate your custom campaign plan based on your
            answers.
          </Body1>
        </div>
      </div>
    ),
  },
  {
    intro: (
      <div className="text-center w-[500px]">
        <div className="px-5 ">
          <H2>Navigating to Questions...</H2>
        </div>
      </div>
    ),
  },
];

export default function PlanTutorial({ expandKeyCallback }) {
  const router = useRouter();
  const stepsRef = useRef(null);

  const onExit = () => {
    console.log('on Exit');
    setCookie('tutorial-plan', true);
  };

  const handleChange = (nextStepIndex) => {
    const introJsInstance = stepsRef.current.introJs;

    if (nextStepIndex === 2) {
      expandKeyCallback('why');
      introJsInstance.setOption('nextLabel', 'Continue to questions');
    } else {
      introJsInstance.setOption('nextLabel', 'Next');
    }
    if (nextStepIndex === 3) {
      console.log('step3');
      setCookie('tutorial-plan', true);
      router.push('/dashboard/questions?generate=why');
    }
  };

  const handleBeforeChange = (nextStepIndex) => {
    // if (nextStepIndex === 2) {
    stepsRef.current.updateStepElement(nextStepIndex);
    // }
  };
  return (
    <div>
      <Steps
        enabled
        steps={steps}
        initialStep={0}
        onExit={onExit}
        onChange={handleChange}
        options={{
          // showProgress: false,
          showBullets: false,
        }}
        ref={stepsRef}
      />
    </div>
  );
}
