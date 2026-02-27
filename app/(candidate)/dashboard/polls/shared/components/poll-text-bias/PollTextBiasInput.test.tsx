import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, waitFor } from '@testing-library/react'
import PollTextBiasInput from './PollTextBiasInput'

// Mock the bias analysis hook
const mockAnalyzeBias = vi.fn()
const mockOptimizeText = vi.fn()
const mockClearAnalysis = vi.fn()

vi.mock('./hooks/usePollBiasAnalysis', () => ({
  usePollBiasAnalysis: vi.fn(() => ({
    biasAnalysis: null,
    isAnalyzing: false,
    isOptimizing: false,
    hasServerError: false,
    analyzeBias: mockAnalyzeBias,
    optimizeText: mockOptimizeText,
    clearAnalysis: mockClearAnalysis,
  })),
}))

// Mock the text streaming hook
vi.mock('./hooks/useTextStreaming', () => ({
  useTextStreaming: vi.fn(() => ({
    isStreaming: false,
    streamingText: '',
    streamText: vi.fn(),
  })),
}))

// Mock analytics
vi.mock('helpers/analyticsHelper', () => ({
  EVENTS: { createPoll: { pollQuestionOptimized: 'test' } },
  trackEvent: vi.fn(),
}))

import { usePollBiasAnalysis } from './hooks/usePollBiasAnalysis'

describe('PollTextBiasInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('triggers bias analysis on blur when text meets threshold', async () => {
    const longText =
      'This is a question that is long enough to trigger analysis'

    render(
      <PollTextBiasInput
        value={longText}
        onChange={vi.fn()}
        analysisLengthThreshold={20}
      />,
    )

    const input = document.querySelector('[contenteditable]')
    if (input) {
      fireEvent.blur(input)
      await waitFor(() => {
        expect(mockAnalyzeBias).toHaveBeenCalledWith(longText)
      })
    }
  })

  it('calls onBiasAnalysisChange when bias state changes', () => {
    const handleBiasChange = vi.fn()

    vi.mocked(usePollBiasAnalysis).mockReturnValue({
      biasAnalysis: {
        bias_spans: [{ start: 0, end: 5, reason: 'test' }],
        grammar_spans: [],
        rewritten_text: '',
      },
      isAnalyzing: false,
      isOptimizing: false,
      hasServerError: false,
      analyzeBias: mockAnalyzeBias,
      optimizeText: mockOptimizeText,
      clearAnalysis: mockClearAnalysis,
    })

    render(
      <PollTextBiasInput
        value="Test text here"
        onChange={vi.fn()}
        onBiasAnalysisChange={handleBiasChange}
      />,
    )

    expect(handleBiasChange).toHaveBeenCalledWith(
      expect.objectContaining({
        hasBias: true,
        hasGrammar: false,
      }),
    )
  })
})
