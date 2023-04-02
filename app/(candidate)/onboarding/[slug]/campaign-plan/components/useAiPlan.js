'use client';
import { useEffect, useState } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

async function generateAI(subSectionKey, key, regenerate, chat, editMode) {
  try {
    const api = gpApi.campaign.onboarding.ai.create;
    return await gpFetch(api, {
      subSectionKey,
      key,
      regenerate,
      chat,
      editMode,
    });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

let aiCount = 0;
let aiTotalCount = 0;

export default function useAiPlan(campaign, subSectionKey, key) {
  const [plan, setPlan] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTyped, setIsTyped] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const { campaignPlan } = campaign;

  useEffect(() => {
    if (!campaignPlan || !campaignPlan[key]) {
      createInitialAI();
    } else {
      setPlan(campaignPlan[key]);
      setLoading(false);
      setIsTyped(true);
    }
  }, [campaignPlan]);

  const createInitialAI = async (regenerate, chat, editMode) => {
    aiCount++;
    aiTotalCount++;
    if (aiTotalCount >= 100) {
      //fail
      setPlan(
        'Failed to generate a campaign plan. Please contact us for help.',
      );
      setLoading(false);
      setIsFailed(true);
      return;
    }
    const { chatResponse, status } = await generateAI(
      subSectionKey,
      key,
      regenerate,
      chat,
      editMode,
    );
    if (!chatResponse && status === 'processing') {
      if (aiCount < 20) {
        setTimeout(async () => {
          await createInitialAI();
        }, 5000);
      } else {
        //something went wrong, we are stuck in a loop. reCreate the response
        console.log('regenerating');
        aiCount = 0;
        createInitialAI(true);
      }
    } else {
      aiCount = 0;
      setPlan(chatResponse);
      setLoading(false);
    }
  };

  return { plan, loading, isFailed, isTyped };
}
