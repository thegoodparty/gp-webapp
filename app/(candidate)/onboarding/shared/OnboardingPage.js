'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { Fragment, useEffect, useState } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { getUserCookie } from 'helpers/cookieHelper';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { hookstate } from '@hookstate/core';
import ArticlesSnippets from '../[slug]/details/[step]/components/ArticlesSnippets';
import RenderInputField from './RenderInputField';
import Modal from '@shared/utils/Modal';
import { FaExclamationCircle } from 'react-icons/fa';
import Pill from '@shared/buttons/Pill';

export const savingState = hookstate(false);

export default function OnboardingPage({
  inputFields,
  campaign,
  subSectionKey,
  reGenerateAiCallback,
  nextPath,
  nextPathFunc,
  slug,
  skipable,
  skipLabel,
  step,
  ...props
}) {
  useEffect(() => {
    savingState.set(() => false);
  }, []);
  const initialState = {};
  const keys = [];

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

  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const router = useRouter();
  const user = getUserCookie(true);
  const [loading, setLoading] = useState(false);

  const canSave = () => {
    for (let i = 0; i < inputFields.length; i++) {
      const field = inputFields[i];
      if (field.required) {
        // if (field.initialValue && state[field.key] === field.initialValue) {
        //   return false;
        // }

        if (!field.initialValue && state[field.key] === '') {
          return false;
        }
        if (field.validate) {
          return field.validate(state[field.key]);
        }
      }
    }
    return true;
  };

  const handleSave = async (skipped = false) => {
    setLoading(true);
    const updated = campaign;
    if (!updated[subSectionKey]) {
      updated[subSectionKey] = {};
    }
    keys.forEach((key) => {
      updated[subSectionKey][key] = skipped ? ' ' : state[key];
    });
    await updateCampaign(updated);
    let path = nextPath;
    if (!path && nextPathFunc) {
      path = nextPathFunc({ ...state });
    }
    savingState.set(() => true);

    setTimeout(() => {
      router.push(`onboarding/${slug}${path}`);
    }, 200);
  };

  const handleSkip = async () => {
    await handleSave(true);
  };

  const onChangeField = (key, value, invalidOptions) => {
    if (invalidOptions && invalidOptions.includes(value)) {
      setShowInvalidModal(true);
    } else {
      setState({
        ...state,
        [key]: value,
      });
    }
  };

  const handleRegenerateAi = async () => {
    setLoading(true);
    await reGenerateAiCallback();
    window.location.reload();
  };

  const canShowField = (field) => {
    const { showKey, showCondition } = field;
    return showCondition.includes(state[showKey]);
  };

  return (
    <OnboardingWrapper {...props} slug={slug} step={step}>
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <div className="max-w-[460px] mx-auto">
          <div className="grid grid-cols-12 gap-4">
            {inputFields.map((field) => (
              <Fragment key={field.key}>
                {(!field.hidden || canShowField(field)) && (
                  <>
                    {field.type === 'articles' ? (
                      <ArticlesSnippets
                        articles={props.articles}
                        field={field}
                      />
                    ) : (
                      <>
                        <RenderInputField
                          field={field}
                          onChangeCallback={onChangeField}
                          error={!!errors[field.key]}
                          positions={props.positions}
                          value={state[field.key]}
                        />
                      </>
                    )}
                  </>
                )}
              </Fragment>
            ))}
          </div>

          <div className="flex justify-center">
            {user?.isAdmin && reGenerateAiCallback && (
              <div className="mr-6">
                <BlackButtonClient
                  onClick={handleRegenerateAi}
                  style={{ backgroundColor: 'blue' }}
                >
                  <div className="font-black">Regenerate AI input (Admin)</div>
                </BlackButtonClient>
              </div>
            )}

            <BlackButtonClient
              onClick={() => handleSave(false)}
              disabled={!canSave()}
              type="submit"
            >
              <div className="font-bold">NEXT</div>
            </BlackButtonClient>
          </div>
          {skipable && (
            <div
              className="text-center mt-4 underline cursor-pointer"
              onClick={handleSkip}
            >
              {skipLabel || 'Skip for now'}
            </div>
          )}
        </div>
      </form>
      {showInvalidModal && (
        <Modal open closeCallback={() => setShowInvalidModal(false)}>
          <div className="flex text-2xl items-center text-black max-w-xs">
            <FaExclamationCircle className="text-red-600 mr-3" />
            <div>Please note:</div>
          </div>
          <div className="my-5 text-lg">
            We currently only support candidates
            <br />
            outside of the Two Party system.
          </div>
          <div
            className="text-center"
            onClick={() => setShowInvalidModal(false)}
          >
            <Pill className=" bg-yellow-400 border-yellow-400 ">
              <div className="px-6 text-black tracking-wide">GOT IT</div>
            </Pill>
          </div>
        </Modal>
      )}
    </OnboardingWrapper>
  );
}
