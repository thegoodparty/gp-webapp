import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import independenceImg from '/public/images/homepage/declare-independence.png';

import { getUserCookie } from '/helpers/cookieHelper';
import styles from './Hero.module.scss';
import SocialSection from './SocialSection';
import ImageWithScroll from './ImageWithScroll';

const Hero = () => {
  return (
    <div className="w-full h-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="col-span-2">
          <h1 className="text-5xl lg:text-7xl font-black inline-block relative mt-4 mb-3">
            Declare{' '}
            <span className="relative">
              <span className="relative z-10">Independence</span>{' '}
              <span className={styles.yellow} />
            </span>
            <br />
            from <span className="rep-red">Red</span> and{' '}
            <span className="dem-blue">Blue</span>
          </h1>
          <div className={`relative w-screen -mt-8 ${styles.smImgWrapper}`}>
            <Image src={independenceImg} alt="Declare independence" priority />
          </div>
          <div className="hidden lg:block">
            <SocialSection />
          </div>
        </div>
        <div>2</div>
      </div>
      {/* <Grid container spacing={0}>
        <Grid item xs={12} lg={8}>
          
          <SmImageWrapper>
            <Image
              src="/images/homepage/declare-independence.png"
              layout="fill"
              alt="Declare independence"
            />
          </SmImageWrapper>
          <RegisterWrapper>
            <LgUpOnly>
              <SocialSection />
            </LgUpOnly>
            {showRegister ? (
              <RegisterComboContainer />
            ) : (
              <Link href="/candidates" passHref>
                <a
                  className="no-underline"
                  style={{ margin: '24px 0', display: 'block' }}
                >
                  <YellowButton>
                    <InnerButton>Follow Candidates</InnerButton>
                  </YellowButton>
                </a>
              </Link>
            )}
          </RegisterWrapper>
          <GrayBg>
            <FullWidthGray />
            <Inner>
              <MdDownOnly>
                <SocialSection />
              </MdDownOnly>
              Good Party is <strong>not a political party</strong>, we are a
              platform for voters to find results-driven, independent and third
              party candidates from across the political spectrum.
            </Inner> 
          </GrayBg>
        </Grid>
        <Grid item xs={12} lg={4}></Grid>
            </Grid> */}
      <ImageWithScroll />
    </div>
  );
};

export default Hero;
