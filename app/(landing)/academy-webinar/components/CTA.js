'use client';

import H2 from '@shared/typography/H2';
import H3 from '@shared/typography/H3';
import MarketingH2 from '@shared/typography/MarketingH2';
import Subtitle1 from '@shared/typography/Subtitle1';
import HubSpotForm from '@shared/utils/HubSpotForm';
import Modal from '@shared/utils/Modal';
import { useState } from 'react';

export default function CTA({ children, content, clickId }) {
  const [open, setOpen] = useState(false);
  const { formId, ctaRedirect } = content;
  return (
    <>
      <div
        onClick={() => {
          setOpen(true);
        }}
      >
        {children}
      </div>
      {open ? (
        <Modal
          open
          closeCallback={() => {
            setOpen(false);
          }}
        >
          <div className="w-[90vw] max-w-lg">
            <H2 className="mb-2">Sign up to make a difference</H2>
            <Subtitle1 className="mb-5">
              Sign up for an intro webinar with our team and take the first step
              towards a brighter political future for your community.
            </Subtitle1>
            <HubSpotForm
              formId={formId}
              ctaRedirect={ctaRedirect}
              gtmName={clickId}
            />
          </div>
        </Modal>
      ) : null}
    </>
  );
}
