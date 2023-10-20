'use client';
import DashboardMenu from 'app/(candidate)/dashboard/shared/DashboardMenu';
import Hamburger from 'hamburger-react';
import { fetchUserCampaignClient } from 'helpers/campaignHelper';
import { useEffect, useState } from 'react';

function disableScroll() {
  window.scrollTo(0, 0);
  // if any scroll is attempted, set it to 0
  window.onscroll = function () {
    window.scrollTo(0, 0);
  };
}

function enableScroll() {
  window.onscroll = function () {};
}

export default function TopDashboardMenu({ open, toggleCallback, pathname }) {
  const [slug, setSlug] = useState('');
  useEffect(() => {
    if (open) {
      disableScroll();
    } else {
      enableScroll();
    }
  }, [open]);

  useEffect(() => {
    //mobile menu doesn't have candidateSlug
    getSlug();
  }, []);

  const getSlug = async () => {
    const { campaign } = await fetchUserCampaignClient();
    const { candidateSlug } = campaign || {};
    setSlug(candidateSlug);
  };
  return (
    <div className="lg:hidden">
      <Hamburger toggled={open} toggle={toggleCallback} size={20} />
      {open && (
        <div className="fixed top-14 left-0 w-screen h-[calc(100vh-56px)] bg-slate-50 p-2 overflow-x-hidden overflow-y-auto">
          <DashboardMenu
            pathname={pathname}
            toggleCallback={toggleCallback}
            candidateSlug={slug}
            pathToVictory={campaign?.pathToVictory}
          />
        </div>
      )}
    </div>
  );
}
