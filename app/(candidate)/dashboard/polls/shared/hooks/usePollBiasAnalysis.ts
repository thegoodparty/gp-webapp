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

  const error = useMemo(() => {
    let errorsArr: string[] = []
    if (biasAnalysis?.bias_spans.length) {
      errorsArr.push('Biased Language detected.')
    }
    if (biasAnalysis?.grammar_spans.length) {
      errorsArr.push('Grammar issues found.')
    }
    if (errorsArr.length > 0) {
      errorsArr.push(
        'This will compromise data accuracy. Use “Optimize message” to correct it.',
      )
    }
    return errorsArr.join(' ')
  }, [biasAnalysis])

  const analyzeBias = useCallback(
    async (pollText: string) => {
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
        }
      } catch (error) {
        console.error('Error analyzing bias:', error)
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

      if (!contentChanged && biasAnalysis.rewritten_text) {
        setIsOptimizing(true)
        return new Promise((resolve) => {
          setTimeout(() => {
            setIsOptimizing(false)
            setBiasAnalysis(null)
            setContentAtAnalysis('')
            resolve(biasAnalysis.rewritten_text)
          }, 2000)
        })
      }

      setIsOptimizing(true)
      try {
        const response = await clientFetch<BiasAnalysisResponse>(
          apiRoutes.polls.analyzeBias,
          { pollText },
        )

        if (response.ok && response.data) {
          return new Promise((resolve) => {
            setTimeout(() => {
              setIsOptimizing(false)
              setBiasAnalysis(null)
              setContentAtAnalysis('')
              resolve(response.data.rewritten_text)
            }, 2000)
          })
        } else {
          setIsOptimizing(false)
          return null
        }
      } catch (error) {
        console.error('Error optimizing text:', error)
        setIsOptimizing(false)
        return null
      }
    },
    [biasAnalysis, contentAtAnalysis],
  )

  const clearAnalysis = useCallback(() => {
    setBiasAnalysis(null)
    setContentAtAnalysis('')
  }, [])

  return {
    biasAnalysis,
    isAnalyzing,
    isOptimizing,
    error,
    analyzeBias,
    optimizeText,
    clearAnalysis,
  }
}
