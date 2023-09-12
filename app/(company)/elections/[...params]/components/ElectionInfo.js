'use client';
import Image from 'next/image';
import MaxWidth from '@shared/layouts/MaxWidth';
import { LuRefreshCw } from 'react-icons/lu';
import { useState } from 'react';

// import CandidatePill from '/app/candidate/[slug]/components/CandidatePill';

export default function ElectionInfo(props) {
  let [card1Flipped, setCard1Flipped] = useState(false);
  let [card2Flipped, setCard2Flipped] = useState(false);

  const { city } = props;

  return (
    <>
      <MaxWidth>
        <div className="grid grid-cols-12 md:justify-items-center pt-10 bg-slate-50">
          <div className="col-span-12 lg:col-span-6 p-10 w-full">
            <div
              className="flex flex-col w-full h-[420px] bg-yellow-500 rounded-2xl"
              onClick={() => {
                setCard1Flipped(!card1Flipped);
              }}
            >
              <div className="flex flex-col items-end w-full">
                <LuRefreshCw className="mr-5 mt-5 text-[27px]" />
              </div>

              {card1Flipped ? (
                <div className="flex flex-col items-center text-center pt-5 w-full font-sfpro font-normal text[14px] leading-[24px] p-10">
                  We&apos;re not a political party, but are seeking to replace
                  the corrupt and ineffective two-party system with
                  people-powered, independent candidates. Candidates earn the
                  Good Party Certified label when they take our pledge, in which
                  candidates agree to not run as Republicans or Democrats, raise
                  a majority of their funding from real people instead of
                  corporate lobbyists, and propose real solutions in the
                  interest of their communities, not hate or partisanship.
                  <br />
                  <br />
                  We believe candidates who check these boxes put all levels of
                  government on track by rejecting dark money influences and
                  putting power back in the hands of the people.
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center text-center pt-5 w-full">
                    <Image
                      src="/images/heart.svg"
                      alt="GoodParty"
                      width={46}
                      height={46}
                    />

                    <div className="text-[32px] leading-[40px] font-normal max-w-sm p-5 pb-20">
                      What makes a candidate Good Party Certified?
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 p-10 w-full">
            <div
              className="flex flex-col w-full h-[420px] bg-lime-600 rounded-2xl"
              onClick={() => {
                setCard2Flipped(!card2Flipped);
              }}
            >
              <div className="flex flex-col items-end w-full">
                <LuRefreshCw className="mr-5 mt-5 text-[27px]" />
              </div>

              {card2Flipped ? (
                <div className="flex flex-col items-center text-center pt-5 w-full font-sfpro font-normal text[14px] leading-[24px] p-10">
                  Good Party is focused on helping candidates in North Carolina
                  because it is one of the most independent states in the
                  country. 36% of voters in the state identify with neither
                  major political party, and 46% of those voters are under the
                  age of 40. This means that the fastest-growing voting
                  population of the state is young voters without
                  representation! It also makes North Carolina an important
                  proving ground for our movement to elect new options other
                  than Red and Blue.
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center text-center pt-5 w-full">
                    <Image
                      src="/images/heart.svg"
                      alt="GoodParty"
                      width={46}
                      height={46}
                    />

                    <div className="text-[32px] leading-[40px] font-normal max-w-sm p-5 pb-40">
                      Why North Carolina ?
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </MaxWidth>
    </>
  );
}
