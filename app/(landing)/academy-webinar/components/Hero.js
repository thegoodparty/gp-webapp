import MaxWidth from '@shared/layouts/MaxWidth'
import MarketingH1 from '@shared/typography/MarketingH1'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import Image from 'next/image'
import webinarImg from 'public/images/landing-pages/webinar-hero.png'
import { AcademyModalSignUpButton } from '../../academy/components/AcademySignUpModal/AcademyModalSignUpButton'

const Hero = ({ content }) => (
  <MaxWidth>
    <div className="grid grid-cols-12 gap-6 mt-20">
      <div className="col-span-12 md:col-span-6">
        <MarketingH1>
          GoodParty.org Academy - Learn how to run for office
        </MarketingH1>
        <div className="my-8 text-xl">{content.heroDesc}</div>
        <AcademyModalSignUpButton>
          <PrimaryButton id="hero-cta">Sign up for free</PrimaryButton>
        </AcademyModalSignUpButton>
      </div>
      <div className="col-span-12 md:col-span-6 relative min-h-[300px] mt-12 md:mt-0">
        <Image
          src={webinarImg}
          sizes="(max-width: 768px) 50vw, 100vw"
          fill
          alt="helping independents run and win"
          className="object-contain object-center "
          priority
        />
      </div>
    </div>
  </MaxWidth>
)
export default Hero
