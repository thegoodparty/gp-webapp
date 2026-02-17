'use client'

import H1 from '@shared/typography/H1'
import Button from '@shared/buttons/Button'
import CircularProgress from '@mui/material/CircularProgress'
import CustomVoterAudienceFilters, {
  TRACKING_KEYS,
  AudienceFiltersState,
  AudienceFilterKey,
} from 'app/(candidate)/dashboard/voter-records/components/CustomVoterAudienceFilters'
import { useEffect, useMemo, useState } from 'react'
import { countVoterFile } from 'app/(candidate)/dashboard/voter-records/[type]/components/RecordCount'
import { numberFormatter } from 'helpers/numberHelper'
import { debounce } from 'helpers/debounceHelper'
import {
  LEGACY_TASK_TYPES,
  TASK_TYPES,
} from '../../../shared/constants/tasks.const'
import { buildTrackingAttrs } from 'helpers/analyticsHelper'
import { useCampaign } from '@shared/hooks/useCampaign'
import { FREE_TEXTS_OFFER } from '../../../outreach/constants'
import { useP2pUxEnabled } from 'app/(candidate)/dashboard/components/tasks/flows/hooks/P2pUxEnabledProvider'
import { PhoneListInput } from 'helpers/createP2pPhoneList'

const TEXT_PRICE = 0.035
const CALL_PRICE = 0.04
const CALL_W_VOICEMAIL_PRICE = 0.055

const isAudienceFilterKey = (
  key: string,
  audience: AudienceFiltersState,
): key is AudienceFilterKey => {
  return key in audience
}

type VoterFileFilterResult = PhoneListInput & { id?: number }

interface AudienceStepProps {
  onChangeCallback: (
    keyOrData:
      | string
      | {
          voterFileFilter?: VoterFileFilterResult
          phoneListToken: string | null | undefined
        },
    value?: AudienceFiltersState | number,
  ) => void
  nextCallback: () => void
  backCallback: () => void
  type: string
  withVoicemail?: boolean
  audience: AudienceFiltersState
  isCustom?: boolean
  onCreateVoterFileFilter?: () => Promise<VoterFileFilterResult | undefined>
  onCreatePhoneList?: (
    voterFileFilter: VoterFileFilterResult | undefined,
  ) => Promise<string | null | undefined>
}

export default function AudienceStep({
  onChangeCallback,
  nextCallback,
  backCallback,
  type,
  withVoicemail,
  audience,
  isCustom,
  onCreateVoterFileFilter = async () => ({}),
  onCreatePhoneList = async () => null,
}: AudienceStepProps): React.JSX.Element {
  const [campaign] = useCampaign()
  const { p2pUxEnabled } = useP2pUxEnabled()
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const hasValues = useMemo(
    () => Object.values(audience).some((value) => value === true),
    [audience],
  )

  const nextTrackingAttrs = useMemo(
    () => buildTrackingAttrs('Next Target Audience', { type }),
    [type],
  )

  const backTrackingAttrs = useMemo(
    () => buildTrackingAttrs('Back Target Audience', { type }),
    [type],
  )

  const handleOnNext = async () => {
    setLoading(true)

    const voterFileFilter = await onCreateVoterFileFilter()
    const phoneListToken = p2pUxEnabled
      ? await onCreatePhoneList(voterFileFilter)
      : null
    setLoading(false)
    onChangeCallback({
      voterFileFilter,
      phoneListToken,
    })
    nextCallback()
  }

  useEffect(() => {
    if (!hasValues) return

    debounce(async () => {
      setLoading(true)
      const selectedAudience = Object.keys(audience).filter(
        (key) => isAudienceFilterKey(key, audience) && audience[key] === true,
      )
      const res = await countVoterFile(isCustom ? 'custom' : type, {
        filters: selectedAudience,
      })

      if (res !== false) {
        setCount(res)
        onChangeCallback('voterCount', res)
      }
      setLoading(false)
    }, 300)
  }, [audience, isCustom, type, hasValues])

  const handleChangeAudience = (newState: AudienceFiltersState) => {
    onChangeCallback('audience', newState)
  }

  let price: number | undefined
  // TODO: confirm these prices are correct for new task types!!!
  if (
    type === LEGACY_TASK_TYPES.telemarketing ||
    type === TASK_TYPES.robocall
  ) {
    price = withVoicemail ? CALL_W_VOICEMAIL_PRICE : CALL_PRICE
  } else if (type === LEGACY_TASK_TYPES.sms || type === TASK_TYPES.text) {
    price = TEXT_PRICE
  }

  const isTextType = type === LEGACY_TASK_TYPES.sms || type === TASK_TYPES.text
  const hasFreeTextsOffer =
    p2pUxEnabled && campaign?.hasFreeTextsOffer && isTextType

  const calculateCost = (textCount: number): number => {
    if (hasFreeTextsOffer && textCount > 0 && price !== undefined) {
      const discountedCount = Math.max(0, textCount - FREE_TEXTS_OFFER.COUNT)
      return discountedCount * price
    }
    return textCount * (price ?? 0)
  }

  return (
    <div className="p-4 w-[80vw] max-w-4xl">
      <div className="text-center">
        <H1>Select target audience</H1>
        {hasFreeTextsOffer && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <span className="text-blue-800 font-medium">
              Your first text gets up to 5,000 Free messages
            </span>
          </div>
        )}
        <div className="p-4 text-sm">
          Voters selected:
          <span className="font-bold text-black ml-1">
            {loading ? (
              <CircularProgress
                size={14}
                className="inline-block align-middle"
              />
            ) : (
              numberFormatter(count)
            )}
          </span>
          {price && (
            <>
              <span className="mx-3">|</span>
              Estimated cost:
              <span className="font-bold text-black ml-1">
                {loading ? (
                  <CircularProgress
                    size={14}
                    className="inline-block align-middle"
                  />
                ) : (
                  `$${numberFormatter(calculateCost(count), 2)}`
                )}
              </span>
            </>
          )}
        </div>
        <div className="text-left">
          <CustomVoterAudienceFilters
            trackingKey={TRACKING_KEYS.scheduleCampaign}
            showAudienceRequest
            audience={audience}
            onChangeCallback={handleChangeAudience}
          />
        </div>
        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-6 text-left mt-6">
            <Button
              size="large"
              color="neutral"
              onClick={backCallback}
              {...backTrackingAttrs}
            >
              Back
            </Button>
          </div>
          <div className="col-span-6 text-right mt-6">
            <Button
              size="large"
              color="secondary"
              onClick={handleOnNext}
              disabled={!hasValues || loading}
              loading={loading}
              {...nextTrackingAttrs}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
