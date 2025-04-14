'use client'

import H1 from '@shared/typography/H1'
import Button from '@shared/buttons/Button'
import CircularProgress from '@mui/material/CircularProgress'
import CustomVoterAudienceFilters, {
  TRACKING_KEYS,
} from 'app/(candidate)/dashboard/voter-records/components/CustomVoterAudienceFilters'
import { useEffect, useState, useMemo } from 'react'
import { countVoterFile } from 'app/(candidate)/dashboard/voter-records/[type]/components/RecordCount'
import { numberFormatter } from 'helpers/numberHelper'
import { debounce } from 'helpers/debounceHelper'
import { LEGACY_TASK_TYPES, TASK_TYPES } from '../../constants/tasks.const'

const TEXT_PRICE = 0.03
const CALL_PRICE = 0.04
const CALL_W_VOICEMAIL_PRICE = 0.055

export default function AudienceStep({
  onChangeCallback,
  nextCallback,
  backCallback,
  type,
  withVoicemail,
  audience,
  isCustom,
}) {
  const [count, setCount] = useState(0)
  const [loadingCount, setLoadingCount] = useState(false)
  const hasValues = useMemo(
    () => Object.values(audience).some((value) => value === true),
    [audience],
  )

  useEffect(() => {
    if (!hasValues) return

    debounce(async () => {
      setLoadingCount(true)
      const selectedAudience = Object.keys(audience).filter(
        (key) => audience[key] === true,
      )
      const res = await countVoterFile(isCustom ? 'custom' : type, {
        filters: selectedAudience,
      })

      setCount(res)
      setLoadingCount(false)
    }, 300)
  }, [audience, isCustom, type, hasValues])

  const handleChangeAudience = (newState) => {
    onChangeCallback('audience', newState)
  }

  let price
  // TODO: confirm these prices are correct for new task types!!!
  if (
    type === LEGACY_TASK_TYPES.telemarketing ||
    type === TASK_TYPES.robocall
  ) {
    price = withVoicemail ? CALL_W_VOICEMAIL_PRICE : CALL_PRICE
  } else if (type === LEGACY_TASK_TYPES.sms || type === TASK_TYPES.text) {
    price = TEXT_PRICE
  }

  return (
    <div className="p-4 w-[80vw] max-w-4xl">
      <div className="text-center">
        <H1>Select target audience</H1>
        <div className="p-4 text-sm">
          Voters selected:
          <span className="font-bold text-black ml-1">
            {loadingCount ? (
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
                ${numberFormatter(count * price, 2)}
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
            <Button size="large" color="neutral" onClick={backCallback}>
              Back
            </Button>
          </div>
          <div className="col-span-6 text-right mt-6">
            <Button
              size="large"
              color="secondary"
              onClick={nextCallback}
              disabled={!hasValues}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
