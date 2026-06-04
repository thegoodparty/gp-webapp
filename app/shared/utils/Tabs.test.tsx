import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import Tabs from './Tabs'

vi.mock('@styleguide/components/ui/tabs', () => ({
  Tabs: ({
    children,
    value,
    onValueChange,
    orientation,
    className,
  }: {
    children: React.ReactNode
    value?: string
    onValueChange?: (v: string) => void
    orientation?: string
    className?: string
  }) => (
    <div
      data-testid="tabs-root"
      data-value={value}
      data-orientation={orientation}
      className={className}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{
                onValueChange?: (v: string) => void
              }>,
              { onValueChange },
            )
          : child,
      )}
    </div>
  ),
  TabsList: ({
    children,
    onValueChange,
    className,
  }: {
    children: React.ReactNode
    onValueChange?: (v: string) => void
    className?: string
  }) => (
    <div data-testid="tabs-list" className={className}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{
                onValueChange?: (v: string) => void
              }>,
              { onValueChange },
            )
          : child,
      )}
    </div>
  ),
  TabsTrigger: ({
    children,
    value,
    onValueChange,
  }: {
    children: React.ReactNode
    value: string
    onValueChange?: (v: string) => void
  }) => (
    <button
      data-testid={`tab-trigger-${value}`}
      onClick={() => onValueChange?.(value)}
    >
      {children}
    </button>
  ),
  TabsContent: ({
    children,
    value,
    className,
  }: {
    children: React.ReactNode
    value: string
    className?: string
  }) => (
    <div data-testid={`tab-content-${value}`} className={className}>
      {children}
    </div>
  ),
}))

describe('Tabs', () => {
  it('renders all tab labels', () => {
    render(
      <Tabs
        tabLabels={['Alpha', 'Beta', 'Gamma']}
        tabPanels={[
          <div key="a">A</div>,
          <div key="b">B</div>,
          <div key="c">C</div>,
        ]}
      />,
    )
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
  })

  it('renders all tab panels', () => {
    render(
      <Tabs
        tabLabels={['One', 'Two']}
        tabPanels={[<div key="1">Panel 1</div>, <div key="2">Panel 2</div>]}
      />,
    )
    expect(screen.getByText('Panel 1')).toBeInTheDocument()
    expect(screen.getByText('Panel 2')).toBeInTheDocument()
  })

  it('calls changeCallback with the numeric index when a trigger is clicked (uncontrolled)', () => {
    const onChange = vi.fn()
    render(
      <Tabs
        tabLabels={['X', 'Y']}
        tabPanels={[<div key="x">X</div>, <div key="y">Y</div>]}
        changeCallback={onChange}
      />,
    )
    fireEvent.click(screen.getByTestId('tab-trigger-1'))
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('calls changeCallback with the numeric index when controlled', () => {
    const onChange = vi.fn()
    render(
      <Tabs
        tabLabels={['X', 'Y']}
        tabPanels={[<div key="x">X</div>, <div key="y">Y</div>]}
        activeTab={0}
        changeCallback={onChange}
      />,
    )
    fireEvent.click(screen.getByTestId('tab-trigger-1'))
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('uses activeTab as the value when controlled', () => {
    render(
      <Tabs
        tabLabels={['A', 'B']}
        tabPanels={[<div key="a">A</div>, <div key="b">B</div>]}
        activeTab={1}
      />,
    )
    expect(screen.getByTestId('tabs-root')).toHaveAttribute('data-value', '1')
  })

  it('renders with empty arrays without crashing', () => {
    render(<Tabs />)
    expect(screen.getByTestId('tabs-root')).toBeInTheDocument()
  })
})
