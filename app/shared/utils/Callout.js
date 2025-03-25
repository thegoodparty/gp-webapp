'use client';
import Link from 'next/link';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { IoIosCloseCircle } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { buildTrackingAttrs } from 'helpers/fullStoryHelper';
import Button from '@shared/buttons/Button';

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

  const trackingAttrs = buildTrackingAttrs(
    'Join GoodParty.org Community Banner Link',
  );

  function handleClose() {
    try {
      localStorage.setItem('callout', true);
      setShowCallout(false);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    showCallout && (
      <div className="flex w-screen h-auto">
        <div className="flex w-full bg-lime-400 lg:block border-solid border-b border-zinc-200 p-2 h-full">
          <div className="flex w-full h-14">
            <div className="flex w-full justify-center items-center ">
              <span className="md:hidden">
                Join our GoodParty.org Community!
              </span>
              <span className="hidden md:block">
                Join our GoodParty.org Community - meet like-minded independents
                and get involved!
              </span>
              <Button
                id="nav-join-community"
                href="https://community.goodparty.org"
                target="_blank"
                aria-label="Join our GoodParty.org Community - meet like-minded independents and get involved!"
                {...trackingAttrs}
                size="large"
                className="whitespace-nowrap ml-5 !py-2 border-none"
              >
                Join Now
              </Button>
            </div>
            <div
              className="flex px-3 mr-2 cursor-pointer"
              onKeyDown={(e) => e.key === 'Enter' && handleClose()}
              onClick={handleClose}
            >
              <IoIosCloseCircle role="button" tabIndex={0} size={24} />
            </div>
          </div>
        </div>
      </div>
    )
  );
}
