'use client'
import { useEffect, useState } from 'react'
import { AnimatedEllipsis } from '@shared/utils/AnimatedEllipsis'

export default function HubSpotForm({
  formId,
  gtmName = '',
  renderFormDelay = 0,
}) {
  const [formReady, setFormReady] = useState(false)
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.hsforms.net/forms/v2.js'
    script.async = false

    document.body.appendChild(script)
    script.addEventListener('load', () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: 'na1',
          portalId: '21589597',
          formId,
          target: '#hubspotForm',
          onFormSubmitted: () => {
            if (window.dataLayer) {
              window.dataLayer.push({
                event: gtmName,
                'hs-form-guid': formId,
                'hs-form-name': gtmName,
              })
            } else {
              console.log('no data layer')
            }
          },
          onFormReady: () => {
            if (renderFormDelay) {
              return setTimeout(() => setFormReady(true), renderFormDelay)
            }
            setFormReady(true)
          },
        })
      }
    })
  }, [])

  return (
    <>
      {!formReady && (
        <div>
          Loading
          <AnimatedEllipsis />
        </div>
      )}
      <div id="hubspotForm" className={formReady ? '' : 'hidden'}></div>
    </>
  )
}
