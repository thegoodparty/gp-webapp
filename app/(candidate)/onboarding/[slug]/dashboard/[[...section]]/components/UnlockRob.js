import Link from 'next/link';
import { FaLock } from 'react-icons/fa';
import RobImg from 'public/images/campaign/rob1.png';
import Image from 'next/image';

export default function UnlockRob({ key }) {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-3 h-full" key={key}>
      <div className=" bg-white rounded-xl h-full flex flex-col justify-between relative">
        <div className="flex justify-center pt-4">
          <Image
            src="/images/heart.svg"
            alt="GP"
            width={64}
            height={64}
            className="block"
          />
        </div>
        <div className="px-6 pb-2">
          <h3 className="font-bold text-2xl text-center tracking-wider">
            EXPERT SUPPORT
          </h3>
          <div className="flex items-center mt-3">
            <div className="text-zinc-500 leading-relaxed text-sm">
              Unlock a one-on-one session with our Political Director, Rob
              Booth!
            </div>
            <div>
              <Image src={RobImg} height={120} width={120} alt="Rob" />
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center px-6 pb-4 text-sm ">
          <FaLock />
          <div className="pl-2">Access when Pre-Launch completed</div>
        </div>
      </div>
    </div>
  );
}
