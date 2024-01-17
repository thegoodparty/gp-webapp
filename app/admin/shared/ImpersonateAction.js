'use client';
import { setCookie } from 'helpers/cookieHelper';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export default function ImpersonateAction({
  email,
  isCandidate,
  launched,
  slug,
}) {
  const snackbarState = useHookstate(globalSnackbarState);

  const impersonateUser = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Impersonating user',
        isError: false,
      };
    });

    const impersonateResp = await handleImpersonateUser(email);
    if (impersonateResp) {
      if (isCandidate) {
        if (launched == 'Live') {
          window.location.href = `/candidate/${slug}`;
        } else if (launched == 'Pending Review') {
          window.location.href = `/candidate/${slug}/review`;
        } else {
          window.location.href = `/onboarding/${slug}/1`;
        }
      } else {
        window.location.href = '/';
      }
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Impersonate failed',
          isError: true,
        };
      });
    }
  };

  return (
    <div className="my-3" onClick={impersonateUser}>
      <PrimaryButton size="small" fullWidth>
        <span className="whitespace-nowrap">Impersonate</span>
      </PrimaryButton>
    </div>
  );
}

async function handleImpersonateUser(email) {
  try {
    const api = gpApi.admin.impersonateUser;
    const payload = {
      email,
    };
    const resp = await gpFetch(api, payload);
    if (resp?.token && resp?.user) {
      setCookie('impersonateToken', resp.token);
      setCookie('impersonateUser', JSON.stringify(resp.user));
      return true;
    }
  } catch (e) {
    console.log('error', e);
  }
  return false;
}
