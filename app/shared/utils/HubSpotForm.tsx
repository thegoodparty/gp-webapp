'use client'
import { useEffect, useState } from 'react'
import { AnimatedEllipsis } from '@shared/utils/AnimatedEllipsis'

interface GTMEvent {
  event: string
  formId?: string
  'hs-form-guid'?: string
  'hs-form-name'?: string
}

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (config: {
          region: string
          portalId: string
          formId: string
          target: string
          onFormSubmitted: () => void
          onFormReady: () => void
        }) => void
      }
    }
    dataLayer?: GTMEvent[]
  }
}

interface HubSpotFormProps {
  formId: string
  gtmName?: string
  renderFormDelay?: number
}

const HubSpotForm = ({
  formId,
  gtmName = '',
  renderFormDelay = 0,
}: HubSpotFormProps) => {
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
              setTimeout(() => setFormReady(true), renderFormDelay)
              return
            }
            setFormReady(true)
          },
        })
      }
    })
  }, [formId, gtmName, renderFormDelay])

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

export default HubSpotForm
