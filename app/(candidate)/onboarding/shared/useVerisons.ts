import { useState, useEffect } from 'react'
import { fetchCampaignVersions } from '../../onboarding/shared/ajaxActions'

export default function useVersions(): Record<string, string | number | boolean | object | null> {
  const [versions, setVersions] = useState<Record<string, string | number | boolean | object | null>>({})

  useEffect(() => {
    loadVersions()
  }, [])

  const loadVersions = async (): Promise<void> => {
    const versions = await fetchCampaignVersions()
    setVersions(versions as Record<string, string | number | boolean | object | null>)
  }

  return versions
}
