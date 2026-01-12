'use client'

import Modal from '@shared/utils/Modal'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import Button from '@shared/buttons/Button'
import Image from 'next/image'
import { useEffect } from 'react'
import { trackEvent, buildTrackingAttrs } from 'helpers/analyticsHelper'

export type P2PModalVariant = 'ProFreeTextsNonCompliant' | 'NonProUpgrade'

export const P2P_MODAL_VARIANTS: { [K in P2PModalVariant]: K } = {
  ProFreeTextsNonCompliant: 'ProFreeTextsNonCompliant',
  NonProUpgrade: 'NonProUpgrade',
}

interface P2PUpgradeModalProps {
  open: boolean
  variant: P2PModalVariant
  onClose: () => void
  onUpgradeLinkClick?: () => void
  trackingAttrs?: ReturnType<typeof buildTrackingAttrs>
}

interface ModalContent {
  title: string
  image: string
  imageAlt: string
  items: React.ReactNode[]
  highlight: string | null
  cta: string
  href: string
}

export function P2PUpgradeModal({
  open,
  variant,
  onClose,
  onUpgradeLinkClick,
  trackingAttrs = {},
}: P2PUpgradeModalProps): React.JSX.Element {
  const isProFreeTextsNonCompliant =
    variant === P2P_MODAL_VARIANTS.ProFreeTextsNonCompliant

  const content: ModalContent = isProFreeTextsNonCompliant
    ? {
        title: 'Text voters. Win your race.',
        image: '/images/messaging.png',
        imageAlt: 'Text messaging campaign illustration',
        items: [
          <>Send 5,000 free texts to voters</>,
          <>Target the right voters</>,
          <>Craft your message and image</>,
        ],
        highlight: null,
        cta: 'Complete Registration',
        href: '/profile#texting-compliance',
      }
    : {
        title: 'Level the playing field for less',
        image: '/images/features.png',
        imageAlt: 'Campaign features illustration',
        items: [
          <>Send 5,000 free texts to voters</>,
          <>Target the right voters</>,
          <>Craft your message and image</>,
        ],
        highlight: 'Join today for just $10/month.',
        cta: 'Upgrade now',
        href: '/dashboard/upgrade-to-pro',
      }

  useEffect(() => {
    if (open) {
      trackEvent('P2P Upgrade - Modal: Modal Shown', {
        variant,
        modalType: 'P2PUpgrade',
        ...trackingAttrs,
      })
    }
  }, [open, variant, trackingAttrs])

  const handleClose = (): void => {
    trackEvent('P2P Upgrade - Modal: Exit', {
      variant,
      modalType: 'P2PUpgrade',
      ...trackingAttrs,
    })
    onClose()
  }

  const handleButtonClick = (): void => {
    trackEvent('P2P Upgrade - Modal: Click Button', {
      variant,
      modalType: 'P2PUpgrade',
      buttonText: content.cta,
      ...trackingAttrs,
    })
    if (onUpgradeLinkClick) {
      onUpgradeLinkClick()
    } else {
      onClose()
    }
  }

  return (
    <Modal
      open={open}
      closeCallback={handleClose}
      preventBackdropClose
      preventEscClose
    >
      <div className="p-4 sm:p-6 max-w-4xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Content Section */}
            <div className="order-1 lg:order-1 space-y-3">
              <H1 className="m-0 text-2xl lg:text-3xl">{content.title}</H1>

              <Body2 className="leading-6">
                <ul className="list-none list-inside p-0 font-sfpro m-0 space-y-1">
                  {content.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1 flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Body2>

              {content.highlight && (
                <Body2 className="text-blue !font-bold mt-2">
                  {content.highlight}
                </Body2>
              )}
            </div>

            <div className="order-2 lg:order-2 relative">
              <div className="relative w-full aspect-[3/2] lg:aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={content.image}
                  alt={content.imageAlt}
                  fill
                  className={
                    content.image.includes('features.png')
                      ? 'object-contain'
                      : 'object-cover'
                  }
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Button
              href={content.href}
              size="large"
              className="text-white rounded-[32px]"
              style={{ backgroundColor: '#14234D' }}
              onClick={handleButtonClick}
              {...trackingAttrs}
            >
              {content.cta}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
