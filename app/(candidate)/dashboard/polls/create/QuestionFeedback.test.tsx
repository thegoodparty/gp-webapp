import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuestionFeedback } from './QuestionFeedback'

describe('QuestionFeedback', () => {
  it('prioritizes error over warning', () => {
    render(
      <QuestionFeedback
        warningMessage="Biased language detected"
        errorMessage="Question is required"
      />
    )

    expect(screen.getByText('Question is required')).toBeInTheDocument()
    expect(screen.queryByText(/Biased language/)).not.toBeInTheDocument()
  })
})
