'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useEffect } from 'react';

export const track = async (url, data) => {
  const api = gpApi.candidate.trackVisit;
  const payload = {
    url,
    data,
  };

  return gpFetch(api, payload, 3600);
};

export default function TrackVisit() {
  useEffect(() => {
    const width = window.innerWidth || document.body.clientWidth;
    const height = window.innerHeight || document.body.clientHeight;
    track(
      window.location.pathname,
      JSON.stringify({
        width,
        height,
        url: window.location.pathname,
      }),
    );
  }, []);

  return <></>;
}
