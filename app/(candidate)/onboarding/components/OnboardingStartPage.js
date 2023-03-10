'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import OnboardingWrapper from '../shared/OnboardingWrapper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getUserCookie, setCookie } from 'helpers/cookieHelper';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import Link from 'next/link';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

const inputFields = [
  {
    key: 'firstName',
    label: 'First Name',
    required: true,
    type: 'text',
    cols: 6,
  },
  {
    key: 'lastName',
    label: 'Last Name',
    required: true,
    type: 'text',
    cols: 6,
  },
  { key: 'email', label: 'Email', required: true, type: 'email', cols: 12 },
];

const initialState = {
  password: '',
  passwordConf: '',
};

inputFields.map((field) => {
  if (field.initialValue) {
    initialState[field.key] = field.initialValue;
  } else {
    initialState[field.key] = '';
  }
});

async function createCampaign() {
  try {
    const api = gpApi.campaign.onboarding.create;
    return await gpFetch(api);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export async function fetchUserCampaign() {
  try {
    const api = gpApi.campaign.onboarding.findByUser;
    return await gpFetch(api);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function OnboardingStartPage(props) {
  const user = getUserCookie(true);
  const router = useRouter();
  const snackbarState = useHookstate(globalSnackbarState);

  useEffect(() => {
    checkCampaigns();
  }, [user]);

  const checkCampaigns = async () => {
    if (user) {
      const { campaign } = await fetchUserCampaign();
      if (campaign) {
        const { slug } = campaign;
        router.push(`/onboarding/${slug}/details/1`);
      }
    }
  };

  const handleSubmit = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saving...',
        isError: false,
      };
    });

    const { slug } = await createCampaign();
    if (slug) {
      router.push(`/onboarding/${slug}/details/1`);
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error creating your campaign',
          isError: true,
        };
      });
    }
  };

  const setReturnCookie = () => {
    setCookie('returnUrl', '/onboarding');
  };

  return (
    <OnboardingWrapper {...props}>
      {!user ? (
        <div>
          <div className="font-black mt-12 mb-6 text-center">
            Please log in to your account before starting the onboarding
          </div>
          <Link href="/login" className="flex justify-center">
            <BlackButtonClient onClick={setReturnCookie}>
              <strong>Login</strong>
            </BlackButtonClient>
          </Link>
        </div>
      ) : (
        <div className="flex justify-center mt-10">
          <BlackButtonClient onClick={handleSubmit}>
            Create Campaign
          </BlackButtonClient>
        </div>
      )}
    </OnboardingWrapper>
  );
}
