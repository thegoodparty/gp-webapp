import Image from 'next/image';
import bgImg from '/public/images/landing-pages/red-bg.png';
import bgImgSm from '/public/images/landing-pages/red-bg-small.png';
import expertImg from '/public/images/landing-pages/expert.png';
import expertImgSm from '/public/images/landing-pages/expert-small.png';
import EmailForm2 from './EmailForm2';

export default function Connect() {
  return (
    <div
      id="connect"
      className=" bg-darkPurple text-white pt-16 pb-80 px-6 lg:py-16 flex flex-col items-center justify-center mt-8 rounded-xl relative overflow-hidden"
    >
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
            <EmailForm2 />
          </div>
        </div>
      </div>
      <Image
        src={bgImg}
        layout="fill"
        className="hidden lg:block object-contain object-left-bottom"
        alt=""
      />
      <div className="hidden lg:block">
        <Image
          src={expertImg}
          layout="fill"
          className="object-contain object-left-bottom lg:ml-20"
          alt=""
        />
      </div>
      <Image
        src={bgImgSm}
        layout="fill"
        className="lg:hidden object-contain object-left-bottom"
        alt=""
      />
      <div className="absolute left-0 bottom-0 h-60 w-full lg:hidden">
        <Image
          src={expertImgSm}
          layout="fill"
          className="object-contain object-left-bottom"
          alt=""
        />
      </div>
      <div className="absolute bottom-4 right-4 lg:hidden italic text-lg flex flex-col items-end">
        <div className="mr-2 mb-2">Get Started!</div>
        <div>
          <EmailForm2 />
        </div>
      </div>
    </div>
  );
}
