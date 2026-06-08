'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@styleguide'
import {
  CalendarIcon,
  ClipboardListIcon,
  FileTextIcon,
  MapPinIcon,
  SendIcon,
} from '@styleguide/components/ui/icons'
import H2 from '@shared/typography/H2'
import Body2 from '@shared/typography/Body2'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useSnackbar } from 'helpers/useSnackbar'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { dateUsHelper } from 'helpers/dateHelper'
import { clientRequest } from 'gpApi/typed-request'

// Mirror gp-api's renderFilingInstructionsEmail window logic so the on-screen
// window and the "email this to me" body can't drift: both → "start – end",
// else whichever single date exists, else a not-yet-available fallback.
const formatFilingWindow = (
  start: string | null | undefined,
  end: string | null | undefined,
): string => {
  const formattedStart = start ? dateUsHelper(start, 'long') : ''
  const formattedEnd = end ? dateUsHelper(end, 'long') : ''
  if (formattedStart && formattedEnd) {
    return `${formattedStart} – ${formattedEnd}`
  }
  return formattedStart || formattedEnd || 'Not yet available'
}

interface InstructionRowProps {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}

const InstructionRow = ({
  icon,
  label,
  children,
}: InstructionRowProps): React.JSX.Element => (
  <div className="flex gap-3 border-t border-gray-200 p-4 first:border-t-0">
    <span className="mt-0.5 shrink-0 text-primary">{icon}</span>
    <div>
      <span className="block font-medium">{label}</span>
      <Body2 className="text-secondary">{children}</Body2>
    </div>
  </div>
)

const FilingInstructionsStep = (): React.JSX.Element => {
  const router = useRouter()
  const [campaign] = useCampaign()
  const { errorSnackbar, successSnackbar } = useSnackbar()
  const [emailing, setEmailing] = useState(false)

  useEffect(() => {
    trackEvent(EVENTS.ProUpgrade.Compliance.FilingInstructionsViewed)
  }, [])

  const metrics = campaign?.raceTargetMetrics
  const filingFee = metrics?.filingFee ?? null
  const filingRequirementsText = metrics?.filingRequirementsText ?? null
  const filingOfficeAddress = metrics?.filingOfficeAddress ?? null
  const filingPhoneNumber = metrics?.filingPhoneNumber ?? null
  const paperworkInstructions = metrics?.paperworkInstructions ?? null

  // Compose fee + requirements into one "Filing requirements" detail, matching
  // the Figma ("Filing fee is $X. <requirements text>"). $-format matches
  // gp-api's email body (raw dollars) so the two surfaces report the same fee.
  const requirementsDetail = [
    filingFee != null ? `Filing fee is $${filingFee}.` : null,
    filingRequirementsText,
  ]
    .filter(Boolean)
    .join(' ')

  const hasOffice = Boolean(filingOfficeAddress || filingPhoneNumber)

  const handleEmail = async (): Promise<void> => {
    // Guard against a double-tap firing two sends.
    if (emailing) return
    setEmailing(true)
    trackEvent(EVENTS.ProUpgrade.Compliance.FilingInstructionsEmail)
    try {
      // No body: gp-api scopes the send to the caller's own campaign + email.
      await clientRequest(
        'POST /v1/campaigns/mine/filing-instructions/email',
        {},
      )
      successSnackbar('Filing instructions sent to your email.')
    } catch (e) {
      console.error('error emailing filing instructions', e)
      errorSnackbar('Something went wrong. Please try again.')
    } finally {
      setEmailing(false)
    }
  }

  const handleExit = (): void => {
    trackEvent(EVENTS.ProUpgrade.Compliance.FilingInstructionsExit)
    router.push('/dashboard')
  }

  return (
    <div>
      <H2 className="mb-2">
        You&apos;re not eligible for Pro yet, but here&apos;s how to file for
        this election
      </H2>
      <Body2 className="text-secondary mb-8">
        Once done, you can come right back and we&apos;ll have everything ready
        to go. In the meantime, you still have access to our free campaign
        tools.
      </Body2>

      <div className="rounded-xl border border-gray-200">
        <InstructionRow
          icon={<CalendarIcon className="h-5 w-5" />}
          label="Filing window"
        >
          {formatFilingWindow(
            campaign?.details?.filingPeriodsStart,
            campaign?.details?.filingPeriodsEnd,
          )}
        </InstructionRow>

        {requirementsDetail && (
          <InstructionRow
            icon={<FileTextIcon className="h-5 w-5" />}
            label="Filing requirements"
          >
            {requirementsDetail}
          </InstructionRow>
        )}

        {paperworkInstructions && (
          <InstructionRow
            icon={<ClipboardListIcon className="h-5 w-5" />}
            label="Paperwork"
          >
            {paperworkInstructions}
          </InstructionRow>
        )}

        {hasOffice && (
          <InstructionRow
            icon={<MapPinIcon className="h-5 w-5" />}
            label="Filing office"
          >
            {filingOfficeAddress && (
              <span className="block">{filingOfficeAddress}</span>
            )}
            {filingPhoneNumber && (
              <span className="block">{filingPhoneNumber}</span>
            )}
          </InstructionRow>
        )}

        <div className="flex justify-center border-t border-gray-200 p-2">
          <Button
            variant="ghost"
            size="small"
            onClick={() => void handleEmail()}
            loading={emailing}
            loadingText="Sending…"
            icon={<SendIcon className="h-4 w-4" />}
            iconPosition="right"
          >
            Email this to me
          </Button>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button size="large" onClick={handleExit}>
          Continue to dashboard
        </Button>
      </div>
    </div>
  )
}

export default FilingInstructionsStep
