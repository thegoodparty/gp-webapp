'use client'
import { useState } from 'react'
import { dateWithTime } from 'helpers/dateHelper'
import { IoIosArrowDown } from 'react-icons/io'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import { Button } from '@mui/material'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

interface Version {
  date: string
  name?: string
  key?: string
  language?: string
  text?: string
  inputValues?: Partial<Record<string, string>>
}

interface PlanVersionProps {
  versions: Version[]
  updatePlanCallback: (version: Version | null) => void
  latestVersion: Version | null
}

export default function PlanVersion({
  versions,
  updatePlanCallback,
  latestVersion,
}: PlanVersionProps) {
  const [showMenu, setShowMenu] = useState(false)
  if (!versions) {
    return null
  }

  function handleVersionClick(version: Version | null) {
    trackEvent(EVENTS.ContentBuilder.Editor.SelectVersion, {
      name: version?.name,
      key: version?.key,
    })
    updatePlanCallback(version)
  }

  return (
    <div className="flex justify-center relative">
      <div
        onClick={() => {
          trackEvent(EVENTS.ContentBuilder.Editor.OpenVersionPicker)
          setShowMenu(!showMenu)
        }}
      >
        <SecondaryButton size="medium">
          <div className="flex items-center whitespace-nowrap">
            Version &nbsp;
            <IoIosArrowDown className="text-sm" />
          </div>
        </SecondaryButton>
      </div>

      {showMenu && (
        <>
          <div
            className="fixed h-screen w-screen top-14 left-0"
            onClick={() => {
              setShowMenu(false)
            }}
          />

          <div className="absolute flex flex-col z-50 right-0 min-w-[270px] h-auto bg-primary-dark text-gray-300 rounded-xl shadow-md transition">
            <Button
              key="latest"
              onClick={() => {
                setShowMenu(false)
                handleVersionClick(latestVersion)
              }}
            >
              <span className="text-gray-300 hover:text-slate-50 no-underline font-normal normal-case hover:bg-primary-dark-dark w-full rounded-xl p-3">
                <div className="whitespace-nowrap text-lg flex items-center w-full">
                  <div className="ml-3 font-sfpro text-slate-50 text-[17px]">
                    Latest Version
                  </div>
                </div>
              </span>
            </Button>

            {versions.map((version) => (
              <Button
                key={version.date}
                onClick={() => {
                  setShowMenu(false)
                  handleVersionClick(version)
                }}
              >
                <span className="text-gray-300 hover:text-slate-50 no-underline font-normal normal-case hover:bg-primary-dark-dark w-full rounded-xl p-3">
                  <div className="whitespace-nowrap text-lg flex items-center w-full">
                    <div className="ml-3 font-sfpro text-slate-50 text-[17px]">
                      {dateWithTime(version.date)}{' '}
                      {version?.language &&
                        version.language !== 'English' &&
                        `(${version.language})`}
                    </div>
                  </div>
                </span>
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
