import Image from 'next/image';
import bgImg from '/public/images/campaign/manager-bg.png';

export default function Hero({title}) {
  return (
    <div className=" w-[calc(100vw+32px)] -ml-4 -mt-2 lg:w-auto lg:ml-0 lg:mt-0 px-10 py-20 lg:p-10 bg-white lg:rounded-2xl relative overflow-hidden">
      <Image
        src="/images/campaign/team-bg.svg"
        fill
        className="object-cover lg:object-contain object-right-top"
        alt=""
      />
      <h1 className="font-black text-5xl relative">
      {title}
      </h1>
    </div>
  );
}
