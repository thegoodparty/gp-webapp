'use client'
import { useMemo } from 'react'
import { WEBSITE_THEMES } from 'app/(candidateWebsite)/c/[vanityPath]/constants/websiteContent.const'
import Body2 from '@shared/typography/Body2'
import { LuCheck } from 'react-icons/lu'

export function DisplaySwatch({ theme }) {
  const themeObj = WEBSITE_THEMES[theme] || WEBSITE_THEMES.light
  return (
    <ThemeSwatch
      label={theme}
      theme={themeObj}
      selected={false}
      onSelect={() => {}}
      displayOnly
    />
  )
}

export function ThemeSwatch({
  label,
  theme,
  selected,
  onSelect,
  displayOnly = false,
}) {
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
      className={`group bg-white rounded-md border border-black/[0.12] ${
        !displayOnly ? 'cursor-pointer' : ''
      }`}
      onClick={() => !displayOnly && onSelect(label)}
    >
      <div
        className={`flex h-10 ${
          displayOnly ? 'rounded-md' : 'rounded-t-md'
        } overflow-hidden`}
      >
        {swatches.map((swatch, idx) => (
          <div
            key={idx}
            className={`flex grow items-center justify-center ${swatch.className}`}
          >
            <span className={`font-bold ${swatch.textClass}`}>A</span>
          </div>
        ))}
      </div>
      {!displayOnly && (
        <Body2 className="group-hover:bg-indigo-100 !font-outfit capitalize flex h-10 rounded-b-md text-center items-center justify-center border-t border-black/[0.12] gap-2">
          {selected && (
            <LuCheck
              className="text-white rounded-full bg-blue-500 font-bold border-2 border-blue-500"
              size={16}
            />
          )}
          {label}
        </Body2>
      )}
    </div>
  )
}
