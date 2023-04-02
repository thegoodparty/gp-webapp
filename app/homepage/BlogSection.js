import Image from 'next/image';
import bgImg from '/public/images/landing-pages/red-bg.png';
import bgImgSm from '/public/images/landing-pages/red-bg-small.png';
import Link from 'next/link';
import PurpleButton from '@shared/buttons/PurpleButton';
import RedPurpleSection from '@shared/landing-pages/RedPurpleSection';

export default function BlogSection() {
  return (
    <RedPurpleSection>
      <div className="relative z-20">
        <div className="lg:w-[50%] mx-auto font-black text-3xl text-left  lg:text-center">
          Check out our blog for articles about running for office, Good
          Party&apos;s work, and more.
          <div className="text-center">
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
      </div>
    </RedPurpleSection>
  );
}
