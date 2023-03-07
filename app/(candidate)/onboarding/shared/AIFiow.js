'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import RenderInputField from 'app/(candidate)/onboarding/components/RenderInputField';
import { useEffect, useState } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { getUserCookie } from 'helpers/cookieHelper';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { hookstate } from '@hookstate/core';
import Typewriter from 'typewriter-effect';
import ReactLoading from 'react-loading';

import { BsSaveFill } from 'react-icons/bs';
import { HiPencil } from 'react-icons/hi';
import { AiTwotoneTool } from 'react-icons/ai';
import UserAvatar from '@shared/user/UserAvatar';
import Image from 'next/image';
import AIFlowIntro from './AIFiowIntro';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

async function generateAI(subSectionKey, key) {
  try {
    const api = gpApi.campaign.onboarding.ai.create;
    return await gpFetch(api, { subSectionKey, key });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}
let calledInitial = false;

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

  const user = getUserCookie(true);

  const { office, district } = campaign.details || {};
  const officeState = campaign.details?.state;

  const initialQuestion = `Why would ${user.name} run for ${office} in ${
    district || ''
  } ${officeState || ''}`;

  const [chat, setChat] = useState([
    { type: 'question', text: initialQuestion },
  ]);

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
  useEffect(() => {
    if (!calledInitial) {
      calledInitial = true;
      generateInitialAI();
    }
  }, []);

  const generateInitialAI = async () => {
    const { chatResponse } = await generateAI(subSectionKey, key);
    const newChat = chat;
    newChat.push({ type: 'answer', text: chatResponse });
    setChat(newChat);
    setLoading(false);
  };

  return (
    <OnboardingWrapper {...props}>
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        {showIntro ? (
          <AIFlowIntro nextCallback={() => setShowInto(false)} />
        ) : (
          <div className="max-w-[600px] mx-auto">
            {chat &&
              chat.map((item, index) => (
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
                  <div>
                    {loading && (
                      <div className="flex items-start mb-4">
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
                        <div className="ml-4 border-gray-200 border-2 rounded flex-1 px-3 py-5  leading-relaxed">
                          <div className="flex flex-col  items-center">
                            <ReactLoading
                              color="black"
                              type="spinningBubbles"
                            />
                            <div className="mt-2">Loading...</div>
                          </div>
                        </div>
                      </div>
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
