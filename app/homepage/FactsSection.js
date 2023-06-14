import PurpleButton from '@shared/buttons/PurpleButton';
import Link from 'next/link';
import Image from 'next/image';

export default function FactsSection() {
  return (
    <section className="bg-[#13161A] h-auto pt-20 pb-20">
      <div className="grid grid-cols-12 gap-3 relative">
        <div className="col-span-12 lg:col-span-6 justify-items-center pb-5">
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/images/homepage/progress.svg"
              sizes="100vw"
              height={100}
              width={100}
              className="object-cover"
              alt=""
            />
            <div className="text-slate-50 flex font-black p-3">
              <span className="text-3xl">3</span>&nbsp;
              <span className="text-2xl">out of</span>&nbsp;
              <span className="text-3xl">4</span>
            </div>
            <div className="flex text-lg font-black">
              <span className="text-gray-900">Americans want</span>&nbsp;
              <span className="text-lime-500">more</span>&nbsp;
            </div>
            <div className="flex text-lg font-black">
              <span className="text-lime-500">choices</span>&nbsp;
              <span className="text-gray-900">in politics</span>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/images/homepage/pie.svg"
              sizes="100vw"
              height={65}
              width={65}
              className="object-cover"
              alt=""
            />
            <div className="flex text-3xl font-black text-slate-50 p-3">
              52%
            </div>
            <div className="flex text-lg font-black">
              <span className="text-gray-900">of</span>&nbsp;
              <span className="text-[#847AFF]">Gen-Z</span>&nbsp;
              <span className="text-gray-900">and Millennials</span>&nbsp;
            </div>
            <div className="flex text-lg font-black">
              <span className="text-gray-900">identify as an</span>&nbsp;
              <span className="text-[#847AFF]">Independent</span>&nbsp;
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 relative justify-center items-center mt-10">
        <div className="col-span-12 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center max-w-[500px]">
            <Image
              src="/images/homepage/heart.svg"
              sizes="100vw"
              height={120}
              width={120}
              className="object-cover"
              alt=""
            />
            <div className="flex text-lg text-slate-50">
              Good Party is a movement bringing together
            </div>
            <div className="flex text-lg text-slate-50">
              <span class="flex text-lg text-red-400">voters</span>&nbsp;and
              exciting&nbsp;
              <span class="flex text-lg text-red-400">
                independent candidates&nbsp;
              </span>
              that&nbsp;<span class="flex text-lg text-red-400">can win</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
