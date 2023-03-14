import Link from 'next/link';
import { FaLock } from 'react-icons/fa';
import RobImg from 'public/images/campaign/rob1.png';
import Image from 'next/image';

export default function UnlockRob({ key }) {
  return (
    <div
      className="col-span-12 md:col-span-6 lg:col-span-3 h-full pt-6"
      key={key}
    >
      <div className=" bg-white rounded-xl h-full flex flex-col justify-between relative">
        <div className="h-16 w-16 absolute left-1/2 -top-8 -ml-8">
          <Image
            src="/images/heart.svg"
            alt="GP"
            fill
            className="object-contain object-center"
          />
        </div>
        <div className="px-6 py-8">
          <h3 className="font-bold text-2xl text-center">Expert Support</h3>
          <div className="flex items-center mt-3">
            <div>
              Unlock a one-on-one session with our Political Director, Rob
              Booth!
            </div>
            <div>
              <Image src={RobImg} height={120} width={120} alt="Rob" />
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center px-6 pb-4 text-sm text-violet-500">
          <FaLock />
          <div className="pl-2">Access when Pre-Launch completed</div>
        </div>
      </div>
    </div>
  );
}
