import Image from 'next/image'
import CTA from './CTA'
import kierynImg from 'public/images/landing-pages/kieryn-small.png'
import lisaImg from 'public/images/landing-pages/lisa.png'
import desyiahImg from 'public/images/landing-pages/desyiah.png'
import { BiSolidQuoteAltRight } from 'react-icons/bi'

const cards = [
  {
    content:
      "I'm making an actual difference in the political landscape... Terry's win genuinely was inspiring. I felt that win personally.",
    name: 'Kieryn McCann, Kansas',
    image: kierynImg,
  },
  {
    content:
      "One really easy way [to help] is to go to GoodParty.org's [website]. That's a great way to reach out to the community and be supportive that way.",
    name: 'Lisa Williams, Tennessee',
    image: lisaImg,
  },
  {
    content:
      'I really identify with the movement GoodParty.org is catalyzing and I really want to be a part of making a change and fighting for more access for voters.',
    name: 'Desyiah L., Colorado',
    image: desyiahImg,
  },
]

export default function FromCommunity() {
  return (
    <section className="bg-[#F7FAFD] md:bg-primary-dark md:pt-20">
      <div className="md:hidden bg-[linear-gradient(176deg,_#0D1528_54.5%,_#F7FAFD_55%)] h-[calc(100vw*0.09)] w-full md:-mt-64" />
      <div className="max-w-screen-xl mx-auto ">
        <div className="bg-[#F7FAFD] relative pt-14 pb-20 px-12 md:rounded-3xl shadow-lg">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6 hidden: md:block">
              <Image
                src="/images/logo/heart.svg"
                alt="GoodParty"
                width={250}
                height={250}
              />
              <h2 className=" text-6xl font-semibold mt-6 mb-12">
                From GoodParty.org&apos;s community
              </h2>
              <CTA id="from community" />
            </div>
            <div className="col-span-12 md:col-span-6 relative">
              <Image
                src="/images/landing-pages/spot-gradient.svg"
                alt="GoodParty"
                fill
                className=" object-contain object-right-top"
              />
              <div className="relative md:-mt-28">
                {cards.map((card) => (
                  <div
                    key={card.name}
                    className="md:flex bg-white rounded-lg shadow-md px-5 pt-7 pb-12 mb-7 relative"
                  >
                    <div className="w-28 h-28 md:w-48 md:h-48">
                      <Image
                        src={card.image}
                        alt={card.name}
                        width={192}
                        height={192}
                      />
                    </div>
                    <div className=" mt-5 md:mt-0 md:pl-5">
                      <div className=" font-sfpro leading-relaxed">
                        {card.content}
                      </div>
                      <div className="text-purple-400 mt-3 font-sfpro font-bold">
                        {card.name}
                      </div>
                    </div>

                    <div className="absolute text-purple-400 right-5 bottom-2 text-5xl">
                      <BiSolidQuoteAltRight />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block bg-[linear-gradient(176deg,_rgba(0,0,0,0)_54.5%,_#F9FAFB_55%)] h-[calc(100vw*0.09)] w-full -mt-64" />
      <div className="hidden md:block h-64 bg-indigo-50"></div>
    </section>
  )
}
