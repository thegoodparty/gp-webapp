'use client';
import { useState } from 'react';
import { CopyToClipboard as CopyHelper } from 'react-copy-to-clipboard';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

export default function CopyToClipboard({ children, text }) {
  const snackbarState = useHookstate(globalSnackbarState);
  const onCopyHandler = () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Copied to clipboard',
        isError: false,
      };
    });
  };

  return (
    <div>
      <CopyHelper text={text} onCopy={onCopyHandler}>
        <div>{children}</div>
      </CopyHelper>
    </div>
  );
}
