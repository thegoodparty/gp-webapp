import Image from 'next/image';
import RunCampaignButton from './RunCampaignButton';
import Link from 'next/link';
import WhiteButton from './WhiteButton';

export default function StartedBottom() {
  return (
    <>
      <div className="bg-[linear-gradient(172deg,_#EEF3F7_54.5%,_#D8ED50_55%)] h-[calc(100vw*.17)] w-full" />
      <section className="bg-[#D8ED50] flex flex-col items-center pt-12 pb-12 lg:pb-24">
        <Image
          src="/images/logo-hologram-white.svg"
          alt="GoodParty"
          width={136}
          height={111}
        />
        <h2 className="text-3xl lg:text-6xl font-semibold text-center mt-4">
          Get started
        </h2>
        <h3 className="text-xl lg:px-12 font-normal mt-5 mb-10  text-center">
          Try our tools risk free to scale your campaign,
          <br />
          or get a demo with one of our campaign experts.
        </h3>
        <div className="mt-10 flex">
          <RunCampaignButton id="bottom-get-started" />
          <Link href="/get-a-demo" id="bottom-demo" className="block ml-5">
            <WhiteButton label="Get a Demo" />
          </Link>
        </div>
      </section>
    </>
  );
}
