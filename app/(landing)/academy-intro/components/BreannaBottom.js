import Image from 'next/image'
import breannaImg from 'public/images/landing-pages/breanna2.png'
import { BiSolidQuoteAltRight } from 'react-icons/bi'

export default function BreannaBottom() {
  return (
    <div className="mt-6 mb-6 md:mb-0">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 text-center">
          <div className="text-4xl text-purple-200 font-extrabold mb-2">
            200+
          </div>
          <div className="text-sm font-sfpro">
            candidates supported nationwide
          </div>
        </div>
        <div className="col-span-4 text-center">
          <div className="text-4xl text-red-500 font-extrabold mb-2">50+</div>
          <div className="text-sm font-sfpro">
            years of campaigning experience
          </div>
        </div>
        <div className="col-span-4 text-center">
          <div className="text-4xl text-blue-500 font-extrabold mb-2">3</div>
          <div className="text-sm font-sfpro">
            90-minute sessions to start your journey
          </div>
        </div>
      </div>

      <div className="hidden md:flex mt-10 bg-white px-5 py-6  rounded-lg shadow-lg relative">
        <Image
          src={breannaImg}
          alt="breanna"
          width={112}
          height={112}
          className=" w-28 h-28"
        />
        <div className="ml-3">
          <div className="font-sfpro leading-relaxed">
            GoodParty.org Academy is a good place to go if you&apos;ve been
            thinking about running for office. It&apos;s a great place to start
            and win.
          </div>
          <div className="font-sfpro text-purple-400 font-bold mt-2">
            Breanna S., Nashville
          </div>
        </div>
        <div className="absolute text-purple-400 right-5 bottom-2 text-5xl">
          <BiSolidQuoteAltRight />
        </div>
      </div>
    </div>
  )
}
