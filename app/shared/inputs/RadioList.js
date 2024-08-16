'use client';

import { Fragment } from 'react';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';

// options: [{ key: string, label: string }]

export default function RadioList({
  options,
  selected,
  selectCallback,
}) {
  

  return (
    <>
      {options.map((option) => (
        <Fragment key={option.key}>
          {selected === option.key ? (
            <div
              key={option.key}
              className="mb-4 flex items-center  py-4 px-6 rounded-lg  p-4 cursor-pointer bg-tertiary-main text-white"
              onClick={() => selectCallback(option.key)}
            >
              <MdRadioButtonChecked size={22} />
              <div className="ml-2">{option.label}</div>
            </div>
          ) : (
            <div
              key={option.key}
              className="mb-4 flex items-center  py-4 px-6 rounded-lg  p-4 cursor-pointer border border-gray-300"
              onClick={() => selectCallback(option.key)}
            >
              <MdRadioButtonUnchecked size={22} />
              <div className="ml-2">{option.label}</div>
            </div>
          )}
        </Fragment>
      ))}
    </>
  );
}
