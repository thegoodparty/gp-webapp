import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import heroImg from '/public/images/faqs/faq-hero.jpeg';

export default function Hero() {
  return (
    <div className="h-56 relative lg:h-[500px]">
      <Image
        src={heroImg}
        fill
        className="object-cover object-top"
        priority
        alt="Help Center"
        placeholder="blur"
      />
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: `linear-gradient(
                        180deg,
                        rgba(17, 17, 17, 0) 31.04%,
                        rgba(17, 17, 17, 0.2) 62.89%,
                        rgba(17, 17, 17, 0.8) 86.02%
                    )`,
        }}
      >
        <div className="max-w-7xl mx-auto flex h-56 lg:h-[500px] items-end py-6">
          <h1 className="font-black text-3xl text-white lg:text-8xl ">
            Help Center
          </h1>
        </div>
      </div>
    </div>
  );
}
