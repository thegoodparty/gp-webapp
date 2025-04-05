import Image from 'next/image'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import { AcademyModalSignUpButton } from '../../academy/components/AcademySignUpModal/AcademyModalSignUpButton'
import MaxWidth from '@shared/layouts/MaxWidth'

const IsNowYourTime = () => (
  <MaxWidth>
    <section className="grid grid-cols-12 md:gap-16 px-8 py-9 lg:px-20 xl:px-4">
      <div className="col-span-12 md:col-span-6">
        <Image
          className="w-12 h-12 ml-auto mr-8 md:w-24 md:h-24 md:mr-20"
          src="/images/landing-pages/star.svg"
          alt="stars"
          width={108}
          height={108}
        />
        <h2 className="text-3xl font-semibold leading-9 mb-8 md:text-6xl">
          70% of local elections <br />
          are uncontested... <br />
          is now your time?
        </h2>
        <h6 className="mb-8 text-lg">Receive help from experts answering</h6>
        <ul className="text-lg mb-20">
          <li>What office should I run for?</li>
          <li>What are the requirements?</li>
          <li>What&apos;s the &quot;why&quot; of my candidacy?</li>
          <li>How do I talk to people and get votes?</li>
          <li>How do I organize volunteers?</li>
        </ul>
        <AcademyModalSignUpButton>
          <SecondaryButton className="!bg-lime-400 border-none rounded-none text-sm mb-8 md:text-lg">
            Register now
          </SecondaryButton>
        </AcademyModalSignUpButton>
      </div>
      <div className="col-span-12 md:col-span-6 md:grid">
        <Image
          className="w-full md:my-auto"
          src="/images/landing-pages/elected-leaders.png"
          alt="people"
          width={589}
          height={496}
        />
      </div>
    </section>
  </MaxWidth>
)

export default IsNowYourTime
