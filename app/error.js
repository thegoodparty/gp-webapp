'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getUserCookie } from 'helpers/cookieHelper';
import Image from 'next/image';
import { useEffect } from 'react';

export async function sendError(message) {
  try {
    const api = gpApi.logError;
    const payload = {
      message,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at fetchCampaignStatus', e);
    return false;
  }
}

export default function Error({ error }) {
  useEffect(() => {
    logError();
  }, []);

  const logError = async () => {
    const user = getUserCookie(true);
    await sendError({
      message: error.message,
      url: window.location.href,
      userEmail: user?.email,
      userAgent: window?.navigator?.userAgent,
    });
  };
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-3 lg:px-5">
      <div className="grid grid-cols-12 gap-4 items-center justify-center">
        <div className="col-span-12 lg:col-span-6 ">
          <div className="relative h-[50vh]">
            <Image
              src="/images/error-pages/error-500.svg"
              data-cy="logo"
              fill
              className="object-contain object-center"
              alt="Error"
              priority
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <H1>Error: 500 server error</H1>
          <Body1 className="my-7">
            Something went wrong. Our engineers are blaming the
            two-party-system.
          </Body1>
          <a href="/">
            <PrimaryButton>Back to our homepage</PrimaryButton>
          </a>
          <div className="text-sm italic mt-12">{error?.message}</div>
        </div>
      </div>
    </div>
  );
}
