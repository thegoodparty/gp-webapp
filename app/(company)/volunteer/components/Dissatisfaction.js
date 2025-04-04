import MaxWidth from '@shared/layouts/MaxWidth'
import Image from 'next/image'
import megaphoneImg from 'public/images/landing-pages/megaphone.png'
import CTA from './CTA'

export default function Dissatisfaction() {
  return (
    <section className="bg-indigo-200">
      <MaxWidth>
        <div className="grid grid-cols-12 gap-6">
          <div className=" col-span-12 md:col-span-6">
            <h2 className="text-3xl md:text-5xl font-semibold mb-2">
              Turn dissatisfaction into action
            </h2>
            <div className="mb-12 text-lg font-sfpro">
              Turn doom-scrolling into real action to fix our broken system. Get
              in on the ground floor of upstart independent campaigns that need
              talented and passionate volunteers. You&apos;ll connect with real
              people, learn new skills, and make a real impact in winnable
              races.
            </div>
            <CTA id="cta-dissatisfaction" />
          </div>
          <div className=" col-span-12 md:col-span-6 flex justify-center">
            <Image
              src={megaphoneImg}
              alt="megaphone"
              width={560}
              height={557}
            />
          </div>
        </div>
      </MaxWidth>
    </section>
  )
}
