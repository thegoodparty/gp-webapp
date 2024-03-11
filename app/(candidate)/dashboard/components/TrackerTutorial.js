'use client';
import 'intro.js/introjs.css';
import './TrackerTutorial.css';
import { Steps } from 'intro.js-react';
import { useEffect, useRef, useState } from 'react';
import H2 from '@shared/typography/H2';
import Body1 from '@shared/typography/Body1';
import { setCookie } from 'helpers/cookieHelper';

const steps = [
  {
    intro: (
      <div className="text-center w-[80vw] max-w-[500px]">
        <div className="px-5 ">
          <H2>Learn how to use your campaign tracker</H2>
          <Body1 className="mt-12">
            See real-time updates on Doors Knocked, Calls Made, and Online
            Impressions. Based on local data, we&apos;ve set a winning target
            for you. Let&apos;s aim high and reach it together!
          </Body1>
        </div>
      </div>
    ),
  },
  {
    element: '#tracker-card-doorKnocking',
    intro: (
      <div className="w-[80vw] max-w-[500px]">
        <div className="px-5 ">
          <H2>Doors knocked dynamics</H2>
          <Body1 className="mt-12">
            Every door you knock on brings you closer to understanding and
            engaging with your constituents. Our tracker makes it easy to record
            these interactions, helping you gauge community sentiment and tailor
            your message.
          </Body1>
        </div>
      </div>
    ),
  },
  {
    element: '#tracker-card-calls',
    intro: (
      <div className="w-[80vw] max-w-[500px]">
        <div className="px-5 ">
          <H2>Call made</H2>
          <Body1 className="mt-12">
            Each phone call or SMS is a vital touchpoint with voters. Update
            your progress in the tracker to see how these conversations are
            incrementally building your support base.
          </Body1>
        </div>
      </div>
    ),
  },
  {
    element: '#tracker-card-digital',
    intro: (
      <div className="w-[80vw] max-w-[500px]">
        <div className="px-5 ">
          <H2>Online impressions</H2>
          <Body1 className="mt-12">
            Online ads are your digital handshake with voters. By tracking ad
            impressions, you understand your reach and refine your online
            presence for maximum impact.
          </Body1>
        </div>
      </div>
    ),
  },
  {
    element: '#progress-section',
    intro: (
      <div className="w-[80vw] max-w-[500px]">
        <div className="px-5 ">
          <H2>Track your progress </H2>
          <Body1 className="mt-12">
            Watch your campaign momentum build in real-time with our intuitive
            progress bar. Every action brings you a step closer to your vote
            goal and ultimate success.
          </Body1>
        </div>
      </div>
    ),
    position: 'top',
  },
];

export default function TrackerTutorial({ newContentCallback }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(true);
  }, []);

  const onExit = () => {
    setCookie('tutorial-tracker', true);
  };

  const onBeforeChange = (nextStepIndex) => {
    setTimeout(() => {
      if (nextStepIndex === 0) {
        const backButton = document.querySelector('.introjs-prevbutton');
        if (backButton) {
          backButton.style.display = 'none';
        }
      } else {
        const backButton = document.querySelector('.introjs-prevbutton');
        if (backButton) {
          backButton.style.display = 'inline-block';
        }
      }
    }, 1); // Short delay to ensure DOM elements are updated
  };

  return (
    <div>
      <Steps
        enabled={enabled}
        steps={steps}
        initialStep={0}
        onExit={onExit}
        onBeforeChange={onBeforeChange}
        options={{
          showBullets: false,
          doneLabel: 'Finish',
        }}
      />
    </div>
  );
}
