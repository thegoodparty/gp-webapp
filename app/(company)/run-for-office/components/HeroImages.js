import Image from 'next/image';
// import heroLargeImg from 'public/images/run-page/hero-large.svg';

export default function HeroImages() {
  return (
    <div className="flex flex-auto h-[600px] mt-20 md:-mt-20 justify-center relative">
      <Image
        src="/images/run-page/hero-large.png"
        alt="GP-AI"
        fill
        className="object-contain"
      />
    </div>
  );
}
