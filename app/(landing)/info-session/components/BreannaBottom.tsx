import Image from 'next/image'
import breannaImg from 'public/images/landing-pages/kieryn.png'
import { BiSolidQuoteAltRight } from 'react-icons/bi'

export default function BreannaBottom(): React.JSX.Element {
  return (
    <div className="mt-6 mb-6 md:mb-0">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 text-center">
          <div className="text-4xl text-purple-200 font-extrabold mb-2">
            600+
          </div>
          <div className="text-sm font-sfpro">
            volunteers taking action nationwide
          </div>
        </div>
        <div className="col-span-4 text-center">
          <div className="text-4xl text-red-500 font-extrabold mb-2">200+</div>
          <div className="text-sm font-sfpro">
            candidates at all levels supported
          </div>
        </div>
        <div className="col-span-4 text-center">
          <div className="text-4xl text-blue-500 font-extrabold mb-2">52%</div>
          <div className="text-sm font-sfpro">
            of millennials and Gen-Z are independents
          </div>
        </div>
      </div>

      <div className="hidden md:flex mt-10 bg-white px-5 py-6  rounded-lg shadow-lg relative">
        <Image
          src={breannaImg}
          alt="breanna"
          width={112}
          height={112}
          className=" w-28 h-28 rounded-full"
        />
        <div className="ml-3">
          <div className="font-sfpro leading-relaxed">
            I&apos;m making an actual difference in the political landscape...
            Terry&apos;s win genuinely was inspiring. I felt that win
            personally.
          </div>
          <div className="font-sfpro text-purple-400 font-bold mt-2">
            Kieryn M, Kansas
          </div>
        </div>
        <div className="absolute text-purple-400 right-5 bottom-2 text-5xl">
          <BiSolidQuoteAltRight />
        </div>
      </div>
    </div>
  )
}
