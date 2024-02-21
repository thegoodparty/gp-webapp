import MaxWidth from '@shared/layouts/MaxWidth';
import GraduateSpotlight from 'app/(landing)/academy-webinar/components/GraduateSpotlight';
import Image from 'next/image';
import TerryImg from 'public/images/run-for-office/terry-c.png';
import Graduates from './Graduates';

export default function GreatSuccess() {
  return (
    <section>
      <div className="relative">
        <div className="absolute top-0 w-full h-1/2 bg-primary"></div>
        <div className="relative z-10">
          <MaxWidth>
            <div className="grid grid-cols-12 bg-[#2A2E33] rounded-lg">
              <div className=" col-span-12 lg:col-span-3 p-5 lg:p-0">
                <Image
                  src={TerryImg}
                  alt="Terry C"
                  className="rounded-lg lg:rounded-none lg:rounded-l-lg w-full"
                />
              </div>
              <div className=" col-span-12 lg:col-span-9">
                <div className="p-5 lg:p-12 text-slate-600 text-2xl h-full flex items-center">
                  <div>
                    Running with Good Party means so many great things. It means
                    we are going to turn out more voters and turn around our
                    country in a way that is people-centered.
                    <div className="mt-6 text-slate-600 text-xl">
                      Terry C., Winner
                    </div>
                    <div className="text-lime-400 text-xl mt-1">
                      TN Metro Council, Nashville
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MaxWidth>
        </div>
      </div>
      <div>
        <MaxWidth>
          <h2 className="text-3xl lg:text-6xl font-semibold text-center mt-12 lg:mt-24">
            Success stories
          </h2>
          <h3 className="text-xl lg:px-12 font-normal mt-5 mb-5 lg:mb-16 text-center">
            Read about winners who used Good Party&apos;s tools
          </h3>
          <Graduates />
        </MaxWidth>
      </div>
    </section>
  );
}
