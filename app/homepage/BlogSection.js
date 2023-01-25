import Image from 'next/image';
import bgImg from '/public/images/landing-pages/red-bg.png';
import bgImgSm from '/public/images/landing-pages/red-bg-small.png';
import expertImg from '/public/images/landing-pages/expert.png';
import expertImgSm from '/public/images/landing-pages/expert-small.png';
import Link from 'next/link';
import PurpleButton from '@shared/buttons/PurpleButton';

export default function BlogSection() {
  return (
    <div className=" bg-darkPurple text-white py-8 px-10 lg:py-16 text-center my-12 lg:my-16 rounded-xl relative overflow-hidden">
      <div className="relative z-10">
        <div className="lg:w-[50%] mx-auto font-black text-3xl text-left  lg:text-center">
          Check out our blog for articles about running for office, Good Party's
          work, and more.
          <Link href="/blog" className="text-lg mt-11 block">
            <PurpleButton
              id="blog-read-more"
              style={{ backgroundColor: 'white', color: '#46002E' }}
            >
              READ MORE
            </PurpleButton>
          </Link>
        </div>
      </div>
      <Image
        src={bgImg}
        layout="fill"
        className="hidden lg:block object-contain object-left-bottom"
        alt=""
      />

      <Image
        src={bgImgSm}
        layout="fill"
        className="lg:hidden object-contain object-left-bottom"
        alt=""
      />
    </div>
  );
}
