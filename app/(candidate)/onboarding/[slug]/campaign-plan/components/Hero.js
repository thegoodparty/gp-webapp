import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import bgImg from '/public/images/campaign/manager-bg.png';
import AiIcon from 'public/images/campaign/gp-ai.png';

export default function Hero(props) {
  return (
    <>
      <div className="p-10 bg-white rounded-2xl relative">
        <Image
          src={bgImg}
          fill
          className="object-cover lg:object-contain object-right-top"
          alt=""
        />
        <h1 className="font-black text-5xl relative">Your Campaign Plan</h1>
      </div>
      <div className="text-lg font-black mt-4 flex items-center justify-end">
        <div>generate by AI Campaign Manager</div>
        <div>
          <Image
            src="/images/campaign/ai-icon.svg"
            alt="GP-AI"
            width={40}
            height={40}
            className="ml-2
             w-10 h-10"
          />
        </div>
      </div>
    </>
  );
}
