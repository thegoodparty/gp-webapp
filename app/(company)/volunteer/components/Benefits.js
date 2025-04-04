import MaxWidth from '@shared/layouts/MaxWidth'
import Image from 'next/image'
import levelImg from 'public/images/landing-pages/levelup.png'
import networkingImg from 'public/images/landing-pages/networking.png'
import perksImg from 'public/images/landing-pages/perks.png'
import impactImg from 'public/images/landing-pages/impact.png'
import CTA from './CTA'

const points = [
  {
    title: 'Level up',
    desc: 'Learn new skills, from grassroots campaigning to cutting-edge AI tools.',
    image: levelImg,
  },
  {
    title: 'Networking',
    desc: 'Connect with a broad spectrum of professionals, from political analysts to independent candidates.',
    image: networkingImg,
  },
  {
    title: 'Fun perks',
    desc: 'Access to exciting merch, exclusive events and workshops, spotlight features, and more!',
    image: perksImg,
  },
  {
    title: 'Real Impact',
    desc: "We won't waste your time. Take simple, meaningful actions that will put our country back on track.",
    image: impactImg,
  },
]

export default function Benefits() {
  return (
    <section className="bg-primary-dark text-gray-50">
      <MaxWidth>
        <h2 className="text-3xl md:text-5xl font-semibold md:text-center pt-16 pb-16 md:pb-20">
          Benefits of volunteering
        </h2>
        <div className="grid grid-cols-12 gap-8 ">
          {points.map((point) => (
            <div
              key={point.title}
              className="col-span-6 md:col-span-3 text-center"
            >
              <div className="px-5">
                <Image src={point.image} alt={point.title} />
                <h4 className="my-7 text-2xl md:text-3xl">{point.title}</h4>
                <div className=" font-sfpro md:text-lg leading-relaxed">
                  {point.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="py-12 text-center">
          <CTA id="cta-benefits" />
        </div>
      </MaxWidth>
    </section>
  )
}
