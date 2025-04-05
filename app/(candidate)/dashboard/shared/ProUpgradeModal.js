'use client'

import { useState, useEffect } from 'react'
import Modal from '@shared/utils/Modal'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import Button from '@shared/buttons/Button'
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper'

const VIABILITY_SCORE_THRESHOLD = 2
const LOCAL_STORAGE_KEY = 'proUpgradeModalDismissedSession'
const VARIANTS = {
  First: 'First',
  Second_NonViable: 'Second_NonViable',
  Second_Viable: 'Second_Viable',
  Third: 'Third',
}
const SESSION_TRIGGERS = {
  First: 3,
  Second: 8,
  Third: 12,
}

export default function ProUpgradeModal({ campaign, user }) {
  const isPro = campaign?.isPro || false
  const sessionCount = user?.metaData?.sessionCount || 0
  const viablityScore = campaign?.pathToVictory?.data?.viability?.score || 0

  const [modalState, setModalState] = useState({
    isOpen: false,
    variant: VARIANTS.First,
  })

  useEffect(() => {
    if (isPro) {
      setModalState((current) => ({ ...current, isOpen: false }))
      return
    }

    const parsed = parseInt(localStorage.getItem(LOCAL_STORAGE_KEY))
    const lastDismissedSession = Number.isNaN(parsed) ? 0 : parsed

    if (
      sessionCount >= SESSION_TRIGGERS.First &&
      sessionCount < SESSION_TRIGGERS.Second &&
      lastDismissedSession < SESSION_TRIGGERS.First
    ) {
      // first trigger
      handleOpen(VARIANTS.First)
    } else if (
      sessionCount >= SESSION_TRIGGERS.Second &&
      sessionCount < SESSION_TRIGGERS.Third &&
      lastDismissedSession < SESSION_TRIGGERS.Second
    ) {
      // second trigger, show differnet content based on viability score
      handleOpen(
        viablityScore < VIABILITY_SCORE_THRESHOLD
          ? VARIANTS.Second_NonViable
          : VARIANTS.Second_Viable,
      )
    } else if (
      sessionCount >= SESSION_TRIGGERS.Third &&
      lastDismissedSession < SESSION_TRIGGERS.Third
    ) {
      // third trigger
      handleOpen(VARIANTS.Third)
    }

    function handleOpen(variant) {
      trackEvent(EVENTS.ProUpgrade.Modal.Shown, {
        sessionCount,
        viablityScore,
        variant,
      })
      setModalState({
        isOpen: true,
        variant: variant,
      })
    }
  }, [sessionCount, viablityScore, isPro])

  // Don't want to show modal if campaign is already pro
  if (isPro) return null

  function handleClose(skipTracking = false) {
    if (!skipTracking) {
      trackEvent(EVENTS.ProUpgrade.Modal.Exit, {
        sessionCount,
        viablityScore,
        variant: modalState.variant,
      })
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, sessionCount)
    setModalState((current) => ({ ...current, isOpen: false }))
  }

  return (
    <Modal
      open={modalState.isOpen}
      closeCallback={() => handleClose()}
      boxClassName="min-w-[500px]"
      preventBackdropClose
      preventEscClose
    >
      <div className="p-8">
        <ModalContent
          sessionCount={sessionCount}
          viablityScore={viablityScore}
          variant={modalState.variant}
          onClose={handleClose}
        />
      </div>
    </Modal>
  )
}

function ModalContent({ sessionCount, viablityScore, variant, onClose }) {
  let title, description, items, highlight, cta

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
          5000 <span className="font-bold">free text messages</span>
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

  function handleClick() {
    trackEvent(EVENTS.ProUpgrade.Modal.ClickButton, {
      sessionCount,
      viablityScore,
      variant,
    })
    onClose(true)
  }

  return (
    <div>
      <H1 className="m-0 whitespace-nowrap">{title}</H1>
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
        onClick={handleClick}
      >
        {cta}
      </Button>
    </div>
  )
}
