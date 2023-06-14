import Image from 'next/image';

import candidatesImg from '/public/images/homepage-jan23/homepage-candidates.png';
import candidatesImgSm from '/public/images/homepage-jan23/your-name.jpg';
import PurpleButton from '@shared/buttons/PurpleButton';
import Link from 'next/link';

export default function HowSection() {
  return (
    <>
      <h3 className="text-4xl font-black text-center mb-20 mt-20">
        How Good Party works
      </h3>
      <div className="grid grid-cols-12 gap-3 relative items-center pb-14 lg:pb-0">
        <div className="col-span-12 md:col-span-6 justify-self-center lg:justify-self-end lg:pr-10">
          <div className="text-2xl mt-2 text-center">
            Make independent candidates viable
          </div>
          <div className="text-md mt-2 max-w-sm">
            Our free AI tools for campaigns, candidate recruitment, and team of
            experts are building up more competitive independent candidates
            across the country
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 justify-self-center lg:justify-self-start lg:pl-10">
          <div className="w-auto ml-0 flex relative">
            <Image
              src="/images/homepage/software.png"
              sizes="100vw"
              height={300}
              width={300}
              className="object-contain"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
}
