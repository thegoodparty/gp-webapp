import PurpleButton from '@shared/buttons/PurpleButton';
import EmailForm from '@shared/inputs/EmailForm';
import Image from 'next/image';
import Link from 'next/link';
import candidatesImg from 'public/images/landing-pages/about-candidates.png';
import votersImg from 'public/images/landing-pages/about-voters.png';

export default function ForSection() {
  return (
    <section className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-6">
        <div className="grid flex-row-reverse gap-2 grid-cols-12 items-end min-h-[150px]">
          <div className="col-span-12 lg:col-span-6 text-right lg:order-last">
            <Image
              src={candidatesImg}
              blur
              className="inline-block max-w-[220px]"
            />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <h2 className="font-black text-4xl mb-4">For candidates</h2>
          </div>
        </div>
        <div className="text-xl my-6">
          Imagined running for office but not into Republicans or Democrats? We
          can help! Get access to free campaign tools and our team's expertise
          to start or level-up your candidacy.
        </div>
        <Link href="/run-for-office">
          <PurpleButton>
            <div className="leading-relaxed">GET STARTED</div>
          </PurpleButton>
        </Link>
      </div>
      <div className="col-span-12 lg:col-span-6">
        <div className="grid flex-row-reverse gap-2 grid-cols-12 items-end  min-h-[150px]">
          <div className="col-span-12 lg:col-span-6 text-right lg:order-last">
            <Image
              src={votersImg}
              blur
              className="inline-block max-w-[240px]"
            />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <h2 className="font-black text-4xl mb-4">For Voters</h2>
          </div>
        </div>
        <div className="text-xl my-6">
          Join the movement to change politics for good! Discover independent
          and third-party candidates who align with your values and are
          committed to fighting for the issues that matter to you, not corporate
          and special interest groups.
        </div>
        <EmailForm
          formId="5d84452a-01df-422b-9734-580148677d2c"
          pageName="About Page"
          labelId="subscribe-form-about"
        />
      </div>
    </section>
  );
}
