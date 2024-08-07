'use client';
import Link from 'next/link';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { IoIosCloseCircle } from 'react-icons/io';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function StickersCallout() {
  const [showCallout, setShowCallout] = useState(true);

  useEffect(() => {
    try {
      const callout = localStorage.getItem('sticker-callout');
      if (callout) {
        setShowCallout(false);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    showCallout && (
      <div className="flex w-screen h-auto">
        <div className="flex w-full bg-lime-400 lg:block border-solid border-b border-zinc-200 p-2 h-full">
          <div className="flex w-full h-14">
            <div className="flex w-full justify-center items-center ">
              <div className="flex items-center md:text-lg">
                <span>Get</span>

                <Image
                  className="mx-2 mt-0.5"
                  src="/images/logo-hologram-white.svg"
                  data-cy="logo"
                  width={24}
                  height={20}
                  alt="GoodParty.org"
                  priority
                />
                <span>Stickers for Free</span>
              </div>
              <Link
                id="nav-stickers-callout"
                href="/get-stickers"
                aria-label="Claim Your Stickers"
              >
                <div className="whitespace-nowrap ml-5">
                  <PrimaryButton size="medium">
                    Claim Your Stickers
                  </PrimaryButton>
                </div>
              </Link>
            </div>
            <div
              className="flex px-3 mr-2 cursor-pointer"
              onClick={() => {
                try {
                  localStorage.setItem('callout4thJuly', true);
                  setShowCallout(false);
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              <IoIosCloseCircle size={24} />
            </div>
          </div>
        </div>
      </div>
    )
  );
}
