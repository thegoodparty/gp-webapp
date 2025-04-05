'use client'

import { Fragment } from 'react'
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md'

// options: [{ key: string, label: string }]

export default function RadioList({ options, selected, selectCallback }) {
  function handleKeyPress(e, option) {
    if (e.key === 'Enter' || e.key === ' ') {
      selectCallback(option.key)
    }
  }

  return (
    <>
      {options.map((option) => (
        <Fragment key={option.key}>
          {selected === option.key ? (
            <div
              role="radio"
              tabIndex={0}
              key={option.key}
              className="mb-4 flex items-center  py-4 px-6 rounded-lg  p-4 cursor-pointer bg-tertiary-main"
              onClick={() => selectCallback(option.key)}
              onKeyDown={(e) => handleKeyPress(e, option)}
            >
              <MdRadioButtonChecked className="text-white" size={22} />
              <div className="ml-2 text-white">{option.label}</div>
            </div>
          ) : (
            <div
              role="radio"
              tabIndex={0}
              key={option.key}
              className="mb-4 flex items-center  py-4 px-6 rounded-lg  p-4 cursor-pointer border border-gray-300"
              onClick={() => selectCallback(option.key)}
              onKeyDown={(e) => handleKeyPress(e, option)}
            >
              <MdRadioButtonUnchecked size={22} />
              <div className="ml-2">{option.label}</div>
            </div>
          )}
        </Fragment>
      ))}
    </>
  )
}
