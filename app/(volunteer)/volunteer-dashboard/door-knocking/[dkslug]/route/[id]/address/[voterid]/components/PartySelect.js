'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import Modal from '@shared/utils/Modal';
import { useState } from 'react';
import { FaCirclePlus } from 'react-icons/fa6';
import independentLogo from '/public/images/parties-logos/independent.png';
import libertarianLogo from '/public/images/parties-logos/libertarian-logo.png';
import fwdLogo from '/public/images/parties-logos/fwd-logo.png';
import greedLogo from '/public/images/parties-logos/green-logo.png';
import demLogo from '/public/images/parties-logos/democratic-logo.png';
import repLogo from '/public/images/parties-logos/republican-logo.png';
import Image from 'next/image';

const parties = [
  {
    name: 'Independent',
    logo: independentLogo,
    wide: true,
  },
  { name: 'Libertarian', logo: libertarianLogo },
  { name: 'Forward', logo: fwdLogo },
  { name: 'Green', logo: greedLogo },
  { name: 'Democratic', logo: demLogo },
  { name: 'Republican', logo: repLogo },
];

export default function PartySelect({ surveyKey, initialValue, onChange }) {
  const [value, setValue] = useState(initialValue);
  const [showInput, setShowInput] = useState(false);
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleSave = () => {
    if (onChange) {
      setShowInput(false);
      onChange(surveyKey, value);
    }
  };

  return (
    <>
      <Modal
        open={showInput}
        closeCallback={() => {
          setShowInput(false);
        }}
      >
        <div className="mt-4 min-w-[80vw]">
          <div className="grid grid-cols-12 gap-4">
            {parties.map((party) => (
              <div
                key={party.name}
                className={`col-span-6 ${party.wide ? '' : 'lg:col-span-6'}`}
              >
                <div
                  className={`border-2  rounded-lg p-3 flex flex-col items-center h-full group cursor-pointer hover:border-black transition-colors ${
                    party.name === value ? 'border-black' : 'border-slate-200'
                  }`}
                  onClick={() => {
                    setValue(party.name);
                  }}
                >
                  <Image
                    alt={party.name}
                    src={party.logo}
                    className={`mb-4 h-8  transition-all group-hover:grayscale-0 ${
                      party.name === value ? 'grayscale-0' : 'grayscale'
                    }`}
                    height={32}
                  />
                  <div
                    className={` group-hover:text-primary transition-colors text-center text-sm ${
                      party.name === value ? 'text-primary' : 'text-indigo-300'
                    }`}
                  >
                    {party.label || party.name}
                  </div>
                </div>
              </div>
            ))}
            <div className="col-span-12">
              <div
                className={`border-2  rounded-lg py-4 flex flex-col items-center h-full group cursor-pointer hover:border-black transition-colors ${
                  value === 'other'
                    ? 'border-black bg-yellow-200'
                    : 'border-slate-200'
                }`}
                onClick={() => {
                  setValue('other');
                }}
              >
                <div
                  className={` group-hover:text-primary transition-colors text-center text-sm ${
                    value === 'other' ? 'text-primary' : 'text-indigo-300'
                  }`}
                >
                  Other/Unknown
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <PrimaryButton fullWidth onClick={handleSave}>
              Save
            </PrimaryButton>
          </div>
        </div>
      </Modal>
      {value ? (
        <>
          <div className="py-2 px-4 text-sm  rounded-lg border border-slate-300 bg-yellow-50">
            {value}
          </div>
          <div
            className="mt-2 text-sm underline cursor-pointer"
            onClick={() => {
              setShowInput(true);
            }}
          >
            Change
          </div>
        </>
      ) : (
        <PrimaryButton
          fullWidth
          variant="outlined"
          onClick={() => {
            setShowInput(true);
          }}
        >
          <div className="flex items-center">
            <FaCirclePlus />
            <div className="ml-2">Add</div>
          </div>
        </PrimaryButton>
      )}
    </>
  );
}
