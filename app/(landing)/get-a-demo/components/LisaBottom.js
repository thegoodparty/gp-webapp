import Image from 'next/image'
import lisaImg from 'public/images/landing-pages/lisa.png'
import { BiSolidQuoteAltRight } from 'react-icons/bi'

export default function LisaBottom() {
  return (
    <div className="mt-6 mb-6 md:mb-0">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 text-center">
          <div className="text-4xl text-purple-200 font-extrabold mb-2">
            500+
          </div>
          <div className="text-sm font-sfpro">
            candidates supported with our product nationwide
          </div>
        </div>
        <div className="col-span-4 text-center">
          <div className="text-4xl text-red-500 font-extrabold mb-2">100+</div>
          <div className="text-sm font-sfpro">
            years of campaigning experience at all levels of government
          </div>
        </div>
        <div className="col-span-4 text-center">
          <div className="text-4xl text-blue-500 font-extrabold mb-2">$10</div>
          <div className="text-sm font-sfpro">
            cost to access powerful and affordable features with Pro
          </div>
        </div>
      </div>

      <div className="hidden md:flex mt-10 bg-white px-5 py-6  rounded-lg shadow-lg relative">
        <Image
          src={lisaImg}
          alt="Lisa"
          width={112}
          height={112}
          className=" w-28 h-28 rounded-full"
        />
        <div className="ml-3">
          <div className="font-sfpro leading-relaxed">
            The tools are absolutely amazing. I don&apos;t think I would have
            hit 1,000 votes If y&apos;all hadn&apos;t been there to help out.
          </div>
          <div className="font-sfpro text-purple-400 font-bold mt-2">
            Lisa W., Tennessee
          </div>
        </div>
        <div className="absolute text-purple-400 right-5 bottom-2 text-5xl">
          <BiSolidQuoteAltRight />
        </div>
      </div>
    </div>
  )
}
