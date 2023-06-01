import Image from 'next/image';
// import heroLargeImg from 'public/images/run-page/hero-large.svg';

export default function HeroImages() {
  return (
    <div className="flex mt-5 justify-center">
      <Image
        src="/images/run-page/hero-large.png"
        alt="GP-AI"
        width="200"
        height="400"
        //   className="shadow-lg rounded-full w-10 h-10"
      />
    </div>
  );
}
