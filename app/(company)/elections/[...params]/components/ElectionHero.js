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
          <div className="col-span-12 lg:col-span-6 lg:pl-20 max-w-2xl p-10">
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
              sizes="50vw"
              className="object-contain object-right-top"
              alt=""
              fill
              priority
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

        <div className="flex w-full h-full md:min-h-[500px]">
          {city === 'durham' && !showSignup ? (
            <div
              className="whitespace-nowrap pl-20"
              onClick={() => {
                setShowSignup(true);
              }}
            >
              <PrimaryButton size="large">Get Involved</PrimaryButton>
            </div>
          ) : (
            <></>
          )}
          {city === 'durham' && showSignup ? (
            <SignupForm
              formId="c7d78873-1ed0-4202-ab01-76577e57352c"
              pageName="durham"
              label="Get involved"
              labelId="volunteer-form"
            />
          ) : (
            <></>
          )}
        </div>
      </MaxWidth>

      {city === 'nashville' ? (
        <div className="bg-[linear-gradient(-172deg,_#EEF3F7_54.5%,_#13161A_55%)] h-[calc(100vw*.17)] w-full -mt-[calc(100vw*.17)]" />
      ) : (
        <div className="bg-[linear-gradient(172deg,_#EEF3F7_54.5%,_#13161A_55%)] h-[calc(100vw*.17)] w-full -mt-[calc(100vw*.17)]" />
      )}
    </>
  );
}
