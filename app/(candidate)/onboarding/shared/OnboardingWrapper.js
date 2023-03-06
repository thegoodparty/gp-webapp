'use client';
import { motion } from 'framer-motion';
import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import JaredImg from 'public/images/campaign/jared.jpg';
import AdminDelete from './AdminDelete';
import { useEffect, useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { savingState } from './OnboardingPage';
import Breadcrumbs from '@shared/utils/Breadcrumbs';

export default function OnboardingWrapper({
  children,
  title,
  subTitle,
  self,
  pathname,
  icon,
  step,
  totalSteps,
  slug,
  section,
  subSectionLabel,
}) {
  const initProgress = (step - 2) / totalSteps;
  const [progress, setProgress] = useState(initProgress);

  const savingGlobalState = useHookstate(savingState);
  const saving = savingGlobalState.get();

  const breadcrumbsLinks = [
    { href: `/onboarding/${slug}/dashboard`, label: 'Dashboard' },
    {
      href: `/onboarding/${slug}/dashboard/${section?.index}`,
      label: section?.label,
    },
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
    <div className="bg-white shadow-inner relative pt-10 lg:pt-0">
      <div
        className="absolute h-1 bg-purple  top-0 rounded-r transition-all"
        style={{ width: `calc(100vw * ${progress})` }}
      ></div>
      <div className="relative mb-6 lg:mb-0 w-28 h-28  left-1/2 -ml-14 lg:absolute lg:-top-14 z-50">
        <div
          className="w-28 h-28 flex items-center justify-center border-4 border-zinc-300 rounded-full bg-white relative transition"
          style={progress >= 0.5 ? { borderColor: '#46002E' } : {}}
        >
          {icon ? (
            <> {icon} </>
          ) : (
            <Image
              src={JaredImg}
              fill
              alt="Jared"
              priority
              className="object-contain rounded-full"
            />
          )}
        </div>
      </div>

      <MaxWidth>
        <Breadcrumbs links={breadcrumbsLinks} />

        <div className="max-w-[680px] mx-auto min-h-screen lg:min-h-[calc(100vh-80px)] pt-10 lg:pt-24">
          <div className="text-center  tracking-tight pb-14">
            <h1 className="font-black text-4xl ">{title}</h1>
            {subTitle && <h2 className="zinc-500 mt-8">{subTitle}</h2>}
          </div>
          {/* <AnimatePresence mode="wait"> */}
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: saving ? -300 : 0, opacity: saving ? 0 : 1 }}
            // exit={{ x: -300, opacity: 0 }}
            key={`${pathname} ${title}`}
          >
            {children}
          </motion.div>
          {/* </AnimatePresence> */}
          {self !== '/onboarding' && <AdminDelete />}
        </div>
      </MaxWidth>
    </div>
  );
}
