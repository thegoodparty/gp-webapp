'use client'
import { useEffect, useState } from 'react'
import VoterFileTypes from '../../components/VoterFileTypes'
import MarketingH2 from '@shared/typography/MarketingH2'
import { CircularProgress } from '@mui/material'
import { numberFormatter } from 'helpers/numberHelper'
import H2 from '@shared/typography/H2'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

let attempts = 0
const MAX_ATTEMPTS = 3

export async function countVoterFile(type, customFilters) {
  try {
    const payload = {
      type,
      countOnly: true,
    }

    if (customFilters) {
      payload.customFilters = JSON.stringify(customFilters)
    }

    const resp = await clientFetch(apiRoutes.voters.voterFile.get, payload)
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

const fileByKey = {}
VoterFileTypes.forEach((file) => {
  if (typeof file?.key.toLowerCase === 'function') {
    fileByKey[file?.key?.toLowerCase()] = file
  }
})

export default function RecordCount(props) {
  const { type, isCustom, campaign, index } = props
  // const file = fileByKey[type];
  // const { name, fields } = file;
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [error, setError] = useState(false)
  useEffect(() => {
    handleCount()
  }, [type, isCustom])

  const handleCount = async () => {
    let response
    if (isCustom) {
      const customFilters = campaign.data.customVoterFiles[index]
      response = await countVoterFile('custom', customFilters)
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
