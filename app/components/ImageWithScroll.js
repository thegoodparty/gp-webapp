'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import independenceImg from '/public/images/homepage/declare-independence.png';

import styles from './Hero.module.scss';

const ImageWithScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      let currentPosition = window.pageYOffset; // or use document.documentElement.scrollTop;

      setIsScrolled(currentPosition <= 0 ? false : true);
    }

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isScrolled]);
  return (
    <div className={`${isScrolled && 'back'} ${styles.lgImgWrapper}`}>
      <Image
        src={independenceImg}
        layout="fill"
        objectFit="cover"
        objectPosition="-100% 0"
        alt="Declare independence"
        priority
      />
    </div>
  );
};

export default ImageWithScroll;
