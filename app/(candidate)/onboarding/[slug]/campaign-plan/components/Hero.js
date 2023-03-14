import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import bgImg from '/public/images/campaign/manager-bg.png';

export default function Hero(props) {
  return (
    <div className="p-10 bg-white rounded-2xl relative">
      <Image
        src={bgImg}
        fill
        className="object-cover lg:object-contain object-right-top"
        alt=""
      />
      <h1 className="font-black text-5xl relative">Your Campaign Plan</h1>
    </div>
  );
}
