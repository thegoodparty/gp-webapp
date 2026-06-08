'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@styleguide/components/ui/icons'
import { Button, Progress } from '@styleguide'
import { FocusedExperienceWrapper } from 'app/dashboard/shared/FocusedExperienceWrapper'
import { LoadingAnimation } from '@shared/utils/LoadingAnimation'
import { noop } from '@shared/utils/noop'
import { useProUpgrade3Flag } from '@shared/experiments/proUpgrade3Flag'
import {
  PRO_UPGRADE_BASE_PATH,
  PRO_UPGRADE_STEP_ORDER,
  proUpgradeStepPath,
  type ProUpgradeStep,
} from '../proUpgradeStep'

// Where the off cohort is sent. The legacy /dashboard/pro-sign-up flow is the
// pro-upgrade3 = off fallback and is intentionally left untouched.
const PRO_SIGN_UP_PATH = '/dashboard/pro-sign-up'

interface ProUpgradeWizardContextValue {
  // null on the wizard index (before redirect) or on any non-step path.
  currentStep: ProUpgradeStep | null
  goToStep: (step: ProUpgradeStep) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
}

const ProUpgradeWizardContext = createContext<ProUpgradeWizardContextValue>({
  currentStep: null,
  goToStep: noop,
  goToNextStep: noop,
  goToPreviousStep: noop,
})

// Per-step pages (tasks 06–14) read this to drive their own forward CTAs and
// to know which step is active.
export const useProUpgradeWizard = (): ProUpgradeWizardContextValue =>
  useContext(ProUpgradeWizardContext)

const stepFromPathname = (pathname: string | null): ProUpgradeStep | null => {
  if (!pathname?.startsWith(PRO_UPGRADE_BASE_PATH)) return null
  const segment = pathname.slice(PRO_UPGRADE_BASE_PATH.length + 1).split('/')[0]
  const match = PRO_UPGRADE_STEP_ORDER.find((step) => step === segment)
  // `filing-instructions` is a valid path but not in the linear order; surface
  // it as a step so the chrome can render Back without offering linear nav.
  if (match) return match
  return segment ? (segment as ProUpgradeStep) : null
}

interface ProUpgradeWizardProps {
  children: React.ReactNode
}

const ProUpgradeWizard = ({
  children,
}: ProUpgradeWizardProps): React.JSX.Element | null => {
  const router = useRouter()
  const pathname = usePathname()
  const { ready, enabled } = useProUpgrade3Flag()

  const currentStep = stepFromPathname(pathname)
  const orderIndex = currentStep
    ? PRO_UPGRADE_STEP_ORDER.indexOf(currentStep)
    : -1

  // Off cohort: send the candidate to the legacy pro-sign-up flow unchanged.
  useEffect(() => {
    if (ready && !enabled) router.replace(PRO_SIGN_UP_PATH)
  }, [ready, enabled, router])

  // Reset scroll to the top whenever the active step changes (dashboard convention).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep])

  const goToStep = useCallback(
    (step: ProUpgradeStep) => router.push(proUpgradeStepPath(step)),
    [router],
  )

  const goToNextStep = useCallback(() => {
    if (orderIndex < 0 || orderIndex >= PRO_UPGRADE_STEP_ORDER.length - 1)
      return
    router.push(proUpgradeStepPath(PRO_UPGRADE_STEP_ORDER[orderIndex + 1]!))
  }, [orderIndex, router])

  const goToPreviousStep = useCallback(() => {
    if (orderIndex > 0) {
      router.push(proUpgradeStepPath(PRO_UPGRADE_STEP_ORDER[orderIndex - 1]!))
    } else {
      router.back()
    }
  }, [orderIndex, router])

  const contextValue = useMemo<ProUpgradeWizardContextValue>(
    () => ({ currentStep, goToStep, goToNextStep, goToPreviousStep }),
    [currentStep, goToStep, goToNextStep, goToPreviousStep],
  )

  // Hold the experience with a spinner only while the flag is resolving.
  if (!ready) {
    return (
      <FocusedExperienceWrapper>
        <LoadingAnimation />
      </FocusedExperienceWrapper>
    )
  }

  // Off cohort: the redirect to pro-sign-up is already scheduled in the effect
  // above. Render nothing rather than a spinner so a silently-failed
  // router.replace can't strand the user on a permanent "loading" screen.
  if (!enabled) return null

  // Show Back on the middle linear steps and on off-order routes
  // (filing-instructions dead-end and the guidance interstitial, orderIndex -1,
  // where goToPreviousStep falls back to router.back()). No Back on value-prop
  // (index 0, nothing before it) or the post-payment SUCCESS surface (last
  // index — must not navigate back to PAYMENT).
  const canGoBack =
    currentStep !== null &&
    (orderIndex === -1 ||
      (orderIndex > 0 && orderIndex < PRO_UPGRADE_STEP_ORDER.length - 1))
  // value-prop (index 0) and the post-payment SUCCESS surface (last index)
  // don't show step progress.
  const showProgress =
    orderIndex > 0 && orderIndex < PRO_UPGRADE_STEP_ORDER.length - 1
  // The bar spans the visible steps only (index 1 .. last-1). Excluding both
  // value-prop and SUCCESS from the denominator makes the final visible step
  // (PAYMENT) read 100% instead of capping short.
  const progressValue = showProgress
    ? (orderIndex / (PRO_UPGRADE_STEP_ORDER.length - 2)) * 100
    : 0

  return (
    <ProUpgradeWizardContext.Provider value={contextValue}>
      <FocusedExperienceWrapper>
        {(canGoBack || showProgress) && (
          <div className="mb-6 flex items-center gap-3">
            {canGoBack && (
              <Button
                variant="ghost"
                size="small"
                onClick={goToPreviousStep}
                aria-label="Go back"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
            )}
            {showProgress && (
              <Progress value={progressValue} className="flex-1" />
            )}
          </div>
        )}
        {children}
      </FocusedExperienceWrapper>
    </ProUpgradeWizardContext.Provider>
  )
}

export default ProUpgradeWizard
