'use client'
import { useMemo } from 'react'
import { WEBSITE_THEMES } from 'app/(candidateWebsite)/c/[vanityPath]/constants/websiteContent.const'
import Body2 from '@shared/typography/Body2'
import { LuCheck } from 'react-icons/lu'
import H2 from '@shared/typography/H2'

export default function ThemeStep({ theme, onChange }) {
  const themeOptions = useMemo(() => Object.entries(WEBSITE_THEMES), [])

  return (
    <>
      <H2 className="mb-6">Choose a color theme</H2>
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

function ThemeSwatch({ label, theme, selected, onSelect }) {
  const swatches = useMemo(
    () => [
      {
        className: `rounded-tl-md ${theme.bg}`,
        textClass: theme.text,
      },
      {
        className: `border-l-2 border-r-2 ${theme.secondary} ${theme.border}`,
        textClass: theme.text,
      },
      {
        className: `rounded-tr-md ${theme.accent}`,
        textClass: theme.accentText,
      },
    ],
    [theme],
  )

  return (
    <div
      className="group cursor-pointer bg-white rounded-md border border-black/[0.12]"
      onClick={() => onSelect(label)}
    >
      <div className="flex h-10 rounded-t-md overflow-hidden">
        {swatches.map((swatch, idx) => (
          <div
            key={idx}
            className={`flex grow items-center justify-center ${swatch.className}`}
          >
            <span className={`font-bold ${swatch.textClass}`}>A</span>
          </div>
        ))}
      </div>
      <Body2 className="group-hover:bg-indigo-100 !font-outfit capitalize flex h-10 rounded-b-md text-center items-center justify-center border-t border-black/[0.12] gap-2">
        {selected && (
          <LuCheck
            className="text-white rounded-full bg-blue-500 font-bold border-2 border-blue-500"
            size={16}
          />
        )}
        {label}
      </Body2>
    </div>
  )
}
