'use client';
import { useState } from 'react';
import Image from 'next/image';
import MaxWidth from '@shared/layouts/MaxWidth';
import Link from 'next/link';
import WarningButton from '@shared/buttons/WarningButton';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import EmailForm from '@shared/inputs/EmailForm';
import SignupForm from '@shared/inputs/SignupForm';
import dynamic from 'next/dynamic';
const ScrollIntoView = dynamic(() => import('react-scroll-into-view'));

export default function ElectionHero(props) {
  const { content, city } = props;
  const [showSignup, setShowSignup] = useState(false);

  const {
    heroTitle,
    heroSubTitle,
    heroButton1text,
    heroButton1link,
    heroButton2text,
    heroButton2link,
    heroImage,
    skylineImage,
    isHeroButton1Scroll,
  } = content || {};

  return (
    <>
      <MaxWidth>
        <div className="grid grid-cols-12 gap-3 md:justify-items-center pt-10 bg-slate-50 items-stretch">
          <div className="col-span-12 lg:col-span-6 max-w-2xl pt-10 pl-5">
            {heroTitle?.length <= 45 ? (
              <h1 className="text-4xl md:text-6xl font-semibold">
                {heroTitle}
              </h1>
            ) : (
              <h1 className="text-2xl md:text-5xl font-semibold">
                {heroTitle}
              </h1>
            )}
            <h2 className="text-lg font-sfpro font-normal leading-6 mt-5 max-w-md">
              {heroSubTitle}
            </h2>
            <div className="flex flex-col md:flex-row">
              <div className="mt-4">
                {heroButton1text && (
                  <>
                    {isHeroButton1Scroll ? (
                      <ScrollIntoView selector="#candidate-section">
                        <PrimaryButton size="medium">
                          {heroButton1text}
                        </PrimaryButton>
                      </ScrollIntoView>
                    ) : (
                      <Link href={`${heroButton1link}`} id="candidates_tool">
                        <PrimaryButton size="medium">
                          {heroButton1text}
                        </PrimaryButton>
                      </Link>
                    )}
                  </>
                )}
              </div>
              <div className="mt-4 pl-0 md:pl-3">
                {heroButton2text && heroButton2link && (
                  <Link href={`${heroButton2link}`} id="candidates_academy">
                    <WarningButton size="medium">
                      {heroButton2text}
                    </WarningButton>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 relative w-full h-auto lg:pt-10 items-center md:mt-[100px]">
            <Image
              src={`https:${heroImage.url}`}
              className="w-full"
              alt=""
              priority
              width="643"
              height="395"
            />
          </div>
        </div>

        {skylineImage != null && skylineImage?.url != null && (
          <div className="flex flex-row">
            <div className="flex relative lg:w-full"></div>
            <div className="flex relative w-full h-[171px] md:h-[300px]">
              <Image
                src={`https:${skylineImage.url}`}
                sizes="50vw"
                className="object-cover object-right-top z-50"
                alt=""
                fill
                priority
              />
            </div>
          </div>
        )}

        {(city === 'durham' || city === 'nc') && !showSignup ? (
          <div className="w-full h-full min-h-[200px]">
            <div
              className="whitespace-nowrap pl-5"
              onClick={() => {
                setShowSignup(true);
              }}
            >
              <PrimaryButton size="large">Get Involved</PrimaryButton>
            </div>
          </div>
        ) : (
          <></>
        )}
        {(city === 'durham' || city === 'nc') && showSignup ? (
          <div className="w-full h-full min-h-[300px]">
            <SignupForm
              formId="c7d78873-1ed0-4202-ab01-76577e57352c"
              pageName={`elections/${city}`}
              label="Get involved"
              labelId={`${city}-form`}
            />
          </div>
        ) : (
          <></>
        )}
      </MaxWidth>

      {city === 'nashville' ? (
        <div className="bg-[linear-gradient(-172deg,_#F1FBA3_54.5%,_#0D1528_55%)] h-[calc(100vw*.17)] w-full -mt-[calc(100vw*.17)]" />
      ) : (
        <div className="bg-[linear-gradient(172deg,_#F1FBA3_54.5%,_#0D1528_55%)] h-[calc(100vw*.17)] w-full -mt-[calc(100vw*.17)]" />
      )}
    </>
  );
}
