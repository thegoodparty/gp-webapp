import React from 'react';
import MaxWidth from '../shared/layouts/MaxWidth';
import InvolvedModal from './InvolvedModal';

import styles from './WhatsNext.module.scss';

const WhatsNext = () => {
  return (
    <section className="bg-zinc-100">
      <MaxWidth>
        <div
          className={`bg-zinc-100 pt-9 px-9 pb-64 text-2xl relative bg-no-repeat bg-right-bottom lg:p-16 lg:text-3xl ${styles.banner}`}
          style={{ backgroundImage: 'url(/images/homepage/banner-bg-1.png)' }}
        >
          <h3 className="text-4xl font-black mb-10">So what&apos;s next?</h3>
          <InvolvedModal />
        </div>
      </MaxWidth>
    </section>
  );
};

export default WhatsNext;
