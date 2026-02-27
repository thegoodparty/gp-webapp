'use client'

import Modal from '@shared/utils/Modal'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import Button from '@shared/buttons/Button'
import { FREE_TEXTS_OFFER } from '../outreach/constants'
import { EVENTS, trackEvent, buildTrackingAttrs } from 'helpers/analyticsHelper'
import { useEffect } from 'react'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useUser } from '@shared/hooks/useUser'

export const VIABILITY_SCORE_THRESHOLD = 2

export type VariantType =
  | 'First'
  | 'Second_NonViable'
  | 'Second_Viable'
  | 'Third'

export const VARIANTS: { [K in VariantType]: K } = {
  First: 'First',
  Second_NonViable: 'Second_NonViable',
  Second_Viable: 'Second_Viable',
  Third: 'Third',
}

interface ProUpgradeModalProps {
  open: boolean
  variant: VariantType
  onClose?: () => void
  onUpgradeLinkClick?: () => void
  defaultTrackingEnabled?: boolean
  trackingAttrs?: ReturnType<typeof buildTrackingAttrs>
}

export function ProUpgradeModal({
  open,
  variant,
  onClose,
  onUpgradeLinkClick,
  defaultTrackingEnabled = false,
  trackingAttrs = {},
}: ProUpgradeModalProps): React.JSX.Element {
  const [user] = useUser()
  const [campaign] = useCampaign()
  const sessionCount = user?.metaData?.sessionCount || 0
  const viablityScore = campaign?.pathToVictory?.data?.viability?.score || 0

  let title: string,
    description: string,
    items: React.ReactNode[],
    highlight: string | null,
    cta: string

  switch (variant) {
    case VARIANTS.First:
      title = 'Upgrade to GoodParty.org Pro'
      description =
        'Instant access to voter data and tools to connect with your community:'
      items = [
        <>
          Create targeted <span className="font-bold">voter lists</span>
        </>,
        <>
          Send <span className="font-bold">texts and voicemails</span>{' '}
          (pay-as-you-go)
        </>,
        <>
          Secure votes with powerful{' '}
          <span className="font-bold">canvassing tools</span>
        </>,
      ]
      highlight = 'Start today for just $10/month.'
      cta = 'Upgrade now'
      break
    case VARIANTS.Second_NonViable:
      title = 'Get Pro voter data and tools'
      description = 'Join GoodParty.org Pro today to get:'
      items = [
        <>
          <span className="font-bold">Unlimited voter files</span> tailored to
          your community
        </>,
        <>
          <span className="font-bold">Custom voter segmentation</span> for
          targeting
        </>,
        <>
          <span className="font-bold">Text, voice and door-knocking</span> tools
          for outreach
        </>,
      ]
      highlight = null
      cta = 'Upgrade for $10/month'
      break
    case VARIANTS.Second_Viable:
      title = 'Boost your campaign with Pro'
      description = 'Join GoodParty.org Pro today to get:'
      items = [
        <>
          {FREE_TEXTS_OFFER.COUNT.toLocaleString()}{' '}
          <span className="font-bold">free text messages</span>
        </>,
        <>One-on-one access to political analysts</>,
      ]
      highlight = 'Upgrade today to claim your free benefits.'
      cta = 'Upgrade for $10/month'
      break
    case VARIANTS.Third:
    default:
      title = 'Win with GoodParty.org Pro!'
      description = 'Winning candidates used Pro tools to:'
      items = [
        <>
          <span className="font-bold">Target</span> the right voters
        </>,
        <>
          <span className="font-bold">Mobilize</span> their supporters
        </>,
        <>
          <span className="font-bold">Get voters </span> to participate in early
          voting
        </>,
      ]
      highlight = 'Join them today for just $10/month.'
      cta = 'Upgrade now'
      break
  }

  useEffect(() => {
    if (open) {
      trackEvent(EVENTS.ProUpgrade.Modal.Shown, {
        sessionCount,
        viablityScore,
        variant,
        path: window.location.pathname,
      })
    }
  }, [open])

  const handleClose = (): void => {
    if (defaultTrackingEnabled) {
      trackEvent(EVENTS.ProUpgrade.Modal.Exit, {
        sessionCount,
        viablityScore,
        variant,
        path: window.location.pathname,
      })
    }
    if (onClose) {
      onClose()
    }
  }

  const handleUpgradeLinkClick = (): void => {
    if (defaultTrackingEnabled) {
      trackEvent(EVENTS.ProUpgrade.Modal.ClickButton, {
        sessionCount,
        viablityScore,
        variant,
        path: window.location.pathname,
      })
    }

    if (onUpgradeLinkClick) {
      onUpgradeLinkClick()
    } else if (onClose) {
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
      <div className="p-0 sm:p-2 md:p-8">
        <H1 className="m-0 sm:whitespace-nowrap">{title}</H1>
        <Body2 className="my-4">{description}</Body2>
        <Body2 className="leading-4">
          <ul className="list-none list-inside p-0 font-sfpro m-0">
            {items.map((item, index) => (
              <li key={index}>✔&nbsp; {item}</li>
            ))}
          </ul>
        </Body2>
        {highlight && (
          <Body2 className="mt-4 text-blue !font-bold">{highlight}</Body2>
        )}
        <Button
          href="/dashboard/upgrade-to-pro"
          size="large"
          color="secondary"
          className="mt-8"
          onClick={handleUpgradeLinkClick}
          {...trackingAttrs}
        >
          {cta}
        </Button>
      </div>
    </Modal>
  )
}
