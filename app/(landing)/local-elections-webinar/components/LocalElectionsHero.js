import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import {
  AcademyModalSignUpButton
} from '../../academy/components/AcademySignUpModal/AcademyModalSignUpButton';

const LocalElectionsHero = () => {
  return <MaxWidth>
    <section className="my-4 bg-gray-200 rounded-3xl px-4 py-10">
      <h5 className="uppercase text-tertiary text-sm font-bold leading-6 tracking-widest">May 7th at 5pm MST</h5>
      <h1 className="text-5xl font-semibold leading-none my-4">Webinar: Path <br />to Victory</h1>
      <h3 className="text-lg font-semibold mb-4">Learn how to run for local office in 2024</h3>
      <Image className="w-full" src="/images/landing-pages/map-w-bubbles.png" alt="Map with bubbles" width={741} height={572} />
      <p className="font-normal mb-4">Join Good Party and the Forward Party to hear how it's easier than you think to run for local office in 2024. You can be the type of leader your community needs.</p>
      <AcademyModalSignUpButton>
        <PrimaryButton className="mb-6" id="local-elections-hero-cta">Register now</PrimaryButton>
      </AcademyModalSignUpButton>
      <h5 className="mb-2.5">Brought to you by:</h5>
      <h6><Image
        className="inline h-6 w-6 mr-2 align-middle"
        src="/images/heart-hologram.svg"
        height={40}
        width={40}
        alt="Good Party Logo"/><span className="uppercase font-bold align-middle">Good Party</span><span className="mx-2 font-thin align-middle">+</span><Image
        className="inline h-6 w-6 mr-2 text-sm align-middle"
        src="/images/parties-logos/fwd-logo-transparent.png"
        height={40}
        width={40}
        alt="FWD Party Logo"/><span className="uppercase font-semibold text-sm align-middle">Forward Party</span></h6>
    </section>
  </MaxWidth>
}

export default LocalElectionsHero;
