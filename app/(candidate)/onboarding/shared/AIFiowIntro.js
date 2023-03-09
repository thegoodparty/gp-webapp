'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { hookstate } from '@hookstate/core';

import { VscGraphLine } from 'react-icons/vsc';
import { RiCloseCircleFill } from 'react-icons/ri';
import { AiOutlineBulb } from 'react-icons/ai';

export default function AIFlowIntro({ nextCallback }) {
  const IntroItems = [
    {
      icon: <VscGraphLine size={30} />,
      title: 'Capabilities',
      bullets: [
        'We allow user to provide follow-up corrections to suggestions and will decline inappropriate requests',
      ],
    },
    {
      icon: <RiCloseCircleFill size={30} />,
      title: 'Limitations',
      bullets: [
        'We may occasionally generate incorrect information',
        'We may occasionally produce biased content',
        "The above limitations are due to our limited knowledge of you and the current world, we're always learning and improving.",
      ],
    },
    {
      icon: <AiOutlineBulb size={30} />,
      title: 'Examples to ask the Good Party AI',
      bullets: [
        'Highlight my experience as a former city council member and passion for the working class',
        'Make my WHY statement sound more formal / more like Ryan Reynolds',
      ],
    },
  ];

  return (
    <div className="max-w-[420px] mx-auto">
      {IntroItems.map((item) => (
        <div className="flex items-start" key={item.title}>
          <div className="mr-8">{item.icon}</div>
          <div>
            <div className="font-bold text-lg">{item.title}</div>
            <ul className="text-zinc-500 ">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="leading-relaxed">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
      <BlackButtonClient className="w-full mt-8" onClick={nextCallback}>
        CONTINUE
      </BlackButtonClient>
    </div>
  );
}
