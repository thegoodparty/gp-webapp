import Image from 'next/image'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { AcademyModalSignUpButton } from 'app/(landing)/academy/components/AcademySignUpModal/AcademyModalSignUpButton'

const LocalElectionsHero = (): React.JSX.Element => {
  return (
    <section className="">
      <div
        className="
          grid
          grid-cols-12
          m-4
          bg-gray-200
          rounded-3xl
          px-4
          py-10
          lg:m-8
          lg:px-20
          lg:py-36
        "
      >
        <div className="col-span-12 lg:col-span-5">
          <h5
            className="
              uppercase
              text-tertiary
              text-sm
              font-bold
              leading-6
              tracking-widest
            "
          >
            May 7th at 5pm MST
          </h5>
          <h1
            className="
              text-5xl
              lg:text-7xl
              font-semibold
              leading-none
              my-4
            "
          >
            Webinar: Path <br />
            to Victory
          </h1>
          <h3
            className="
              text-lg
              lg:text-2xl
              font-semibold
              mb-4
            "
          >
            Learn how to run for local office in 2024
          </h3>
          <Image
            className="w-full lg:hidden"
            src="/images/landing-pages/map-w-bubbles.png"
            alt="Map with bubbles"
            width={741}
            height={572}
            priority
          />
          <p className="font-normal mb-4 lg:text-lg">
            Join GoodParty.org and the Forward Party to hear how it&apos;s
            easier than you think to run for local office in 2024. You can be
            the type of leader your community needs.
          </p>
          <AcademyModalSignUpButton>
            <PrimaryButton
              className="mb-6 lg:mb-9"
              id="local-elections-hero-cta"
            >
              Register now
            </PrimaryButton>
          </AcademyModalSignUpButton>
          <h5 className="mb-2.5 text-lg lg:mb-7">Brought to you by:</h5>
          <h6>
            <Image
              className="
                inline
                h-6
                w-6
                mr-2
                align-middle
                lg:w-10
                lg:h-10
              "
              src="/images/logo/heart.svg"
              height={40}
              width={40}
              alt="GoodParty.org Logo"
            />
            <span
              className="
                uppercase
                font-bold
                align-middle
                lg:text-2xl
              "
            >
              GoodParty.org
            </span>
            <span
              className="
                mx-2
                font-thin
                align-middle
                lg:text-3xl
              "
            >
              +
            </span>
            <Image
              className="
                inline
                h-6
                w-6
                mr-2
                text-sm
                align-middle
                lg:w-10
                lg:h-10
              "
              src="/images/parties-logos/fwd-vector-logo.svg"
              height={40}
              width={40}
              alt="FWD Party Logo"
            />
            <span
              className="
                uppercase
                font-semibold
                text-sm
                align-middle
                lg:text-2xl
              "
            >
              Forward Party
            </span>
          </h6>
        </div>
        <div className="col-span-7 hidden lg:grid">
          <Image
            className="my-auto"
            src="/images/landing-pages/map-w-bubbles.png"
            alt="Map with bubbles"
            width={741}
            height={572}
            priority
          />
        </div>
      </div>
    </section>
  )
}

export default LocalElectionsHero
