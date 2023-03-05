'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import RenderInputField from 'app/(candidate)/onboarding/components/RenderInputField';
import { useEffect, useState } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { getUserCookie } from 'helpers/cookieHelper';
import ReactLoading from 'react-loading';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { hookstate } from '@hookstate/core';
import Typewriter from 'typewriter-effect';

import { VscGraphLine } from 'react-icons/vsc';
import { BsSaveFill } from 'react-icons/bs';
import { RiCloseCircleFill } from 'react-icons/ri';
import { HiPencil } from 'react-icons/hi';
import { AiOutlineBulb, AiTwotoneTool } from 'react-icons/ai';
import UserAvatar from '@shared/user/UserAvatar';
import Image from 'next/image';

export const savingState = hookstate(false);

export default function AIFlow({
  inputFields,
  campaign,
  subSectionKey,
  nextPath,
  ...props
}) {
  const initialState = {};
  const keys = [];
  // savingState.set(() => false);

  inputFields.map((field) => {
    if (field.initialValue) {
      initialState[field.key] = field.initialValue;
    } else {
      initialState[field.key] = '';
    }
    keys.push(field.key);
  });

  if (campaign?.[subSectionKey]) {
    keys.forEach((key) => {
      if (campaign[subSectionKey][key]) {
        initialState[key] = campaign[subSectionKey][key];
      }
    });
  }

  const { key, withIntro } = inputFields[0];

  const [state, setState] = useState(initialState);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowInto] = useState(withIntro);
  // const [showIntro, setShowInto] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const user = getUserCookie(true);

  const canSave = () => {
    return true;
  };

  const handleSave = async (skipped) => {};

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

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

  const { office, district } = campaign.details || {};
  const officeState = campaign.details?.state;

  const initialQuestion = `Why would ${user.name} run for ${office} in ${
    district || ''
  } ${officeState || ''}`;

  const chat = [
    { type: 'question', text: initialQuestion },
    {
      type: 'answer',
      text: "I'm running for mayor because I want to help make our community better. I've worked for the chamber of commerce for 2 years and been a CFO for 10 years. I also volunteer at the local boys club. Some issues I care about are education, housing, and gun control. I want everyone to have a fair chance at a good education, a safe and affordable place to live, and to keep our community safe. Something interesting about me is that I like to weld. Please vote for me so that together we can make a difference in our community!",
    },
  ];

  return (
    <OnboardingWrapper {...props}>
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        {showIntro ? (
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
            <BlackButtonClient
              className="w-full mt-8"
              onClick={() => setShowInto(false)}
            >
              CONTINUE
            </BlackButtonClient>
          </div>
        ) : (
          <div className="max-w-[600px] mx-auto">
            {chat.map((item, index) => (
              <>
                <div className="flex items-start mb-4" key={index}>
                  {item.type === 'question' && (
                    <>
                      <UserAvatar user={user} />
                      <div className="ml-4 bg-gray-100 flex-1 p-3 rounded">
                        {item.text}
                      </div>
                    </>
                  )}
                  {item.type === 'answer' && (
                    <>
                      <div className="h-12 w-12 rounded-full shadow-md p-2 border-gray-200 border-2">
                        <div className="rounded-full relative h-full w-full">
                          <Image
                            src="/images/heart.svg"
                            alt="GP"
                            fill
                            className="object-contain object-center"
                          />
                        </div>
                      </div>
                      {index === chat.length - 1 ? (
                        <div className="ml-4 border-gray-200 border-2 rounded flex-1 px-3 py-5  leading-relaxed">
                          <Typewriter
                            options={{
                              delay: 10,
                            }}
                            onInit={(typewriter) => {
                              typewriter
                                .typeString(item.text)
                                .callFunction(() => {
                                  setShowButtons(true);
                                })

                                .start();
                            }}
                          />
                        </div>
                      ) : (
                        <div className="ml-4 border-gray-200 border-2 rounded flex-1 px-3 py-5  leading-relaxed">
                          {item.text}
                        </div>
                      )}
                    </>
                  )}
                </div>
                {showButtons &&
                  item.type === 'answer' &&
                  index === chat.length - 1 && ( // last item
                    <div className="ml-16">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4">
                          <BlackButtonClient className="w-full font-bold">
                            <div className="flex items-center justify-center">
                              <AiTwotoneTool />
                              <div className="mx-2">Enhance</div>
                            </div>
                          </BlackButtonClient>
                        </div>

                        <div className="col-span-4">
                          <BlackButtonClient className="w-full font-bold">
                            <div className="flex items-center justify-center">
                              <HiPencil />
                              <div className="mx-2">Edit</div>
                            </div>
                          </BlackButtonClient>
                        </div>

                        <div className="col-span-4">
                          <BlackButtonClient className="w-full font-bold">
                            <div className="flex items-center justify-center">
                              <BsSaveFill />
                              <div className="mx-2">Save</div>
                            </div>
                          </BlackButtonClient>
                        </div>
                      </div>
                    </div>
                  )}
              </>
            ))}
          </div>
        )}
      </form>
    </OnboardingWrapper>
  );
}
