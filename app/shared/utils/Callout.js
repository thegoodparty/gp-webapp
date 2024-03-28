'use client';
import Link from 'next/link';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { IoIosCloseCircle } from 'react-icons/io';
import { useEffect, useState } from 'react';

export default function Callout() {
  const [showCallout, setShowCallout] = useState(true);

  useEffect(() => {
    try {
      const callout = localStorage.getItem('callout');
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
              <span className="md:hidden">Join our Discord!</span>
              <span className="hidden md:block">
                Join our Discord community - meet like-minded independents and
                get involved!
              </span>
              <Link
                id="nav-join-discord"
                href="https://discord.gg/invite/goodparty"
                target="_blank"
                aria-label="Join our Discord community - meet like-minded independents and get involved!"
              >
                <div className="whitespace-nowrap ml-5">
                  <PrimaryButton size="medium">Join Now</PrimaryButton>
                </div>
              </Link>
            </div>
            <div
              className="flex px-3 mr-2 cursor-pointer"
              onClick={() => {
                try {
                  localStorage.setItem('callout', true);
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
