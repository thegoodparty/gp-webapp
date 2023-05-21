'use client';
import MuiTabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import SecondaryButton from '@shared/buttons/SecondaryButton';
import { useState } from 'react';

export default function Tabs({
  tabLabels = [],
  tabPanels = [],
  orientation = 'horizontal',
  variant = 'standard',
  centered = false,
}) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={`w-full ${orientation === 'vertical' ? 'flex' : ''}`}>
      <div className={` relative  ${!centered ? 'flex items-center' : ''} `}>
        {orientation === 'horizontal' && (
          <div className=" bg-slate-300 absolute w-full h-[1px] bottom-0 left-0" />
        )}
        <MuiTabs
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
          orientation={orientation}
          variant={variant}
          centered={centered}
          sx={{
            '.MuiTabs-indicator': { backgroundColor: '#000' },
          }}
        >
          {tabLabels.map((label) => (
            <Tab
              key={label}
              sx={{
                '&.MuiButtonBase-root': { padding: 0 },
              }}
              label={
                <SecondaryButton variant="text" size="medium">
                  {label}
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
          hidden={value !== index}
          className={`${orientation === 'horizontal' ? 'mt-3' : 'ml-3'} `}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
