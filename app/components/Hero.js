import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import independenceImg from '/public/images/homepage/declare-independence.png';

import styles from './Hero.module.scss';
import SocialSection from './SocialSection';
import ImageWithScroll from './ImageWithScroll';
import FollowOrRegister from './FollowOrRegister';

const Hero = () => {
  return (
    <div className="w-full h-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="col-span-2">
          <h1 className="text-5xl lg:text-7xl font-black inline-block relative mt-4 mb-3">
            Declare{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Independence</span>{' '}
              <span className={styles.yellow} />
            </span>
            <br />
            from <span className="rep-red">Red</span> and{' '}
            <span className="dem-blue">Blue</span>
          </h1>
          <div className={`relative w-screen -mt-8 ${styles.smImgWrapper}`}>
            <Image
              src={independenceImg}
              alt="Declare independence"
              priority
              placeholder="blur"
            />
          </div>
          <div className="lg:inline-block">
            <div className="hidden lg:block">
              <SocialSection />
            </div>
            <FollowOrRegister />
          </div>
          <div className="py-5 relative mb-10 mt-9 bg-zinc-100 lg:mt-14 lg:py-10 lg:mb-0">
            <div
              className="absolute top-0 h-full bg-zinc-100"
              style={{ left: '-100vw', width: '200vw', zIndex: '9' }}
            />
            <div className="relative z-10 text-lg lg:text-3xl leading-6 lg:leading-9">
              <div className="lg:hidden">
                <SocialSection />
              </div>
              Good Party is <strong>not a political party</strong>, we are a
              platform for voters to find results-driven, independent and third
              party candidates from across the political spectrum.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.lgImgWrapper} id="homepage-scroll-image">
        <Image
          src={independenceImg}
          fill
          alt="Declare independence"
          priority
          placeholder="blur"
          className="object-cover"
          style={{ objectPosition: '-100% 0' }}
        />
      </div>
      <ImageWithScroll />
    </div>
  );
};

export default Hero;
