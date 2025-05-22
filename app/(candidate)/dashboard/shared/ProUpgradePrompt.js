'use client'

import { useState, useEffect } from 'react'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { VARIANTS, ProUpgradeModal } from './ProUpgradeModal'
import { VIABILITY_SCORE_THRESHOLD } from './ProUpgradeModal'

const LOCAL_STORAGE_KEY = 'proUpgradeModalDismissedSession'
const SESSION_TRIGGERS = {
  First: 3,
  Second: 8,
  Third: 12,
}

export function ProUpgradePrompt({ campaign, user }) {
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

  function handleClose() {
    trackEvent(EVENTS.ProUpgrade.Modal.Exit, {
      sessionCount,
      viablityScore,
      variant: modalState.variant,
    })
    closeModal()
  }

  function handleUpgradeLinkClick() {
    trackEvent(EVENTS.ProUpgrade.Modal.ClickButton, {
      sessionCount,
      viablityScore,
      variant: modalState.variant,
    })
    closeModal()
  }

  function closeModal() {
    localStorage.setItem(LOCAL_STORAGE_KEY, sessionCount)
    setModalState((current) => ({ ...current, isOpen: false }))
  }

  return (
    <ProUpgradeModal
      open={modalState.isOpen}
      variant={modalState.variant}
      onClose={handleClose}
      onUpgradeLinkClick={handleUpgradeLinkClick}
    />
  )
}
