'use client';

import { useEffect } from 'react';

export default function HubSpotForm({
  formId,
  calendarRedirect = true,
  gtmName = '',
}) {
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
          formId,
          target: '#hubspotForm',
          onFormSubmitted: () => {
            window.dataLayer.push({
              event: 'hubspot-form-success',
              'hs-form-guid': formId,
              'hs-form-name': gtmName,
            });

            if (calendarRedirect) {
              window.location.href =
                'https://meetings.hubspot.com/jared-alper/good-party-academy-meeting';
            }
          },
        });
      }
    });
  }, []);

  return <div id="hubspotForm">Loading...</div>;
}
