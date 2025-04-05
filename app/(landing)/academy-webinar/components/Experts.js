import MaxWidth from '@shared/layouts/MaxWidth'
import Body1 from '@shared/typography/Body1'
import MarketingH2 from '@shared/typography/MarketingH2'
import Image from 'next/image'
import JaredImg from 'public/images/landing-pages/expert-jared.png'
import RobImg from 'public/images/landing-pages/expert-rob.png'

const experts = [
  {
    name: 'Jared Alper',
    role: 'Politics',
    desc: 'Jared is a political strategist who has managed or served in senior strategic roles on over a dozen campaigns for US Senate, US House, state legislative and local offices across the United States.',
    img: JaredImg,
  },
  {
    name: 'Rob Booth',
    role: 'Mobilization',
    desc: "Rob has nearly 20 years of experience running and winning over 150 electoral, legislative, and ballot campaigns. He has organized everything from local races to presidential campaigns, helped pioneer deep-canvassing during the marriage equality movement, and helped build RepresentUs' volunteer network from the ground up. Rob also led several successful ballot measure efforts as the National Field Director at RepresentUs.",
    img: RobImg,
  },
]

export default function Experts() {
  return (
    <>
      <div className="bg-primary-dark text-white text-center pt-20 lg:pt-44">
        <MaxWidth>
          <MarketingH2>Our campaigning experts</MarketingH2>
          <div className="pt-24 grid grid-cols-12 gap-5 lg:gap-12">
            {experts.map((expert) => (
              <div
                className="col-span-12 md:col-span-6 h-full"
                key={expert.name}
              >
                <div className="rounded-xl overflow-hidden relative bg-primary-dark-dark mx-8 h-full">
                  <Image
                    src={expert.img}
                    alt={expert.name}
                    className="object-contain"
                  />
                  <div className="p-10">
                    <h3 className="text-5xl">{expert.name}</h3>
                    <h4 className="text-3xl mt-6">{expert.role}</h4>
                    <Body1 className="mt-8 text-slate-200 text-left">
                      {expert.desc}
                    </Body1>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MaxWidth>
      </div>
      <div className="bg-[linear-gradient(176deg,_#0D1528_54.5%,_rgba(0,0,0,0)_55%)] h-[calc(100vw*0.09)] w-full" />
    </>
  )
}
