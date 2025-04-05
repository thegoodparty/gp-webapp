import { AcademyModalSignUpButton } from '../../academy/components/AcademySignUpModal/AcademyModalSignUpButton'
import PrimaryButton from '@shared/buttons/PrimaryButton'

const KickTheTires = () => (
  <section className="bg-secondary text-center px-4 pt-8 pb-20">
    <h2 className="text-3xl mb-5 md:text-4xl">
      Kick the tires on a run <br />
      for local office
    </h2>
    <p className="mb-8 max-w-[372px] mx-auto">
      Join us to kick off your journey to making a difference in your community
      in elected office.
    </p>
    <AcademyModalSignUpButton>
      <PrimaryButton className="!bg-primary-dark border-none w-full text-sm md:w-auto md:text-base">
        Register now
      </PrimaryButton>
    </AcademyModalSignUpButton>
  </section>
)

export default KickTheTires
