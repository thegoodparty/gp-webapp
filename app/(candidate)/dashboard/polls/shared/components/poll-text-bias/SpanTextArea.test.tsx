import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SpanTextArea from './SpanTextArea'

describe('SpanTextArea', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    isFocused: false,
    onFocus: vi.fn(),
    onBlur: vi.fn(),
    showHighlights: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the editable input when not showing highlights', () => {
    render(<SpanTextArea {...defaultProps} />)
    const input = document.querySelector('[contenteditable]')
    expect(input).toBeInTheDocument()
  })

  it('applies mobile-safe font size classes to editable view', () => {
    render(<SpanTextArea {...defaultProps} />)
    const input = document.querySelector('[contenteditable]')
    expect(input).toHaveClass('text-base')
    expect(input).toHaveClass('md:text-sm')
  })

  it('applies mobile-safe font size classes to highlighted view', () => {
    render(
      <SpanTextArea
        {...defaultProps}
        value="Test value"
        showHighlights={true}
        isFocused={false}
      />
    )
    // When showHighlights is true and not focused, the highlighted view is shown
    const highlightedView = document.querySelector('.cursor-text.rounded-lg')
    expect(highlightedView).toBeInTheDocument()
    expect(highlightedView).toHaveClass('text-base')
    expect(highlightedView).toHaveClass('md:text-sm')
  })

  it('applies mobile-safe font size classes to placeholder', () => {
    render(
      <SpanTextArea
        {...defaultProps}
        placeholder="Enter text here..."
        isFocused={true}
      />
    )
    const placeholder = screen.getByText('Enter text here...')
    expect(placeholder).toHaveClass('text-base')
    expect(placeholder).toHaveClass('md:text-sm')
  })

  it('hides placeholder when value is present', () => {
    render(
      <SpanTextArea
        {...defaultProps}
        value="Some text"
        placeholder="Enter text here..."
        isFocused={true}
      />
    )
    expect(screen.queryByText('Enter text here...')).not.toBeInTheDocument()
  })

  it('hides placeholder when showLoadingDots is true', () => {
    render(
      <SpanTextArea
        {...defaultProps}
        placeholder="Enter text here..."
        showLoadingDots={true}
        loadingDots={<div data-testid="loading-dots">Loading...</div>}
        isFocused={true}
      />
    )
    expect(screen.queryByText('Enter text here...')).not.toBeInTheDocument()
    expect(screen.getByTestId('loading-dots')).toBeInTheDocument()
  })

  it('hides placeholder when hidePlaceholder is true', () => {
    render(
      <SpanTextArea
        {...defaultProps}
        placeholder="Enter text here..."
        hidePlaceholder={true}
        isFocused={true}
      />
    )
    expect(screen.queryByText('Enter text here...')).not.toBeInTheDocument()
  })

  it('calls onFocus when clicking on highlighted view', () => {
    const onFocus = vi.fn()
    render(
      <SpanTextArea
        {...defaultProps}
        value="Test value"
        showHighlights={true}
        isFocused={false}
        onFocus={onFocus}
      />
    )
    const highlightedView = document.querySelector('.cursor-text.rounded-lg')
    fireEvent.mouseDown(highlightedView!)
    expect(onFocus).toHaveBeenCalled()
  })

  it('calls onFocus when touching highlighted view', () => {
    const onFocus = vi.fn()
    render(
      <SpanTextArea
        {...defaultProps}
        value="Test value"
        showHighlights={true}
        isFocused={false}
        onFocus={onFocus}
      />
    )
    const highlightedView = document.querySelector('.cursor-text.rounded-lg')
    fireEvent.touchStart(highlightedView!)
    expect(onFocus).toHaveBeenCalled()
  })

  it('applies warning border classes when hasWarning is true', () => {
    render(
      <SpanTextArea
        {...defaultProps}
        hasWarning={true}
        isFocused={true}
      />
    )
    const input = document.querySelector('[contenteditable]')
    expect(input).toHaveClass('border-warning-light')
  })

  it('applies focused border classes when isFocused is true', () => {
    render(
      <SpanTextArea
        {...defaultProps}
        isFocused={true}
      />
    )
    const input = document.querySelector('[contenteditable]')
    expect(input).toHaveClass('border-blue-300')
  })

  it('applies loading border classes when showLoadingDots is true', () => {
    render(
      <SpanTextArea
        {...defaultProps}
        showLoadingDots={true}
        isFocused={true}
      />
    )
    const input = document.querySelector('[contenteditable]')
    expect(input).toHaveClass('border-gray-200')
  })

  it('calls onChange when input is modified', () => {
    const onChange = vi.fn()
    render(
      <SpanTextArea
        {...defaultProps}
        onChange={onChange}
        isFocused={true}
      />
    )
    const input = document.querySelector('[contenteditable]')
    fireEvent.input(input!, { target: { textContent: 'New text' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('applies isReadOnly state correctly', () => {
    render(
      <SpanTextArea
        {...defaultProps}
        isReadOnly={true}
        isFocused={true}
      />
    )
    const input = document.querySelector('[contenteditable]')
    expect(input).toHaveAttribute('contenteditable', 'false')
    expect(input).toHaveClass('cursor-default')
  })

  it('applies custom className', () => {
    render(
      <SpanTextArea
        {...defaultProps}
        className="custom-class"
      />
    )
    const wrapper = document.querySelector('.custom-class')
    expect(wrapper).toBeInTheDocument()
  })

  it('applies custom minHeight', () => {
    render(
      <SpanTextArea
        {...defaultProps}
        minHeight="200px"
        isFocused={true}
      />
    )
    const input = document.querySelector('[contenteditable]')
    expect(input).toHaveStyle({ minHeight: '200px' })
  })
})
