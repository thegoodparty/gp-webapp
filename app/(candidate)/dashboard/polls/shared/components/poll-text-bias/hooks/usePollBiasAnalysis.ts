import { useState, useCallback, useMemo } from 'react'
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
  error: string
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
  const [errors, setErrors] = useState<string[]>([])

  const errorString = useMemo(() => {
    let spanErrors: string[] = []
    if (biasAnalysis?.bias_spans.length) {
      spanErrors.push('Biased Language detected.')
    }
    if (biasAnalysis?.grammar_spans.length) {
      spanErrors.push('Grammar issues found.')
    }

    if (spanErrors.length > 0) {
      spanErrors.push(
        'This will compromise data accuracy. Use "Optimize message" to correct it.',
      )
    }
    return errors.concat(spanErrors).join(' ')
  }, [biasAnalysis, errors])

  const analyzeBias = useCallback(
    async (pollText: string) => {
      setErrors([])
      if (!pollText || pollText.trim().length === 0) {
        setBiasAnalysis(null)
        return
      }

      setIsAnalyzing(true)
      try {
        const response = await clientFetch<BiasAnalysisResponse>(
          apiRoutes.polls.analyzeBias,
          { pollText },
        )

        if (response.ok && response.data) {
          setBiasAnalysis(response.data)
          setContentAtAnalysis(pollText)
          onAnalyze?.(response.data)
        } else {
          throw new Error(response.statusText)
        }
      } catch (error) {
        console.error('Error analyzing bias:', error)
        setErrors(['Unable to check for bias, please try again later'])
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
                setErrors(['Unable to check for bias, please try again later'])
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
        setErrors(['Unable to check for bias, please try again later'])
        setIsOptimizing(false)
        return null
      }
    },
    [biasAnalysis, contentAtAnalysis],
  )

  const clearAnalysis = useCallback(() => {
    setBiasAnalysis(null)
    setContentAtAnalysis('')
    setErrors([])
  }, [])

  return {
    biasAnalysis,
    isAnalyzing,
    isOptimizing,
    error: errorString,
    analyzeBias,
    optimizeText,
    clearAnalysis,
  }
}
