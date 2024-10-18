'use client';
import { useEffect, useState } from 'react';
import H1 from '@shared/typography/H1';
import Body1 from '@shared/typography/Body1';
import { getNewAiContentSectionKey } from 'helpers/getNewAiContentSectionKey';
import {
  AI_CONTENT_SUB_SECTION_KEY,
  buildAiContentSections,
} from 'helpers/buildAiContentSections';
import GearsAnimation from '@shared/animations/GearsAnimation';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { generateAIContent } from 'helpers/generateAIContent';
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { debounce } from 'helpers/debounceHelper';

export const GenerateLoadingScreen = ({
  campaign = {},
  aiTemplateKey = '',
  onNext = (aiScriptKey = '') => {},
}) => {
  const [aiContentSections] = buildAiContentSections(
    campaign,
    AI_CONTENT_SUB_SECTION_KEY,
  );
  const snackbarState = useHookstate(globalSnackbarState);
  const [generateTimeoutId, setGenerateTimeoutId] = useState(null);
  const [aiScriptKey, setAiScriptKey] = useState('');
  const [waiting, setWaiting] = useState(false);

  const fireError = () => {
    setGenerateTimeoutId(null);
    snackbarState.set(() => ({
      isOpen: true,
      message:
        'We are experiencing an issue creating your content. Please report an issue using the Feedback bar on the right.',
      isError: true,
    }));
  };

  const startTimeout = () => {
    setGenerateTimeoutId(
      setTimeout(() => {
        fireError();
      }, 1000 * 60 * 5),
    );
  };

  const generateContentPolling = async (aiScriptKey) => {
    const { campaign } = await getCampaign();
    const [_, jobsProcessing] = buildAiContentSections(
      campaign,
      AI_CONTENT_SUB_SECTION_KEY,
    );
    if (jobsProcessing) {
      return debounce(() => generateContentPolling(aiScriptKey), 1000 * 3);
    } else {
      clearTimeout(generateTimeoutId);
      setWaiting(false);
      console.log(`aiScriptKey =>`, aiScriptKey);
      onNext(aiScriptKey);
    }
  };

  useEffect(() => {
    const initiateContentGeneration = async (key) => {
      setWaiting(true);
      Boolean(!generateTimeoutId) && startTimeout();
      const { chatResponse, status } = await generateAIContent(key);
      console.log(`key =>`, key);
      setAiScriptKey(() => key);
      if (status === 'processing' && !chatResponse) {
        generateContentPolling(key);
      } else {
        setWaiting(false);
        fireError();
      }
    };
    if (aiTemplateKey && !waiting) {
      initiateContentGeneration(
        getNewAiContentSectionKey(aiContentSections, aiTemplateKey),
      );
    }
    return () => clearTimeout(generateTimeoutId);
  }, []);

  return (
    <>
      <header className="text-center">
        <H1>Generating Script</H1>
        <Body1 className="mt-4 mb-8">This may take a few minutes...</Body1>
      </header>
      <section>
        <GearsAnimation loop />
      </section>
    </>
  );
};
