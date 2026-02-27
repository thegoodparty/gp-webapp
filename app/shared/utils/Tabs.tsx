'use client'
import MuiTabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import SecondaryButton from '@shared/buttons/SecondaryButton'
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
  variant = 'standard',
  centered = false,
  activeTab = false,
  color = '#000',
  size = 'medium',
  changeCallback = () => {},
}: TabsProps) => {
  const [value, setValue] = useState(0)

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: number,
  ): void => {
    if (activeTab !== false) {
      changeCallback(newValue)
    } else {
      setValue(newValue)
    }
  }

  const isSelected = (index: number): boolean =>
    activeTab !== false ? activeTab === index : value === index

  return (
    <div className={`w-full ${orientation === 'vertical' ? 'flex' : ''}`}>
      <div className={` relative  ${!centered ? 'flex items-center' : ''} `}>
        {orientation === 'horizontal' && (
          <div className=" bg-slate-300 absolute w-full h-[1px] bottom-0 left-0" />
        )}
        <MuiTabs
          value={activeTab !== false ? activeTab : value}
          onChange={handleChange}
          aria-label="nav tabs example"
          orientation={orientation}
          variant={variant}
          centered={centered}
          sx={{
            '.MuiTabs-indicator': { backgroundColor: color },
          }}
        >
          {tabLabels.map((label, index) => (
            <Tab
              key={index}
              sx={{
                '&.MuiButtonBase-root': { padding: 0 },
              }}
              component="div"
              label={
                <SecondaryButton
                  variant="text"
                  size={size}
                  ariaLabel={
                    typeof label === 'string' ? label : `Tab ${index + 1}`
                  }
                >
                  <span
                    style={isSelected(index) ? { color } : { color: '#ADB6C8' }}
                  >
                    {label}
                  </span>
                </SecondaryButton>
              }
            />
          ))}
        </MuiTabs>
      </div>
      {tabPanels.map((panel, index) => (
        <div
          role="tabpanel"
          key={index}
          hidden={!isSelected(index)}
          className={`${orientation === 'horizontal' ? 'mt-3' : 'ml-3'} `}
        >
          {panel}
        </div>
      ))}
    </div>
  )
}

export default Tabs
