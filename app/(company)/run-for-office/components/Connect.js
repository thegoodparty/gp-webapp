import Image from 'next/image';
import bgImg from '/public/images/landing-pages/red-bg.png';
import expertImg from '/public/images/landing-pages/expert.png';
import expertImgSm from '/public/images/landing-pages/expert-small.png';

export default function Connect() {
  return (
    <div className=" bg-darkPurple text-white pt-16 pb-80 px-6 lg:py-16 flex flex-col items-center justify-center mt-8 rounded-xl relative overflow-hidden">
      <div className="lg:w-[40%] relative z-10">
        <h3 className="font-black text-3xl">
          Connect with a Good Party expert
        </h3>
        <div className="italic text-lg mt-3">
          Join us for a quick call to learn more about how Good Party can help
          you run a better independent campaign.
        </div>
        <div className="italic text-lg mt-3 flex">
          <div>Get Started</div>
          <div>input here</div>
        </div>
      </div>
      <Image
        src={bgImg}
        layout="fill"
        className="object-contain object-left-bottom"
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
      {/* <div className="relative h-[50%] w-full lg:hidden">
        <Image
          src={expertImgSm}
          layout="fill"
          className="object-contain object-left-bottom lg:ml-12"
          alt=""
        />
      </div> */}
    </div>
  );
}
