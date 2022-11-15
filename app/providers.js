'use client';
import { useEffect, useState } from 'react';
import createCache from '@emotion/cache';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import theme from '../styles/scss/theme';
import createEmotionCache from './shared/utils/createEmotionCache';

const clientSideEmotionCache = createEmotionCache();

export default function Providers({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
  children,
}) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
