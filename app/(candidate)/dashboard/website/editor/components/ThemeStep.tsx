'use client'
import { useMemo } from 'react'
import H2 from '@shared/typography/H2'
import { ThemeSwatch } from './ThemeSwatch'
import { WEBSITE_THEMES } from '../../shared/websiteConstants.const'

interface ThemeStepProps {
  theme: string
  onChange: (key: string) => void
  noHeading?: boolean
}

export default function ThemeStep({ theme, onChange, noHeading = false }: ThemeStepProps): React.JSX.Element {
  const themeOptions = useMemo(() => Object.entries(WEBSITE_THEMES), [])

  return (
    <>
      {!noHeading && <H2 className="mb-6">Choose a color theme</H2>}
      <div className="grid grid-cols-2 gap-4">
        {themeOptions.map(([key, value]) => (
          <ThemeSwatch
            key={key}
            label={key}
            theme={value}
            selected={theme === key}
            onSelect={onChange}
          />
        ))}
      </div>
    </>
  )
}
