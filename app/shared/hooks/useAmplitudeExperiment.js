import { useEffect, useState } from 'react'

export const useAmplitudeExperiment = () => {
  const [experiment, setExperiment] = useState(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Check if the experiment client is available
    const checkExperiment = () => {
      if (typeof window !== 'undefined' && window.experiment) {
        setExperiment(window.experiment)
        setIsReady(true)
      } else {
        // Retry after a short delay if not ready yet
        setTimeout(checkExperiment, 100)
      }
    }

    checkExperiment()
  }, [])

  const fetch = async (user) => {
    if (!experiment) {
      console.warn('Amplitude Experiment client not ready')
      return
    }

    try {
      await experiment.fetch(user)
    } catch (error) {
      console.error('Error fetching experiment flags:', error)
    }
  }

  const evaluate = (flagKey, user = null) => {
    if (!experiment) {
      console.warn('Amplitude Experiment client not ready')
      return null
    }

    try {
      return experiment.evaluate(flagKey, user)
    } catch (error) {
      console.error('Error evaluating experiment flag:', error)
      return null
    }
  }

  const evaluateAll = (user = null) => {
    if (!experiment) {
      console.warn('Amplitude Experiment client not ready')
      return {}
    }

    try {
      return experiment.evaluateAll(user)
    } catch (error) {
      console.error('Error evaluating all experiment flags:', error)
      return {}
    }
  }

  return {
    experiment,
    isReady,
    fetch,
    evaluate,
    evaluateAll,
  }
}

export default useAmplitudeExperiment 