import PrimaryButton from '@shared/buttons/PrimaryButton';
import MaxWidth from '@shared/layouts/MaxWidth';
import Link from 'next/link';
import Image from 'next/image';
import winImg from 'public/images/landing-pages/win.png';

export default function HelpWin() {
  return (
    <>
      <div className="bg-[linear-gradient(176deg,_#EEF3F7_54.5%,_#EFF265_55%)] h-[calc(100vw*0.09)] w-full" />
      <section className="bg-yellow-500 py-12">
        <MaxWidth>
          <h2 className="lg:w-1/2 lg:mx-auto text-3xl md:text-6xl font-semibold text-center mb-20">
            Volunteer and help indie candidates WIN!
          </h2>
          <div className="grid grid-cols-12 gap-8">
            <div className=" col-span-12 md:col-span-6">
              <h3 className=" text-2xl font-semibold">
                Use your skills for good
              </h3>
              <div className=" font-sfpro text-lg my-4">
                Stay up to date on the latest volunteer news and opportunities
                via text.
              </div>
              <Link
                href="/info-session"
                id="schedule-info-session"
                className="hidden md:block"
              >
                <PrimaryButton>Schedule info session</PrimaryButton>
              </Link>
              <Link
                href="/info-session"
                id="schedule-info-session"
                className=" md:hidden"
              >
                <PrimaryButton fullWidth>Schedule info session</PrimaryButton>
              </Link>
            </div>
            <div className=" col-span-12 md:col-span-6 hidden md:block">
              <div className="mx-12 xl:mx-20">
                <Image src={winImg} alt="Win" />
              </div>
            </div>
          </div>
        </MaxWidth>
      </section>
    </>
  );
}
