'use client';

import { useEffect } from 'react';

export default function HubSpotForm() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.hsforms.net/forms/v2.js';
    script.async = true;

    document.body.appendChild(script);
    script.addEventListener('load', () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: 'na1',
          portalId: '21589597',
          formId: 'c60165c3-704d-4cfa-a8de-d89e28f06a7c',
          target: '#hubspotForm',
        });
      }
    });
  }, []);

  return <div id="hubspotForm">Loading...</div>;
}
