'use client'

import { Fragment } from 'react'
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md'

interface RadioOption {
  key: string
  label: string
}

interface RadioListProps {
  options: RadioOption[]
  selected: string
  selectCallback: (key: string) => void
}

const RadioList = ({
  options,
  selected,
  selectCallback,
}: RadioListProps): React.JSX.Element => {
  const handleKeyPress = (
    e: React.KeyboardEvent,
    option: RadioOption,
  ): void => {
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

export default RadioList
