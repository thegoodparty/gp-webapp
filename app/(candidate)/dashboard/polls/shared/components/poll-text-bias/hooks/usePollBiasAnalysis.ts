import { useState, useCallback } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export interface Span {
  start: number
  end: number
  reason: string
  suggestion?: string
}

export interface BiasAnalysisResponse {
  bias_spans: Span[]
  grammar_spans: Span[]
  rewritten_text: string
}

export interface UsePollBiasAnalysisOptions {
  onAnalyze?: (response: BiasAnalysisResponse) => void
}

export interface UsePollBiasAnalysisReturn {
  biasAnalysis: BiasAnalysisResponse | null
  isAnalyzing: boolean
  isOptimizing: boolean
  hasServerError: boolean
  analyzeBias: (pollText: string) => Promise<void>
  optimizeText: (pollText: string) => Promise<string | null>
  clearAnalysis: () => void
}

export function usePollBiasAnalysis(
  options: UsePollBiasAnalysisOptions = {},
): UsePollBiasAnalysisReturn {
  const { onAnalyze } = options
  const [biasAnalysis, setBiasAnalysis] = useState<BiasAnalysisResponse | null>(
    null,
  )
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [contentAtAnalysis, setContentAtAnalysis] = useState<string>('')
  const [hasServerError, setHasServerError] = useState(false)

  const analyzeBias = useCallback(
    async (pollText: string) => {
      if (!pollText || pollText.trim().length === 0) {
        setBiasAnalysis(null)
        setHasServerError(false)
        return
      }

      setIsAnalyzing(true)
      setHasServerError(false)
      try {
        const response = await clientFetch<BiasAnalysisResponse>(
          apiRoutes.polls.analyzeBias,
          { pollText },
        )

        if (response.ok && response.data) {
          setBiasAnalysis(response.data)
          setContentAtAnalysis(pollText)
          setHasServerError(false)
          onAnalyze?.(response.data)
        } else {
          throw new Error(response.statusText)
        }
      } catch (error) {
        console.error('Error analyzing bias:', error)
        setHasServerError(true)
      } finally {
        setIsAnalyzing(false)
      }
    },
    [onAnalyze],
  )

  const optimizeText = useCallback(
    async (pollText: string): Promise<string | null> => {
      if (!biasAnalysis) return null

      const contentChanged = pollText !== contentAtAnalysis
      const useCachedResult = !contentChanged && biasAnalysis.rewritten_text

      setIsOptimizing(true)

      try {
        const rewrittenText = useCachedResult
          ? biasAnalysis.rewritten_text
          : await (async () => {
              const response = await clientFetch<BiasAnalysisResponse>(
                apiRoutes.polls.analyzeBias,
                { pollText },
              )
              if (!response.ok) {
                setHasServerError(true)
                return null
              }
              return response.ok && response.data
                ? response.data.rewritten_text
                : null
            })()

        if (!rewrittenText) {
          setIsOptimizing(false)
          return null
        }

        return new Promise((resolve) => {
          setTimeout(() => {
            setIsOptimizing(false)
            setBiasAnalysis(null)
            setContentAtAnalysis('')
            resolve(rewrittenText)
          }, 2000)
        })
      } catch (error) {
        console.error('Error optimizing text:', error)
        setHasServerError(true)
        setIsOptimizing(false)
        return null
      }
    },
    [biasAnalysis, contentAtAnalysis],
  )

  const clearAnalysis = useCallback(() => {
    setBiasAnalysis(null)
    setContentAtAnalysis('')
    setHasServerError(false)
  }, [])

  return {
    biasAnalysis,
    isAnalyzing,
    isOptimizing,
    hasServerError,
    analyzeBias,
    optimizeText,
    clearAnalysis,
  }
}
