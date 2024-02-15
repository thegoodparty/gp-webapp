'use client';
import 'intro.js/introjs.css';
import { Steps, Hints } from 'intro.js-react';
import { useEffect, useState } from 'react';
import H3 from '@shared/typography/H3';
import H2 from '@shared/typography/H2';
import Body1 from '@shared/typography/Body1';
import styles from './IntroTutorial.module.scss';

const steps = [
  {
    // element: '',
    intro: (
      <div className="text-center w-[600px]">
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
    // position: 'center',
    // tooltipClass: 'myTooltipClass',
    // highlightClass: 'myHighlightClass',
  },
  {
    element: '.selector2',
    intro: 'test 2',
  },
  {
    element: '.selector3',
    intro: 'test 3',
  },
];

export default function IntroTutorial() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(true);
  }, []);

  const onExit = () => {};
  return (
    <div>
      <Steps enabled={enabled} steps={steps} initialStep={0} onExit={onExit} />
    </div>
  );
}
