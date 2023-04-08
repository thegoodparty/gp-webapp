import Pill from '@shared/buttons/Pill';
import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import jaredImg from 'public/images/campaign/jared.jpg';
import Chat from './Chat';

export default function Hero() {
  return (
    <MaxWidth>
      <div className="grid grid-cols-12 gap-6 py-16">
        <div className="col-span-12 lg:col-span-6">
          <h1 className="font-black text-6xl">
            Free tools and expertise to run winning campaigns
          </h1>
          <h2 className="mt-3 mb-12 text-xl">
            Free tools, training, and expert knowledge to help independent and
            third-party candidates run winning campaigns.
          </h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <Pill className=" bg-yellow-400 border-yellow-400 w-full">
                <div className="text-black tracking-wide">GET STARTED</div>
              </Pill>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <Pill outlined className="w-full">
                <div className="tracking-wide">GET A DEMO</div>
              </Pill>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 text-center">
          {/* <Image
            src={jaredImg}
            width={80}
            height={80}
            alt="Jared"
            className="rounded-full border-4 border-yellow-400 mx-auto shadow-xl"
          />
          <div className="text-2xl font-black mt-4">
            Hey! I&apos;m Jared.
            <br />
            Let&apos;s build your custom campaign
          </div> */}
          <Chat />
        </div>
      </div>
    </MaxWidth>
  );
}
