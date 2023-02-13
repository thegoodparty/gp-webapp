import Image from 'next/image';
import bgImg from '/public/images/landing-pages/red-bg.png';
import bgImgSm from '/public/images/landing-pages/red-bg-small.png';
import expertImg from '/public/images/landing-pages/expert.png';
import expertImgSm from '/public/images/landing-pages/expert-small.png';
import EmailFormBanner from '@shared/inputs/EmailFormBanner';
import RedPurpleSection from '@shared/landing-pages/RedPurpleSection';

export default function Connect() {
  return (
    <div id="connect">
      <RedPurpleSection>
        <div className="lg:w-[50%] lg:left-[15%]  relative z-10">
          <h3 className="font-black text-3xl">
            Connect with a Good Party expert
          </h3>
          <div className="italic text-lg mt-3">
            Join us for a quick call to learn more about how Good Party can help
            you run a better independent campaign.
          </div>
          <div className="hidden lg:flex italic text-lg mt-3 items-center">
            <div className="mr-4">Get Started!</div>
            <div>
              <EmailFormBanner
                pageName="run for office"
                formId="46116311-525b-42a2-b88e-d2ab86f26b8a"
              />
            </div>
          </div>
        </div>

        <div className="hidden lg:block z-10">
          <Image
            src={expertImg}
            sizes="100vw"
            fill
            className="object-contain object-left-bottom lg:ml-20"
            alt=""
          />
        </div>
        <div className="absolute left-0 bottom-0 h-60 w-full lg:hidden  z-10">
          <Image
            src={expertImgSm}
            sizes="100vw"
            fill
            className="object-contain object-left-bottom"
            alt=""
          />
        </div>
        <div className="absolute bottom-4 right-4 lg:hidden italic text-lg flex flex-col items-end  z-10">
          <div className="mr-2 mb-2">Get Started!</div>
          <div>
            <EmailFormBanner
              pageName="run for office"
              formId="46116311-525b-42a2-b88e-d2ab86f26b8a"
            />
          </div>
        </div>
      </RedPurpleSection>
    </div>
  );
}
