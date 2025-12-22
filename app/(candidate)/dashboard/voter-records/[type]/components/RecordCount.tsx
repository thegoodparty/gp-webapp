'use client'
import { useEffect, useState } from 'react'
import VoterFileTypes from '../../components/VoterFileTypes'
import MarketingH2 from '@shared/typography/MarketingH2'
import { CircularProgress } from '@mui/material'
import { numberFormatter } from 'helpers/numberHelper'
import H2 from '@shared/typography/H2'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { Campaign } from 'helpers/types'

let attempts = 0
const MAX_ATTEMPTS = 3

interface CustomFilters {
  [key: string]: string | number | boolean
}

interface VoterFilePayload {
  type: string
  countOnly: boolean
  customFilters?: string
}

export const countVoterFile = async (
  type: string,
  customFilters?: CustomFilters,
): Promise<number | false> => {
  try {
    const payload: VoterFilePayload = {
      type,
      countOnly: true,
    }

    if (customFilters) {
      payload.customFilters = JSON.stringify(customFilters)
    }

    const resp = await clientFetch<{ count: number }>(apiRoutes.voters.voterFile.get, payload)
    return resp.data?.count ?? 0
  } catch (e) {
    console.error('error', e)
    return false
  }
}

interface VoterFileType {
  key: string
  name?: string
  fields?: string[]
}

interface FileByKey {
  [key: string]: VoterFileType
}

const fileByKey: FileByKey = {}
VoterFileTypes.forEach((file: VoterFileType) => {
  if (typeof file?.key?.toLowerCase === 'function') {
    fileByKey[file.key.toLowerCase()] = file
  }
})

interface RecordCountProps {
  type: string
  isCustom: boolean
  campaign: Campaign
  index: number
}

export default function RecordCount(props: RecordCountProps): React.JSX.Element {
  const { type, isCustom, campaign, index } = props
  // const file = fileByKey[type];
  // const { name, fields } = file;
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [error, setError] = useState(false)
  useEffect(() => {
    handleCount()
  }, [type, isCustom])

  const handleCount = async (): Promise<void> => {
    let response: number | false
    if (isCustom) {
      const customVoterFile = campaign.data?.customVoterFiles?.[index]
      response = await countVoterFile('custom', customVoterFile?.filters)
    } else {
      response = await countVoterFile(type)
    }
    if (!response) {
      attempts++
      if (attempts < MAX_ATTEMPTS) {
        handleCount()
      } else {
        setError(true)
        setLoading(false)
      }
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
    return (
      <div className="mt-4">
        <H2>Error counting records</H2>
      </div>
    )
  }
  return <MarketingH2>{numberFormatter(count)}</MarketingH2>
}
