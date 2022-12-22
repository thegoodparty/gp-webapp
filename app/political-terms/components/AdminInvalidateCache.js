'use client';

import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { getUserCookie } from 'helpers/cookieHelper';
import { revalidatePage } from 'helpers/cacheHelper';
import { alphabet } from './LayoutWithAlphabet';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

export default function AdminInvalidateCache() {
  const user = getUserCookie(true);
  const snackbarState = useHookstate(globalSnackbarState);

  if (!user || !user.isAdmin) {
    return null;
  }

  const handleInvalidate = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Invalidating letter pages',
        isError: false,
      };
    });
    alphabet.forEach(async (letter) => {
      await revalidatePage(`/political-terms/${letter}`);
    });
  };
  return (
    <div className="mt-4">
      <BlackButtonClient onClick={handleInvalidate}>
        <strong>(Admin) Invalidate Glossary Cache</strong>
      </BlackButtonClient>
    </div>
  );
}
