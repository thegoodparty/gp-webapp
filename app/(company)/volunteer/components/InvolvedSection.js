import Image from 'next/image';
import bgImg from '/public/images/landing-pages/red-bg.png';
import bgImgSm from '/public/images/landing-pages/red-bg-small.png';
import MaxWidth from '@shared/layouts/MaxWidth';
import EmailFormBanner from '@shared/inputs/EmailFormBanner';
import RedPurpleSection from '@shared/landing-pages/RedPurpleSection';

export default function InvolvedSection() {
  return (
    <MaxWidth>
      <RedPurpleSection>
        <div className="relative z-20">
          <div className="lg:w-[80%] mx-auto font-black text-3xl text-left  lg:text-center">
            Got any questions about getting involved? Take the next step!
            <div className="text-lg mt-3 lg:w-[60%] mx-auto font-normal italic text-center">
              Find a time to talk to our team. We&apos;ll share our theory of
              change, learn about your skills and interests, and discuss open
              volunteer opportunities.
            </div>
            <div className="text-lg mt-3 lg:w-1/2 mx-auto">
              <EmailFormBanner
                formId="c7d78873-1ed0-4202-ab01-76577e57352c"
                pageName="volunteer"
              />
            </div>
          </div>
        </div>
      </RedPurpleSection>
    </MaxWidth>
  );
}
