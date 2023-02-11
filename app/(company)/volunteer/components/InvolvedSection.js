import Image from 'next/image';
import bgImg from '/public/images/landing-pages/red-bg.png';
import bgImgSm from '/public/images/landing-pages/red-bg-small.png';
import MaxWidth from '@shared/layouts/MaxWidth';
import EmailFormBanner from '@shared/inputs/EmailFormBanner';

export default function InvolvedSection() {
  return (
    <MaxWidth>
      <div className=" bg-darkPurple text-white py-8 px-10 lg:py-16 text-center my-12 lg:my-16 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="lg:w-[80%] mx-auto font-black text-3xl text-left  lg:text-center">
            Got any questions about getting involved? Take the next step!
            <div className="text-lg mt-3 lg:w-[60%] mx-auto font-normal italic text-center">
              Find a time to talk to our team. We'll share our theory of change,
              learn about your skills and interests, and discuss open volunteer
              opportunities.
            </div>
            <div className="text-lg mt-3 lg:w-1/2 mx-auto">
              <EmailFormBanner
                formId="c7d78873-1ed0-4202-ab01-76577e57352c"
                pageName="volunteer"
              />
            </div>
          </div>
        </div>
        <Image
          src={bgImg}
          sizes="100vw"
          fill
          className="hidden lg:block object-contain object-left-bottom"
          alt=""
        />

        <Image
          src={bgImgSm}
          sizes="100vw"
          fill
          className="lg:hidden object-contain object-left-bottom"
          alt=""
        />
      </div>
    </MaxWidth>
  );
}
