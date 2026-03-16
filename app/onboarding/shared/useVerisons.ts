import { useState, useEffect } from 'react'
import { fetchCampaignVersions } from '../../onboarding/shared/ajaxActions'

export default function useVersions(): Partial<
  Record<string, string | number | boolean | object | null>
> {
  const [versions, setVersions] = useState<
    Partial<Record<string, string | number | boolean | object | null>>
  >({})

  useEffect(() => {
    loadVersions()
  }, [])

  const loadVersions = async (): Promise<void> => {
    const versions = await fetchCampaignVersions()
    setVersions(versions)
  }

  return versions
}
