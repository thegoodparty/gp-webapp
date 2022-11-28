import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="h-56 relative lg:h-[500px]">
      <Image
        src="https://assets.goodparty.org/faq-hero-new.jpg"
        fill
        className="object-cover object-top"
        priority
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
