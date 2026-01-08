'use client'

import { useState, useEffect } from 'react'
import {
  VARIANTS,
  ProUpgradeModal,
  VariantType,
  VIABILITY_SCORE_THRESHOLD,
} from './ProUpgradeModal'
import { User, Campaign } from 'helpers/types'

const LOCAL_STORAGE_KEY = 'proUpgradeModalDismissedSession'

interface SessionTriggers {
  First: number
  Second: number
  Third: number
}

const SESSION_TRIGGERS: SessionTriggers = {
  First: 3,
  Second: 8,
  Third: 12,
}

interface ModalState {
  isOpen: boolean
  variant: VariantType
}

interface ProUpgradePromptProps {
  campaign?: Campaign | null
  user?: User | null
  pathname?: string
}

export function ProUpgradePrompt({
  campaign,
  user,
  pathname,
}: ProUpgradePromptProps): React.JSX.Element | null {
  const isPro = campaign?.isPro || false
  const sessionCount = user?.metaData?.sessionCount || 0
  const viablityScore = campaign?.pathToVictory?.data?.viability?.score || 0

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    variant: VARIANTS.First,
  })

  useEffect(() => {
    if (isPro) {
      setModalState((current) => ({ ...current, isOpen: false }))
      return
    }

    // Don't show modal on polls pages
    if (pathname?.startsWith('/dashboard/polls')) {
      setModalState((current) => ({ ...current, isOpen: false }))
      return
    }

    const parsed = parseInt(localStorage.getItem(LOCAL_STORAGE_KEY) || '')
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

    function handleOpen(variant: VariantType): void {
      setModalState({
        isOpen: true,
        variant: variant,
      })
    }
  }, [sessionCount, viablityScore, isPro, pathname])

  // Don't want to show modal if campaign is already pro
  if (isPro) return null

  function closeModal(): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, String(sessionCount))
    setModalState((current) => ({ ...current, isOpen: false }))
  }

  return (
    <ProUpgradeModal
      open={modalState.isOpen}
      variant={modalState.variant}
      onClose={closeModal}
      onUpgradeLinkClick={closeModal}
      defaultTrackingEnabled
    />
  )
}
