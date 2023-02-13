import Image from 'next/image';
import bgImg from '/public/images/landing-pages/red-bg.png';
import bgImgSm from '/public/images/landing-pages/red-bg-small.png';
import expertImg from '/public/images/landing-pages/expert.png';
import expertImgSm from '/public/images/landing-pages/expert-small.png';
import EmailFormBanner from '@shared/inputs/EmailFormBanner';

export default function RedPurpleSection({ children }) {
  return (
    <section className=" bg-darkPurple text-white pt-16 pb-80 px-6 lg:py-16 flex flex-col items-center justify-center mt-8 rounded-xl relative overflow-hidden">
      {children}
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
    </section>
  );
}
