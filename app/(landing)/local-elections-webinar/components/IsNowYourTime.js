import Image from 'next/image';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import {
  AcademyModalSignUpButton
} from '../../academy/components/AcademySignUpModal/AcademyModalSignUpButton';

const IsNowYourTime = () => (
  <section className="px-8 py-9">
    <Image
      className="w-12 h-12 ml-auto mr-8"
      src="/images/landing-pages/star.svg"
      alt="stars"
      width={108}
      height={108}
    />
    <h2 className="text-3xl font-semibold leading-9 mb-8">
      70% of local elections <br />
      are uncontested... <br />
      is now your time?
    </h2>
    <h6 className="mb-8 text-lg">Receive help from experts answering</h6>
    <ul className="text-lg mb-20">
      <li>What office should I run for?</li>
      <li>What are the requirements?</li>
      <li>What's the "why" of my candidacy?</li>
      <li>How do I talk to people and get votes?</li>
      <li>How do I organize volunteers?</li>
    </ul>
    <AcademyModalSignUpButton>
      <SecondaryButton className="!bg-lime-400 border-none rounded-none text-sm mb-8">Register now</SecondaryButton>
    </AcademyModalSignUpButton>
    <Image className="w-full" src="/images/landing-pages/elected-leaders.png" alt="people" width={589} height={496} />
  </section>
);

export default IsNowYourTime;
