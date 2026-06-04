'use client'
import {
  Tabs as SgTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@styleguide/components/ui/tabs'
import { noop } from './noop'
import { useState, ReactNode } from 'react'

interface TabsProps {
  tabLabels?: ReactNode[]
  tabPanels?: ReactNode[]
  orientation?: 'horizontal' | 'vertical'
  variant?: 'standard' | 'scrollable' | 'fullWidth'
  centered?: boolean
  activeTab?: number | false
  color?: string
  size?: 'large' | 'medium' | 'small'
  changeCallback?: (newValue: number) => void
}

const Tabs = ({
  tabLabels = [],
  tabPanels = [],
  orientation = 'horizontal',
  activeTab = false,
  changeCallback = noop,
}: TabsProps) => {
  const [internalValue, setInternalValue] = useState(0)

  const controlled = activeTab !== false
  const currentIndex = controlled ? (activeTab as number) : internalValue

  const handleValueChange = (v: string) => {
    const index = Number(v)
    if (controlled) {
      changeCallback(index)
    } else {
      setInternalValue(index)
      changeCallback(index)
    }
  }

  return (
    <SgTabs
      value={String(currentIndex)}
      onValueChange={handleValueChange}
      orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
      className={`w-full ${orientation === 'vertical' ? 'flex-row' : ''}`}
    >
      <TabsList
        className={orientation === 'vertical' ? 'flex-col h-auto' : 'w-full'}
      >
        {tabLabels.map((label, index) => (
          <TabsTrigger key={index} value={String(index)}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabPanels.map((panel, index) => (
        <TabsContent
          key={index}
          value={String(index)}
          className={orientation === 'horizontal' ? 'mt-3' : 'ml-3'}
        >
          {panel}
        </TabsContent>
      ))}
    </SgTabs>
  )
}

export default Tabs
