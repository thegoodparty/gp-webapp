'use client';
import MuiTabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import SecondaryButton from '@shared/buttons/SecondaryButton';
import { useState } from 'react';
import { slugify } from 'helpers/articleHelper';

export default function Tabs({
  tabLabels = [],
  tabPanels = [],
  orientation = 'horizontal',
  variant = 'standard',
  centered = false,
  // controlledMode
  activeTab = false,
  changeCallback = () => {},
}) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    if (activeTab !== false) {
      changeCallback(newValue);
      //controlled
    } else {
      setValue(newValue);
    }
  };

  const isSelected = (index) => {
    if (activeTab !== false) {
      return activeTab === index;
    }
    return value === index;
  };
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
            '.MuiTabs-indicator': { backgroundColor: '#000' },
          }}
        >
          {tabLabels.map((label, index) => (
            <Tab
              key={index}
              sx={{
                '&.MuiButtonBase-root': { padding: 0 },
              }}
              label={
                <SecondaryButton variant="text" size="medium">
                  <span
                    className={
                      isSelected(index) ? 'text-primary' : 'text-gray-700'
                    }
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
          // hidden={activeTab !== false ? activeTab !== index : value !== index}
          hidden={!isSelected(index)}
          className={`${orientation === 'horizontal' ? 'mt-3' : 'ml-3'} `}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
