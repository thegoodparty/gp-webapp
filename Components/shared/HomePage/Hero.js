'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { getUserCookie } from '/helpers/cookieHelper';

// import styled from 'styled-components';
// import Grid from '@material-ui/core/Grid';
// import SocialSection from './SocialSection';
// import RegisterComboContainer from '../../containers/shared/RegisterComboContainer';
// import { LgUpOnly, MdDownOnly } from '../shared/navigation/NavWrapper';
// import YellowButton from '../shared/buttons/YellowButton';
// import { InnerButton } from '../shared/buttons/BlackButton';

// const H1 = styled.h1`
//   margin: 16px 0 12px;
//   font-weight: 900;
//   font-size: 46px;
//   line-height: 60px;
//   display: inline-block;
//   position: relative;
//   @media only screen and (min-width: ${({ theme }) =>
//       theme.breakpointsPixels.lg}) {
//     font-size: 74px;
//     line-height: 84px;
//   }

//   .yellow {
//     position: absolute;
//     height: 18px;
//     width: calc(100% + 10px);
//     bottom: 0;
//     left: -5px;
//     background-color: ${({ theme }) => theme.colors.yellow};
//     @media only screen and (min-width: ${({ theme }) =>
//         theme.breakpointsPixels.lg}) {
//       height: 30px;
//       width: calc(100% + 16px);
//       left: -8px;
//     }
//   }

//   .top {
//     position: relative;
//     z-index: 10;
//   }
// `;

// const Wrapper = styled.div`
//   position: relative;
//   height: 100%;
//   width: 100%;
// `;

// const ImgWrapper = styled.div`
//   display: none;

//   @media only screen and (min-width: ${({ theme }) =>
//       theme.breakpointsPixels.lg}) {
//     display: block;
//     position: absolute;
//     height: calc(100% + 40px);
//     z-index: 100;

//     width: 50%;
//     left: 67%;
//     top: -40px;
//     pointer-events: none;

//     &.back {
//       z-index: 10;
//     }
//   }
// `;

// const GrayBg = styled.div`
//   background-color: #f3f3f3;
//   padding: 20px 0;
//   position: relative;
//   margin-bottom: 40px;
//   margin-top: 36px;
//   @media only screen and (min-width: ${({ theme }) =>
//       theme.breakpointsPixels.lg}) {
//     margin-top: 56px;
//     padding: 40px 0;
//     margin-bottom: 0;
//   }
// `;

// const FullWidthGray = styled.div`
//   position: absolute;
//   top: 0;
//   left: -100vw;
//   width: 200vw;
//   height: 100%;
//   z-index: 9;
//   background-color: #f3f3f3;
// `;

// const Inner = styled.div`
//   position: relative;
//   z-index: 10;
//   font-size: 17px;
//   line-height: 25px;

//   @media only screen and (min-width: ${({ theme }) =>
//       theme.breakpointsPixels.lg}) {
//     font-size: 26px;
//     line-height: 36px;
//   }
// `;

// const SmImageWrapper = styled.div`
//   height: 500px;
//   width: 100vw;
//   position: relative;
//   margin: -30px 0 0;

//   img {
//     object-fit: cover;
//     object-position: top center;
//   }

//   @media only screen and (min-width: ${({ theme }) =>
//       theme.breakpointsPixels.md}) {
//     height: 700px;
//   }

//   @media only screen and (min-width: ${({ theme }) =>
//       theme.breakpointsPixels.lg}) {
//     display: none;
//   }
// `;

// const RegisterWrapper = styled.div`
//   @media only screen and (min-width: ${({ theme }) =>
//       theme.breakpointsPixels.lg}) {
//     display: inline-block;
//   }
// `;

// const Candidates = styled.div`
//   font-size: 24px;
// `;

const Hero = () => {
  const [showRegister, setShowRegister] = useState(true);
  useEffect(() => {
    const user = getUserCookie();
    if (user) {
      setShowRegister(false);
    }
  }, []);

  // const [scrolling, setScrolling] = useState(false);
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
    <div className="w-full h-full relative">
      <div className="grid gri-cols1 lg:grid-cols3">
        <div className="col-span-2">
          <h1 className="text-5xl lg:text-7xl font-black inline-block relative mt-4 mb-3">
            Declare{' '}
            <span className="relative">
              <span className="top">Independence</span>{' '}
              <span className="yellow" />
            </span>
            <br />
            from <span className="red">Red</span> and{' '}
            <span className="blue">Blue</span>
          </h1>
          <div style={{ height: '500px' }} className="w-screen -mt-8"></div>
          <Image
            src="/images/homepage/declare-independence.png"
            layout="fill"
            alt="Declare independence"
          />
        </div>
        <div className="">empty</div>
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
      </Grid>

      <ImgWrapper className={isScrolled && 'back'}>
        <Image
          src={`/images/homepage/declare-independence.png`}
          layout="fill"
          objectFit="cover"
          objectPosition="-100% 0"
          priority
        />
      </ImgWrapper>
    </Wrapper> */}
    </div>
  );
};

export default Hero;
