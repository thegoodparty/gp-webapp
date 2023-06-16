'use client';
import { motion } from 'framer-motion';
import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import AiIcon from 'public/images/campaign/gp-ai.png';
import AdminDelete from './AdminDelete';
import { useEffect, useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { savingState } from './OnboardingPage';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Script from 'next/script';

export default function OnboardingWrapper({
  children,
  title,
  subTitle,
  pathname,
  icon,
  step,
  totalSteps,
  slug,
  section,
  subSectionLabel,
  fullWidth,
  noBg,
}) {
  const initProgress = (step - 2) / totalSteps;
  const [progress, setProgress] = useState(initProgress);

  const savingGlobalState = useHookstate(savingState);
  const saving = savingGlobalState.get();

  const breadcrumbsLinks = [
    { href: `/onboarding/${slug}/dashboard`, label: 'Dashboard' },
    {
      label: subSectionLabel,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setProgress((step - 1) / totalSteps);
    }, 500);
  }, [step, totalSteps]);

  return (
    <div
      className={`${
        !noBg && 'bg-white'
      } shadow-inner relative pt-10 lg:pt-0 pb-6 min-h-screen lg:min-h-[calc(100vh-56px)] `}
    >
      <div
        className="absolute h-1 bg-purple  top-0 rounded-r transition-all"
        style={{ width: `calc(100vw * ${progress})` }}
      ></div>
      <div className="relative mb-6 lg:mb-0 w-20 h-20  left-1/2 -ml-14 lg:absolute lg:-top-10 z-50">
        <div
          className="w-20 h-20 flex items-center justify-center border-4 border-zinc-300 rounded-full bg-white relative transition"
          style={progress >= 0.5 ? { borderColor: '#46002E' } : {}}
        >
          {icon ? (
            <> {icon} </>
          ) : (
            <Image
              src={AiIcon}
              alt="Good Party AI"
              priority
              className="mt-2"
              width={48}
              height={39}
            />
          )}
        </div>
      </div>
      <MaxWidth>
        {slug && <Breadcrumbs links={breadcrumbsLinks} withRefresh />}

        <div
          className={`${
            fullWidth ? '' : 'max-w-[680px]'
          } mx-auto pt-10 lg:pt-24`}
        >
          <div className="text-center  tracking-tight pb-14">
            <h1 className="font-black text-4xl ">{title}</h1>
            {subTitle && <h2 className="zinc-500 mt-8">{subTitle}</h2>}
          </div>
          {/* <AnimatePresence mode="wait"> */}
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{
              x: saving ? -300 : 0,
              opacity: saving ? 0 : 1,
            }}
            // exit={{ x: -300, opacity: 0 }}
            key={`${pathname} ${title}`}
          >
            {children}
          </motion.div>
          {pathname === '/details/1' && <AdminDelete />}
        </div>
      </MaxWidth>
      <Script
        type="text/javascript"
        id="hs-script-loader"
        strategy="afterInteractive"
        src="//js.hs-scripts.com/21589597.js"
      />
    </div>
  );
}
