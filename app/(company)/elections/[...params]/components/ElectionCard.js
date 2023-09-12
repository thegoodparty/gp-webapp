'use client';
import Image from 'next/image';
import MaxWidth from '@shared/layouts/MaxWidth';
import { LuRefreshCw } from 'react-icons/lu';
import { useState } from 'react';

import styles from './ElectionCard.module.scss';
import H2 from '@shared/typography/H2';
import Body1 from '@shared/typography/Body1';

export default function ElectionCard(props) {
  let [flipped, setFlipped] = useState(false);

  const { title, content, bgColor } = props;

  return (
    <div
      className={`${bgColor} rounded-2xl cursor-pointer  min-h-[400px] ${
        styles.card
      } ${flipped ? 'selected' : 'not-selected'}`}
    >
      <div className={`relative w-full h-full card-inner ${styles.inner}`}>
        <div
          className={`absolute w-full h-full flex flex-col justify-center items-center min-h-[400px] p-12  ${styles.front}`}
          onClick={() => {
            setFlipped(true);
          }}
        >
          <div className="absolute right-6 top-6">
            <LuRefreshCw size={24} />
          </div>

          <Image
            src="/images/heart-hologram.svg"
            alt="GoodParty"
            width={46}
            height={46}
          />
          <H2 className="mt-4 text-center">{title}</H2>
        </div>
        <div
          className={`absolute top-0  w-full h-full ${styles.back} min-h-[400px] p-12 `}
          onClick={() => {
            setFlipped(false);
          }}
        >
          <div className="lg:flex lg:items-center h-full">
            <Body1>{content}</Body1>
          </div>
        </div>
      </div>
      <div className="hide">
        <div className="p-12">
          <Body1>{content}</Body1>
        </div>
      </div>
    </div>
  );
}
