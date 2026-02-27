'use client'
import { useMemo } from 'react'
import Body2 from '@shared/typography/Body2'
import { LuCheck } from 'react-icons/lu'
import { WEBSITE_THEMES } from '../../shared/websiteConstants.const'

interface ThemeConfig {
  bg: string
  text: string
  accent: string
  accentText: string
  secondary: string
  border: string
  muiColor: string
}

interface SwatchItem {
  className: string
  textClass: string
}

interface DisplaySwatchProps {
  theme: string
}

export const DisplaySwatch = ({
  theme,
}: DisplaySwatchProps): React.JSX.Element => {
  const themeObj = WEBSITE_THEMES[theme] ?? WEBSITE_THEMES['light']!
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

interface ThemeSwatchProps {
  label: string
  theme: ThemeConfig
  selected: boolean
  onSelect: (label: string) => void
  displayOnly?: boolean
}

export const ThemeSwatch = ({
  label,
  theme,
  selected,
  onSelect,
  displayOnly = false,
}: ThemeSwatchProps): React.JSX.Element => {
  const swatches = useMemo<SwatchItem[]>(
    () => [
      {
        className: `rounded-tl-md ${theme.bg}`,
        textClass: theme.text,
      },
      {
        className: `${theme.secondary}`,
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
          ></div>
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
