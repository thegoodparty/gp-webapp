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
        'GParty-AI is a Large Language Model (LLM) AI that has been trained on political campaigning, and also the data that you have provided.',
        'GParty-AI will chat with you and allow you to ask follow-up questions and provide corrections and suggestions.  However, it will decline inappropriate requests.',
        'GParty-AI can be told to be more concise or humorous, or even write in the style of known writers and politicians.',
      ],
    },
    {
      icon: <RiCloseCircleFill size={30} />,
      title: 'Limitations',
      bullets: [
        'GParty-AI is still in beta and learning.  So it may occasionally generate incorrect information.',
        'GParty-AI may also occasionally produce biased content',
        "GParty-AI's limitations are due to its limited knowledge of you, and of the world.  It is a work in progress.   So, please read over all suggestions and edit before finalizing.",
      ],
    },
    {
      icon: <AiOutlineBulb size={30} />,
      title: 'Examples to ask the GParty-AI',
      bullets: [
        'Highlight my experience as a former city council member and my passion for the working class.',
        'Make my statement more concise and at an 8th grade reading level.',
        ' Make my statement more funny and in the style of George Carlin.',
      ],
    },
  ];

  return (
    <div className="max-w-[600px] mx-auto">
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
      <div className="flex justify-center">
        <BlackButtonClient className="mt-8" onClick={nextCallback}>
          CONTINUE
        </BlackButtonClient>
      </div>
    </div>
  );
}
