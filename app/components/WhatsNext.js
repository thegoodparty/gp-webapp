import React from 'react';
import Image from 'next/image';

import bgImage from '/public/images/homepage/banner-bg-1.png';

import MaxWidth from '@shared/layouts/MaxWidth';
import InvolvedModal from './InvolvedModal';

import styles from './WhatsNext.module.scss';

const WhatsNext = () => {
  return (
    <section className="bg-zinc-100">
      <MaxWidth>
        <div className="grid grid-reverse grid-cols-1 lg:grid-cols-2">
          <div className="p-9 text-2xl relative bg-no-repeat bg-right-bottom lg:p-16 lg:text-3xl">
            <h3 className="text-4xl font-black mb-10">So what&apos;s next?</h3>
            <InvolvedModal />
          </div>
          <div>
            <Image src={bgImage} style={{ width: 'auto' }} alt="party" />
          </div>
        </div>
      </MaxWidth>
    </section>
  );
};

export default WhatsNext;
