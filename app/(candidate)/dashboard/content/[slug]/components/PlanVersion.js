'use client';
import { useState } from 'react';
import { dateWithTime } from 'helpers/dateHelper';
import { IoIosArrowDown } from 'react-icons/io';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import { Button } from '@mui/material';

export default function PlanVersion({
  versions,
  updatePlanCallback,
  latestVersion,
}) {
  const [showMenu, setShowMenu] = useState(false);
  if (!versions) {
    return null;
  }

  return (
    <div className="flex justify-center relative">
      <div
        onClick={() => {
          setShowMenu(!showMenu);
        }}
      >
        <SecondaryButton size="medium">
          <div className="flex items-center whitespace-nowrap p-1">
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
              setShowMenu(false);
            }}
          />

          <div className="absolute flex flex-col z-50 right-0 min-w-[270px] h-auto bg-primary text-gray-800 rounded-xl shadow-md transition">
            <Button
              key="latest"
              onClick={() => {
                setShowMenu(false);
                updatePlanCallback(latestVersion);
              }}
            >
              <span className="text-gray-800 hover:text-slate-50 no-underline font-normal normal-case hover:bg-indigo-700 w-full rounded-xl p-3">
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
                  setShowMenu(false);
                  updatePlanCallback(version);
                }}
              >
                <span className="text-gray-800 hover:text-slate-50 no-underline font-normal normal-case hover:bg-indigo-700 w-full rounded-xl p-3">
                  <div className="whitespace-nowrap text-lg flex items-center w-full">
                    <div className="ml-3 font-sfpro text-slate-50 text-[17px]">
                      {dateWithTime(version.date)}
                    </div>
                  </div>
                </span>
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
