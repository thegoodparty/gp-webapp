'use client'
import { useCallback, useEffect, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export function useArtifact<T>(runId: string) {
  const [artifact, setArtifact] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArtifact = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const artifactRoute = {
        ...apiRoutes.agentExperiments.artifact,
        path: apiRoutes.agentExperiments.artifact.path.replace(
          ':runId',
          runId,
        ),
      }

      const response = await clientFetch<T>(artifactRoute)

      if (!response.ok) {
        setError('Failed to load report data.')
        return
      }

      setArtifact(response.data)
    } catch {
      setError('Failed to load report data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [runId])

  useEffect(() => {
    fetchArtifact()
  }, [fetchArtifact])

  return { artifact, loading, error, retry: fetchArtifact }
}
