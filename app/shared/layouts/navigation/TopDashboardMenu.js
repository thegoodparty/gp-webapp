'use client';
import DashboardMenu from 'app/(candidate)/dashboard/shared/DashboardMenu';
import Hamburger from 'hamburger-react';
import { useEffect } from 'react';

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
  useEffect(() => {
    if (open) {
      disableScroll();
    } else {
      enableScroll();
    }
  }, [open]);
  return (
    <div className="lg:hidden">
      <Hamburger toggled={open} toggle={toggleCallback} size={20} />
      {open && (
        <div className="fixed top-14 left-0 w-screen h-[calc(100vh-56px)] bg-slate-50 p-2 overflow-x-hidden overflow-y-auto">
          <DashboardMenu pathname={pathname} toggleCallback={toggleCallback} />
        </div>
      )}
    </div>
  );
}
