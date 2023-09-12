'use client';
import Image from 'next/image';
import MaxWidth from '@shared/layouts/MaxWidth';
import { AiOutlineCalendar } from 'react-icons/ai';
import WarningButton from '@shared/buttons/WarningButton';
import Link from 'next/link';

export default function ElectionDates(props) {
  return (
    <div className="bg-indigo-800 py-10">
      <MaxWidth>
        <div className="grid grid-cols-12 md:justify-items-center  bg-indigo-800">
          <div className="col-span-12 lg:col-span-8  w-full">
            <div className="flex flex-col w-full h-auto border-slate-50 border-[2px] rounded-2xl p-10">
              <div className="flex flex-row items-center mx-auto w-full text-slate-50 text-2xl">
                <AiOutlineCalendar />
                <span className="ml-2">Upcoming elections and dates</span>
              </div>
              <div className="flex flex-col w-full h-auto mt-5">
                <hr class="bg-slate-50 border-[1px]"></hr>
              </div>
              <div className="flex w-full h-auto mt-5 text-slate-50 text-lg items-center">
                7/10
                <span className="ml-3">Durham Early voting registration</span>
              </div>
              <div className="flex w-full h-auto mt-5 text-slate-50 text-lg items-center">
                10/10
                <span className="ml-3">Durham Municipal primary election</span>
              </div>
              <div className="flex w-full h-auto mt-5 text-slate-50 text-lg items-center">
                11/7
                <span className="ml-3">Durham General election</span>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 p-10 w-full h-full">
            <div className="flex flex-col w-full h-full items-center justify-center">
              <a
                href="https://www.ncsbe.gov/registering/how-register"
                target="_blank"
              >
                <WarningButton>How do I vote?</WarningButton>
              </a>
            </div>
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
