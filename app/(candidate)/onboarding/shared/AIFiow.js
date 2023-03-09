'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { useEffect, useState } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { getUserCookie } from 'helpers/cookieHelper';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import Typewriter from 'typewriter-effect';
import ReactLoading from 'react-loading';

import { BsSaveFill, BsFillQuestionCircleFill } from 'react-icons/bs';
import { HiPencil } from 'react-icons/hi';
import { GiFairyWand } from 'react-icons/gi';
import { FaRedoAlt } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import UserAvatar from '@shared/user/UserAvatar';
import Image from 'next/image';
import AIFlowIntro from './AIFiowIntro';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import TextField from '@shared/inputs/TextField';
import { InputAdornment } from '@mui/material';
import { savingState } from './OnboardingPage';

async function generateAI(subSectionKey, key, regenerate) {
  try {
    const api = gpApi.campaign.onboarding.ai.create;
    return await gpFetch(api, { subSectionKey, key, regenerate });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

async function enhanceAI(subSectionKey, key, prompt) {
  try {
    const api = gpApi.campaign.onboarding.ai.edit;
    return await gpFetch(api, { subSectionKey, key, chat: prompt });
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
  useEffect(() => {
    savingState.set(() => false);
  }, []);
  const { key, withIntro } = inputFields[0];

  const keys = [];
  // savingState.set(() => false);

  const user = getUserCookie(true);

  const { office, district } = campaign.details || {};
  const officeState = campaign.details?.state;

  const initialQuestion =
    inputFields[0].initialQuestion ||
    `Why would ${user.name} run for ${office} in ${district || ''} ${
      officeState || ''
    }`;

  const [chat, setChat] = useState([
    { type: 'question', text: initialQuestion },
  ]);

  if (campaign?.[subSectionKey]) {
    keys.forEach((key) => {
      if (campaign[subSectionKey][key]) {
        initialState[key] = campaign[subSectionKey][key];
      }
    });
  }

  const [state, setState] = useState({
    loading: false,
    showIntro: withIntro,
    showButtons: false,
    editMode: false,
    enhanceMode: false,
    enhanceText: '',
    finalText: '',
  });
  const router = useRouter();

  const handleSave = async () => {
    const updated = campaign;
    if (!updated[subSectionKey]) {
      updated[subSectionKey] = {};
    }

    updated[subSectionKey][key] = state.finalText;
    await updateCampaign(updated);
    let path = nextPath;

    savingState.set(() => true);

    setTimeout(() => {
      router.push(`onboarding/${campaign.slug}${path}`);
    }, 200);
  };

  // const onChangeField = (key, value) => {
  //   setState({
  //     ...state,
  //     [key]: value,
  //   });
  // };

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

  const generateInitialAI = async (regenerate = false) => {
    let newChat = chat;
    if (regenerate) {
      newChat = [{ type: 'question', text: initialQuestion }];
      setChat(newChat);
    }
    const { chatResponse } = await generateAI(subSectionKey, key, regenerate);

    newChat.push({ type: 'answer', text: chatResponse });
    setChat(newChat);
    setState({
      ...state,
      finalText: chatResponse,
      loading: false,
    });
  };

  const handleRegenerate = async () => {
    setState({
      ...state,
      editMode: false,
      loading: true,
    });
    generateInitialAI(true);
  };

  const handleEnhance = async () => {
    setState({
      ...state,
      enhanceMode: false,
      loading: true,
    });
    let newChat = chat;
    newChat.push({ type: 'question', text: state.enhanceText });
    const prompt = [
      { role: 'assistant', content: state.finalText },
      { role: 'user', content: state.enhanceText },
    ];

    const { chatResponse } = await enhanceAI(subSectionKey, key, prompt);

    newChat.push({ type: 'answer', text: chatResponse });

    setChat(newChat);

    setState({
      ...state,
      finalText: chatResponse,
      loading: false,
    });
  };

  return (
    <OnboardingWrapper {...props}>
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        {state.showIntro ? (
          <AIFlowIntro
            nextCallback={() => {
              onChangeField('showIntro', false);
              if (typeof window !== 'undefined') {
                window.scroll(0, 0);
              }
            }}
          />
        ) : (
          <div className="max-w-[600px] mx-auto">
            {chat &&
              chat.map((item, index) => (
                <>
                  <div className="flex items-start mb-4" key={index}>
                    {item.type === 'question' && (
                      <>
                        {index === 0 ? (
                          <div className="h-12 w-12 rounded-full shadow-md mr-4">
                            <BsFillQuestionCircleFill className="h-12 w-12" />
                          </div>
                        ) : (
                          <div className="mr-4">
                            <UserAvatar user={user} />
                          </div>
                        )}
                        <div className=" bg-gray-100 flex-1 p-3 rounded">
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
                          <div className="ml-4 flex-1 mb-4  leading-relaxed">
                            {state.editMode ? (
                              <TextField
                                multiline
                                rows={20}
                                value={state.finalText}
                                className="w-full"
                                onChange={(e) =>
                                  onChangeField('finalText', e.target.value)
                                }
                              />
                            ) : (
                              <div className=" border-gray-200 border-2 rounded flex-1 px-3 py-5  leading-relaxed">
                                <Typewriter
                                  options={{
                                    delay: 1,
                                  }}
                                  onInit={(typewriter) => {
                                    typewriter
                                      .typeString(item.text)
                                      .callFunction(() => {
                                        onChangeField('showButtons', true);
                                      })

                                      .start();
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="ml-4 border-gray-200 border-2 rounded flex-1 px-3 py-5  leading-relaxed">
                            {item.text}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {(state.showButtons || state.editMode) &&
                    item.type === 'answer' &&
                    index === chat.length - 1 && ( // last item
                      <div className="ml-16">
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-6">
                            <BlackButtonClient
                              className="w-full font-bold"
                              onClick={() => onChangeField('enhanceMode', true)}
                            >
                              <div className="flex items-center justify-center">
                                <GiFairyWand />
                                <div className="mx-2">Enhance</div>
                              </div>
                            </BlackButtonClient>
                          </div>
                          <div className="col-span-6">
                            <BlackButtonClient
                              className="w-full font-bold"
                              onClick={handleRegenerate}
                            >
                              <div className="flex items-center justify-center">
                                <FaRedoAlt />
                                <div className="mx-2">Regenerate</div>
                              </div>
                            </BlackButtonClient>
                          </div>

                          <div className="col-span-6">
                            <BlackButtonClient
                              className="w-full font-bold"
                              onClick={() =>
                                onChangeField('editMode', !state.editMode)
                              }
                            >
                              <div className="flex items-center justify-center">
                                <HiPencil />
                                <div className="mx-2">
                                  {state.editMode ? 'End ' : ''}Edit
                                </div>
                              </div>
                            </BlackButtonClient>
                          </div>

                          <div className="col-span-6" onClick={handleSave}>
                            <BlackButtonClient className="w-full font-bold bg-green-500">
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
            <div>
              {state.loading && (
                <div className="flex items-start my-4">
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
                      <ReactLoading color="black" type="spinningBubbles" />
                      <div className="mt-2">Loading...</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {state.enhanceMode && (
              <div className="mt-16 ml-10">
                <div className="mb-6 font-bold">
                  Ask the Good Party AI to Add, Remove, Enhance something about
                  why you want to run for office.
                </div>

                <TextField
                  label="What do you want to change about the response?"
                  className="w-full"
                  onChange={(e) => {
                    onChangeField('enhanceText', e.target.value);
                  }}
                  value={state.enhanceText}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" onClick={handleEnhance}>
                        <div className="mr-2 bg-black rounded-full h-9 w-9 flex items-center justify-center cursor-pointer text-white">
                          <FiSend />
                        </div>
                      </InputAdornment>
                    ),
                  }}
                />
                <div className="mt-6 font-bold">
                  Examples of what to ask the Good Party AI to enhance
                </div>
                <ul>
                  <li>
                    Highlight my experience as a former city council member and
                    passion for the working class
                  </li>
                  <li>
                    Make my WHY statement sound more formal / more like Ryan
                    Reynolds
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </form>
    </OnboardingWrapper>
  );
}
