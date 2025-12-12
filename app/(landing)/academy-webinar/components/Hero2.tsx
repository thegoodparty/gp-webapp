import MaxWidth from '@shared/layouts/MaxWidth'
import Image from 'next/image'
import webinarImg from 'public/images/landing-pages/elected-leaders.png'
import MarketingH2 from '@shared/typography/MarketingH2'
import WarningButton from '@shared/buttons/WarningButton'
import { AcademyModalSignUpButton } from '../../academy/components/AcademySignUpModal/AcademyModalSignUpButton'

interface Hero2Props {
  content: {
    hero2Desc: string
  }
}

const Hero2 = ({ content }: Hero2Props): React.JSX.Element => (
  <MaxWidth>
    <div className="grid grid-cols-12 gap-8 mt-24 md:mt-48">
      <div className="col-span-12 md:col-span-6">
        <div className="text-right">
          <Image
            src="/images/landing-pages/star.svg"
            width={100}
            height={100}
            alt="Elected leaders"
            className="inline-block"
          />
        </div>
        <MarketingH2>
          Turning community leaders into elected officials
        </MarketingH2>
        <div className="my-12 text-xl">
          {content.hero2Desc}
          <br />
          <br />
          <ul>
            <li>Free and easy</li>
            <li>Practical skills &amp; real-world insights</li>
            <li>On demand</li>
          </ul>
        </div>
        <div className="flex items-center">
          <AcademyModalSignUpButton>
            <WarningButton id="hero2-reserve-cta">
              Sign Up For Free
            </WarningButton>
          </AcademyModalSignUpButton>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6 relative min-h-[350px] mt-12 md:mt-0">
        <Image
          src={webinarImg}
          sizes="(max-width: 768px) 50vw, 100vw"
          fill
          alt="Elected leaders"
          className="object-contain object-center "
        />
      </div>
    </div>
  </MaxWidth>
)

export default Hero2
