'use client'
import { useEffect, useState } from 'react'
import MarketingH2 from '@shared/typography/MarketingH2'
import { CircularProgress } from '@mui/material'
import { numberFormatter } from 'helpers/numberHelper'
import H2 from '@shared/typography/H2'
import Body2 from '@shared/typography/Body2'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { Campaign } from 'helpers/types'

let attempts = 0
const MAX_ATTEMPTS = 3
const MISSING_L2_DISTRICT_DATA_ERROR_CODE = 'MISSING_L2_DISTRICT_DATA'

interface VoterFileFilters {
  filters: string[]
}

interface VoterFilePayload {
  type: string
  countOnly: boolean
  customFilters?: string
}

export interface CountVoterFileError {
  ok: false
  status?: number
  errorCode?: string
  message?: string
}

export type CountVoterFileResult = number | CountVoterFileError

const extractErrorInfo = (
  data: unknown,
): { message?: string; errorCode?: string } => {
  if (!data || typeof data !== 'object') return {}
  const record = data as Record<string, unknown>
  const rawMessage = record.message
  const message =
    typeof rawMessage === 'string'
      ? rawMessage
      : Array.isArray(rawMessage)
      ? rawMessage.filter((m) => typeof m === 'string').join(', ')
      : undefined
  const errorCode =
    typeof record.errorCode === 'string' ? record.errorCode : undefined
  return { message, errorCode }
}

export const countVoterFile = async (
  type: string,
  customFilters?: VoterFileFilters | string[],
): Promise<CountVoterFileResult> => {
  try {
    const payload: VoterFilePayload = {
      type,
      countOnly: true,
    }

    if (customFilters) {
      const filters: VoterFileFilters = Array.isArray(customFilters)
        ? { filters: customFilters }
        : customFilters
      payload.customFilters = JSON.stringify(filters)
    }

    const resp = await clientFetch<number | File>(
      apiRoutes.voters.voterFile.get,
      payload,
    )

    if (!resp.ok) {
      return { ok: false, status: resp.status, ...extractErrorInfo(resp.data) }
    }

    const count = resp.data
    if (typeof count === 'number') {
      return count
    }
    return { ok: false }
  } catch (e) {
    console.error('error', e)
    return { ok: false }
  }
}

interface RecordCountProps {
  type: string
  isCustom: boolean
  campaign: Campaign
  index: number
}

export default function RecordCount(
  props: RecordCountProps,
): React.JSX.Element {
  const { type, isCustom, campaign, index } = props
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [error, setError] = useState<CountVoterFileError | null>(null)
  useEffect(() => {
    handleCount()
  }, [type, isCustom])

  const handleCount = async (): Promise<void> => {
    let response: CountVoterFileResult
    if (isCustom) {
      const customVoterFile = campaign.data?.customVoterFiles?.[index]
      response = await countVoterFile('custom', customVoterFile?.filters)
    } else {
      response = await countVoterFile(type)
    }
    if (typeof response !== 'number') {
      const isMissingDistrictData =
        response.errorCode === MISSING_L2_DISTRICT_DATA_ERROR_CODE
      const isClientError =
        typeof response.status === 'number' &&
        response.status >= 400 &&
        response.status < 500
      if (!isMissingDistrictData && !isClientError) {
        attempts++
        if (attempts < MAX_ATTEMPTS) {
          handleCount()
          return
        }
      }
      setError(response)
      setLoading(false)
    } else {
      setCount(response)
      setLoading(false)
    }
  }
  if (loading) {
    return (
      <div className="mt-4">
        <CircularProgress />
      </div>
    )
  }
  if (error) {
    const isMissingDistrictData =
      error.errorCode === MISSING_L2_DISTRICT_DATA_ERROR_CODE
    return (
      <div className="mt-4">
        <H2>
          {isMissingDistrictData
            ? 'Voter data not available for your district'
            : 'Error counting records'}
        </H2>
        {isMissingDistrictData ? (
          <Body2 className="mt-2">
            {error.message ||
              'Voter data is missing for the selected office. Please contact support at help@goodparty.org so we can update your district information.'}
          </Body2>
        ) : null}
      </div>
    )
  }
  return <MarketingH2>{numberFormatter(count)}</MarketingH2>
}
