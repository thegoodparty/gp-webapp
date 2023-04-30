import Image from 'next/image';
import { FaLock } from 'react-icons/fa';

export default function LaunchCard({ campaignStatus }) {
  const { status } = campaignStatus.launch;
  return (
    <div className="col-span-12">
      <div className="lg:w-1/2 border-[3px] border-black rounded-xl px-5 py-10 flex items-center justify-center relative">
        {status === 'locked' && (
          <div className="absolute top-3 right-3">
            <div className="bg-zinc-400 bg-opacity-30   py-2 px-3 rounded-full">
              <FaLock />
            </div>
          </div>
        )}
        <div className="w-24 h-24 basis-24 shrink-0">
          <Image
            src="/images/campaign/rocket.svg"
            alt="Launch"
            width={96}
            height={96}
          />
        </div>
        <div className="pl-6">
          <h3 className="text-bold text-3xl mb-4">Launch Your Campaign</h3>
          <div className="text-neutral-500 text-sm">
            Effortlessly launch with our comprehensive guide, streamlining:
            setup, messaging, fundraising, and voter engagement
          </div>
          {status === 'locked' ? (
            <div className=" bg-zinc-400 inline-block py-3 px-4 font-bold rounded-lg mt-4 cursor-not-allowed">
              LAUNCH CAMPAIGN
            </div>
          ) : (
            <div className=" bg-gp-yellow inline-block py-3 px-4 font-bold rounded-lg mt-4 cursor-pointer">
              LAUNCH CAMPAIGN
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
